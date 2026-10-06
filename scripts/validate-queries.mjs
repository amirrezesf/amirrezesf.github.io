#!/usr/bin/env node
/**
 * Validates the GraphQL queries in fetch-pinned-repos.mjs against GitHub's
 * published schema. A malformed query only fails when the script runs in CI,
 * which is easy to miss; this catches it locally instead.
 *
 *   node scripts/validate-queries.mjs [path/to/schema.docs.graphql]
 *
 * With no argument the schema is downloaded and cached in the temp dir. Point
 * at a cached copy to avoid the download.
 *
 * Checks unknown fields, unsupported arguments, and unknown keys inside input
 * object literals. Named fragments are resolved via the schema's definitions.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FETCH_SCRIPT = resolve(__dirname, "fetch-pinned-repos.mjs");
const SCHEMA_URL = "https://docs.github.com/public/fpt/schema.docs.graphql";

async function loadSchema(arg) {
  if (arg) {
    if (!existsSync(arg)) throw new Error(`No such schema file: ${arg}`);
    return readFile(arg, "utf8");
  }
  console.log("Downloading GitHub's GraphQL schema...");
  const res = await fetch(SCHEMA_URL, { headers: { "User-Agent": "validate-queries" } });
  if (!res.ok) throw new Error(`Schema download failed: ${res.status} ${res.statusText}`);
  const text = await res.text();
  const cache = join(tmpdir(), "github-schema.docs.graphql");
  await writeFile(cache, text, "utf8");
  console.log(`Cached to ${cache} (${(text.length / 1024).toFixed(0)} KB)\n`);
  return text;
}

/** Removes """docstring""" blocks so their contents cannot be parsed as SDL. */
function stripDocstrings(sdl) {
  return sdl.replace(/"""[\s\S]*?"""/g, " ");
}

/** Removes trailing # comments. */
function stripComments(sdl) {
  return sdl
    .split("\n")
    .map((line) => {
      let inStr = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"' && line[i + 1] === '"') {
          inStr = !inStr;
          i++;
        } else if (line[i] === "#" && !inStr) return line.slice(0, i);
      }
      return line;
    })
    .join("\n");
}

