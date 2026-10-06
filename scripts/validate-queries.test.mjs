/**
 * Tests for validate-queries.mjs. The validator silently passed a malformed
 * query once already, so it is tested against known-bad input.
 *
 * Uses a small hand-written schema so the tests need no network access.
 * Run: node scripts/validate-queries.test.mjs
 */
import { spawnSync } from "node:child_process";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VALIDATOR = resolve(__dirname, "validate-queries.mjs");

// A miniature schema mirroring GitHub's shape: two-space indentation,
// """docstrings""", nested input objects, and a field whose arguments matter.
const SCHEMA = `
schema {
  query: Query
}

"""A repository on GitHub."""
type Repository implements Node @docsCategory(name: "meta") {
  """The repository's name."""
  name: String!

  """Primary language."""
  primaryLanguage: Language

  """Language breakdown."""
  languages(
    """Returns the first _n_ elements."""
    first: Int
    orderBy: LanguageOrder
  ): LanguageConnection

  repositoryTopics(first: Int): RepositoryTopicConnection
}

type Language {
  name: String!
}

type LanguageConnection {
  nodes: [Language]
}

input LanguageOrder {
  "Order by size."
  field: LanguageOrderField
  direction: OrderDirection
}

enum LanguageOrderField {
  SIZE
}

enum OrderDirection {
  ASC
  DESC
}

type RepositoryTopicConnection {
  nodes: [RepositoryTopic]
}

type RepositoryTopic {
  topic: Topic!
}

type Topic {
  name: String!
}

type User implements Node {
  "Pinned items."
  pinnedItems(
    first: Int
    "Only repositories."
    types: PinnedType
  ): PinnedItemConnection
}

enum PinnedType {
  REPOSITORY
}

type PinnedItemConnection {
  nodes: [PinnedItem]
}

union PinnedItem = Repository

type Query implements Node @docsCategory(name: "meta") {
  user(login: String!): User
}
`;

let failures = 0;
function check(name, cond, detail = "") {
  console.log(`${cond ? "  PASS" : "  FAIL"}  ${name}${cond ? "" : `   -> ${detail}`}`);
  if (!cond) failures++;
}

async function withSchema(fn) {
  const dir = await mkdtemp(join(tmpdir(), "gqlschema-"));
  const path = join(dir, "schema.graphql");
  await writeFile(path, SCHEMA, "utf8");
  try {
    return await fn(path);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/**
 * Runs the validator's checking logic against a query by writing a temporary
 * fetch script shaped like the real one.
 */
async function validate(queryBody, name = "TEST_QUERY") {
  return withSchema(async (schemaPath) => {
    const dir = await mkdtemp(join(tmpdir(), "gqlquery-"));
    const fake = join(dir, "fake-fetch.mjs");
    await writeFile(fake, `const ${name} = \`${queryBody}\`;\nexport { ${name} };\n`, "utf8");

    // Point the validator at the fake script for this run.
    const patched = join(dir, "validator.mjs");
    const src = await import("node:fs").then((fs) =>
      fs.readFileSync(VALIDATOR, "utf8"),
    );
    await writeFile(
      patched,
      src.replace(
        /const FETCH_SCRIPT = resolve\(__dirname, "[^"]+"\);/,
        `const FETCH_SCRIPT = ${JSON.stringify(fake)};`,
      ),
      "utf8",
    );
    // The patched copy resolves __dirname to the temp dir; give it the schema
    // path explicitly.
    const res = spawnSync(process.execPath, [patched, schemaPath], { encoding: "utf8" });
    await rm(dir, { recursive: true, force: true });
    return res;
  });
}

const VALID = `
  query Test($login: String!, $count: Int!) {
    user(login: $login) {
      pinnedItems(first: $count, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            primaryLanguage { name }
            languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
              nodes { name }
            }
            repositoryTopics(first: 8) { nodes { topic { name } } }
          }
        }
      }
    }
  }
`;

console.log("\naccepts a correct query");
{
  const r = await validate(VALID);
  const out = r.stdout || "";
  check("exits 0", r.status === 0, out + r.stderr);
  check("reports PASS", out.includes("PASS  TEST_QUERY"), out);
}

console.log("\nrejects the 'order' typo (the bug that broke CI)");
{
  const broken = VALID.replace("orderBy:", "order:");
  const r = await validate(broken);
  const out = r.stdout || "";
  check("exits non-zero", r.status !== 0, String(r.status));
  check("names the bad argument", out.includes("does not accept argument 'order'"), out);
  check("lists the valid arguments", out.includes("orderBy"), out);
}

console.log("\nrejects an unknown field");
{
  const broken = VALID.replace("primaryLanguage { name }", "primaryLangauge { name }");
  const r = await validate(broken);
  const out = r.stdout || "";
  check("exits non-zero", r.status !== 0, String(r.status));
  check("names the unknown field", out.includes("primaryLangauge"), out);
}

console.log("\nrejects an unknown key inside an input object");
{
  const broken = VALID.replace("field: SIZE", "fields: SIZE");
  const r = await validate(broken);
  const out = r.stdout || "";
  check("exits non-zero", r.status !== 0, String(r.status));
  check("names the bad input field", out.includes("'fields'"), out);
}

console.log("\nrejects an unknown fragment type");
{
  const broken = VALID.replace("... on Repository {", "... on Repositor {");
  const r = await validate(broken);
  const out = r.stdout || "";
  check("exits non-zero", r.status !== 0, String(r.status));
  check("reports unknown type", out.includes("Repositor"), out);
}

console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);