/** Index of the '}' matching the '{' at `open`, or -1. */
function matchBrace(sdl, open) {
  let depth = 0;
  for (let i = open; i < sdl.length; i++) {
    if (sdl[i] === "{") depth++;
    else if (sdl[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Parses a type body into { field: { type, args } }.
 *
 * Field and argument declarations each start their own line, but the published
 * schema indents by two spaces, so lines are trimmed before matching. Argument
 * lists may span lines, hence the paren-depth counter.
 */
function collectFields(body) {
  const fields = {};
  const lines = body.split("\n").map((l) => l.trim());
  let i = 0;

  while (i < lines.length) {
    // Skip blank lines and anything left over from stripped docstrings.
    if (!/^\w+\s*(\(|:)/.test(lines[i])) {
      i++;
      continue;
    }

    const [, name, next] = lines[i].match(/^(\w+)\s*(\(|:)/);

    if (next === "(") {
      let depth = 0;
      let blob = "";
      let j = i;
      do {
        blob += (blob ? "\n" : "") + lines[j];
        for (const c of lines[j]) {
          if (c === "(") depth++;
          else if (c === ")") depth--;
        }
        j++;
      } while (j < lines.length && depth > 0);

      const args = {};
      // Each argument is "name: Type". The separator before the first argument
      // is the "(" of the list itself, so "(" must be part of the boundary set.
      for (const am of blob.matchAll(/(?:^|[\s,{(])([A-Za-z_]\w*)\s*:\s*([\[\]\w!]+)/gm)) {
        args[am[1]] = am[2];
      }
      const tm = blob.slice(blob.lastIndexOf(")")).match(/\)\s*:\s*([\[\]\w!]+)/);
      fields[name] = { type: tm ? tm[1] : "?", args };
      i = j;
    } else {
      const tm = lines[i].match(/^(\w+)\s*:\s*([\[\]\w!]+)/);
      fields[name] = { type: tm ? tm[2] : "?", args: {} };
      i++;
    }
  }
  return fields;
}

/** Builds { types, fragments } from the schema SDL. */
function indexSchema(schema) {
  const sdl = stripComments(stripDocstrings(schema));

  const types = {};
  for (const m of sdl.matchAll(/^(?:type|input|interface)\s+(\w+)[^{]*\{/gm)) {
    const open = m.index + m[0].length - 1;
    const close = matchBrace(sdl, open);
    if (close !== -1) types[m[1]] = collectFields(sdl.slice(open + 1, close));
  }

  const fragments = {};
  for (const m of sdl.matchAll(/fragment\s+(\w+)\s+on\s+(\w+)\s*\{/g)) {
    const open = m.index + m[0].length - 1;
    const close = matchBrace(sdl, open);
    if (close !== -1) fragments[m[1]] = { on: m[2], body: sdl.slice(open + 1, close) };
  }

  return { types, fragments };
}

/** Unwraps [Type!]! to Type. */
function namedType(t) {
  return (t || "").replace(/[\[\]!]/g, "");
}

/** Skips whitespace and commas at the cursor. */
function skipTrivia(text, pos) {
  while (pos.i < text.length && /[\s,]/.test(text[pos.i])) pos.i++;
}

/** Consumes "(...)" if present. */
function skipArgs(text, pos) {
  skipTrivia(text, pos);
  if (text[pos.i] !== "(") return;
  let depth = 0;
  for (; pos.i < text.length; pos.i++) {
    if (text[pos.i] === "(") depth++;
    else if (text[pos.i] === ")") {
      depth--;
      if (depth === 0) {
        pos.i++;
        return;
      }
    }
  }
}

/** Consumes a balanced "{...}" selection set if present. */
function skipSet(text, pos) {
  skipTrivia(text, pos);
  if (text[pos.i] !== "{") return;
  let depth = 0;
  for (; pos.i < text.length; pos.i++) {
    if (text[pos.i] === "{") depth++;
    else if (text[pos.i] === "}") {
      depth--;
      if (depth === 0) {
        pos.i++;
        return;
      }
    }
  }
}

/** Splits "(a: 1, b: {c: 2})" into [["a","1"],["b","{c: 2}"]]. */
function parseArguments(text, pos) {
  pos.i++;
  const args = [];
  let depth = 0;
  let start = pos.i;

  while (pos.i < text.length) {
    const c = text[pos.i];
    if (c === "(" || c === "{") depth++;
    else if (c === ")" && depth === 0) {
      const chunk = text.slice(start, pos.i);
      const idx = chunk.indexOf(":");
      if (idx !== -1) args.push([chunk.slice(0, idx).trim(), chunk.slice(idx + 1).trim()]);
      pos.i++;
      return args;
    } else if (c === "}" || c === ")") depth--;
    else if (c === "," && depth === 0) {
      const chunk = text.slice(start, pos.i);
      const idx = chunk.indexOf(":");
      if (idx !== -1) args.push([chunk.slice(0, idx).trim(), chunk.slice(idx + 1).trim()]);
      pos.i++;
      start = pos.i;
      continue;
    }
    pos.i++;
  }
  return args;
}

/** Splits an object literal body on top-level commas. */
function splitTopLevel(body) {
  const parts = [];
  let depth = 0;
  let buf = "";
  for (const c of body) {
    if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") depth--;
    if (c === "," && depth === 0) {
      parts.push(buf);
      buf = "";
    } else buf += c;
  }
  if (buf.trim()) parts.push(buf);
  return parts;
}

/** Recursively verifies an argument literal against its input type. */
function validateInputValue(value, typeName, where, schema, errors) {
  if (/^\$/.test(value.trim())) return; // variable: resolved at runtime

  const isList = (typeName || "").includes("[");
  const v = value.trim();
  const baseType = namedType(typeName);
  const def = schema.types[baseType];
  if (!def) return;

  if (isList) {
    const inner = v.replace(/^\[/, "").replace(/\]$/, "");
    for (const item of splitTopLevel(inner)) {
      if (item.trim()) validateInputValue(item.trim(), baseType, where, schema, errors);
    }
    return;
  }

  if (!v.startsWith("{")) return;

  const inner = v.replace(/^\{/, "").replace(/\}$/, "");
  for (const part of splitTopLevel(inner)) {
    const idx = part.indexOf(":");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (!def[key]) {
      const list = Object.keys(def);
      errors.push(
        `Argument ${where}: input type '${baseType}' has no field '${key}'` +
          (list.length ? ` (accepts: ${list.slice(0, 12).join(", ")})` : ""),
      );
      continue;
    }
    validateInputValue(val, def[key].type, `${where}.${key}`, schema, errors);
  }
}

/** Validates a selection set against `parentType`. */
function validateSelectionSet(text, pos, parentType, schema, errors, path) {
  const { types, fragments } = schema;

  for (;;) {
    skipTrivia(text, pos);
    if (pos.i >= text.length) return;
    if (text[pos.i] === "}") {
      pos.i++;
      return;
    }

    // Fragment spread or inline fragment.
    if (text.startsWith("...", pos.i)) {
      pos.i += 3;
      skipTrivia(text, pos);

      if (text[pos.i] === "{") {
        // Inline fragment with no type condition.
        pos.i++;
        validateSelectionSet(text, pos, parentType, schema, errors, path);
        continue;
      }

      if (text.startsWith("on ", pos.i)) {
        pos.i += 3;
        skipTrivia(text, pos);
        const ts = pos.i;
        while (pos.i < text.length && /\w/.test(text[pos.i])) pos.i++;
        const condType = text.slice(ts, pos.i);
        skipTrivia(text, pos);
        if (text[pos.i] === "{") {
          pos.i++;
          validateSelectionSet(text, pos, condType, schema, errors, path);
        }
        continue;
      }

      const fs = pos.i;
      while (pos.i < text.length && /\w/.test(text[pos.i])) pos.i++;
      const fragName = text.slice(fs, pos.i);

      if (fragments[fragName]) {
        const f = fragments[fragName];
        if (f.on !== parentType) {
          errors.push(
            `Fragment '${fragName}' is defined on '${f.on}' but spread inside '${parentType}'`,
          );
        }
        validateSelectionSet(f.body, { i: 0 }, f.on, schema, errors, path);
      } else {
        errors.push(`Unknown fragment '${fragName}'`);
      }
      continue;
    }

    // Field, possibly aliased ("name: field").
    const ns = pos.i;
    while (pos.i < text.length && /\w/.test(text[pos.i])) pos.i++;
    let field = text.slice(ns, pos.i);

    if (!field) {
      pos.i++;
      continue;
    }

    skipTrivia(text, pos);
    if (text[pos.i] === ":") {
      pos.i++;
      skipTrivia(text, pos);
      const fs = pos.i;
      while (pos.i < text.length && /\w/.test(text[pos.i])) pos.i++;
      field = text.slice(fs, pos.i);
    }

    const parentFields = types[parentType];
    if (!parentFields) {
      errors.push(`Unknown type '${parentType}' (at ${path})`);
      return;
    }

    const fieldDef = parentFields[field];
    if (!fieldDef) {
      errors.push(`Field '${field}' does not exist on type '${parentType}'`);
      skipArgs(text, pos);
      skipSet(text, pos);
      continue;
    }

    skipTrivia(text, pos);
    if (text[pos.i] === "(") {
      for (const [argName, argValue] of parseArguments(text, pos)) {
        const argDef = fieldDef.args[argName];
        if (!argDef) {
          const list = Object.keys(fieldDef.args);
          errors.push(
            `Field '${parentType}.${field}' does not accept argument '${argName}'` +
              (list.length ? ` (accepts: ${list.join(", ")})` : " (takes no arguments)"),
          );
          continue;
        }
        validateInputValue(argValue, argDef, `${parentType}.${field}(${argName})`, schema, errors);
      }
    }

    skipTrivia(text, pos);
    if (text[pos.i] === "{") {
      pos.i++;
      validateSelectionSet(text, pos, namedType(fieldDef.type), schema, errors, `${path}.${field}`);
    }
  }
}

/** Extracts the named query constants from the fetch script. */
function extractQueries(src) {
  const queries = [];
  for (const m of src.matchAll(/const\s+(\w+_QUERY)\s*=\s*`([\s\S]*?)`;/g)) {
    queries.push({ name: m[1], body: m[2] });
  }
  return queries;
}

function validateQuery(query, schema) {
  const errors = [];
  const text = stripDocstrings(query);

  const braceIdx = text.indexOf("{");
  if (braceIdx === -1) {
    errors.push("No selection set found in query");
    return errors;
  }

  const header = text.slice(0, braceIdx);
  const op = header.match(/\b(mutation|subscription)\b/);
  let root = "Query";
  if (op) root = op[1][0].toUpperCase() + op[1].slice(1);

  validateSelectionSet(text, { i: braceIdx + 1 }, root, schema, errors, "");
  return errors;
}

// --- main ---------------------------------------------------------------

const schema = indexSchema(await loadSchema(process.argv[2]));
console.log(
  `Indexed ${Object.keys(schema.types).length} types and ${Object.keys(schema.fragments).length} fragments.\n`,
);

const queries = extractQueries(await readFile(FETCH_SCRIPT, "utf8"));
if (queries.length === 0) {
  console.error(`No queries found in ${FETCH_SCRIPT}.`);
  process.exit(1);
}

let failed = 0;
for (const { name, body } of queries) {
  const errors = validateQuery(body, schema);
  if (errors.length === 0) {
    console.log(`PASS  ${name}`);
  } else {
    failed++;
    console.log(`FAIL  ${name}`);
    for (const e of errors) console.log(`        ${e}`);
  }
}

console.log(
  failed === 0
    ? `\nAll ${queries.length} queries valid against GitHub's schema.`
    : `\n${failed} query(ies) invalid.`,
);
process.exit(failed === 0 ? 0 : 1);