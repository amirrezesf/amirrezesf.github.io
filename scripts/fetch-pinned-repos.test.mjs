/**
 * Tests for fetch-pinned-repos.mjs against a stubbed GitHub API.
 * Run: node scripts/fetch-pinned-repos.test.mjs
 *
 * Uses PINNED_REPOS_OUTPUT so writes land in a temp dir, never in src/data.
 */
import { mkdtemp, readFile, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(__dirname, "fetch-pinned-repos.mjs");

/** Builds a GraphQL repository node, pre-expanding the connection shapes. */
function repo(o) {
  return {
    stargazerCount: 0,
    forkCount: 0,
    isArchived: false,
    homepageUrl: "",
    description: "",
    pushedAt: "2026-01-01T00:00:00Z",
    primaryLanguage: null,
    ...o,
    languages: {
      nodes: (o.languages || []).map((name) => ({ name })),
    },
    repositoryTopics: {
      nodes: (o.topics || []).map((name) => ({ topic: { name } })),
    },
  };
}

const PINNED_REPOS = [
  repo({
    name: "Finance-App",
    nameWithOwner: "amirrezesf/Finance-App",
    url: "https://github.com/amirrezesf/Finance-App",
    description: "Flutter finance UI",
    stargazerCount: 3,
    forkCount: 1,
    primaryLanguage: { name: "Dart" },
    languages: ["Dart", "HTML"],
    topics: ["flutter", "awesome"],
  }),
  repo({
    name: "Archived-Thing",
    nameWithOwner: "amirrezesf/Archived-Thing",
    url: "https://github.com/amirrezesf/Archived-Thing",
    isArchived: true,
    homepageUrl: "https://demo.example.com",
  }),
];

// Mirrors TOP_REPOS_QUERY, which filters server-side (isArchived: false).
const RECENT_REPOS = PINNED_REPOS.filter((r) => !r.isArchived);

/** Minimal stub standing in for the GraphQL endpoint. */
function makeFetch(pinnedNodes, fallbackNodes, failWith) {
  return async (_url, opts) => {
    if (failWith) {
      return { ok: false, status: failWith, statusText: "Error", json: async () => ({}) };
    }
    const body = JSON.parse(opts.body);
    const isPinned = body.query.includes("pinnedItems");
    return {
      ok: true,
      status: 200,
      async json() {
        return {
          data: {
            user: isPinned
              ? { pinnedItems: { nodes: pinnedNodes } }
              : { repositories: { nodes: fallbackNodes } },
          },
        };
      },
    };
  };
}

let failures = 0;
function check(name, cond, detail = "") {
  console.log(`${cond ? "  PASS" : "  FAIL"}  ${name}${cond ? "" : `   -> ${detail}`}`);
  if (!cond) failures++;
}

async function runScript({
  pinned = [],
  fallback = RECENT_REPOS,
  existing = null,
  failWith = null,
  token = "fake-token",
} = {}) {
  const dir = await mkdtemp(join(tmpdir(), "pinned-test-"));
  const outFile = join(dir, "pinnedRepos.json");
  if (existing) await writeFile(outFile, JSON.stringify(existing, null, 2), "utf8");

  const harness = join(dir, "harness.mjs");
  await writeFile(harness, `globalThis.fetch = globalThis.__stub;\nawait import(${JSON.stringify(SCRIPT)});\n`, "utf8");

  const res = spawnSync(
    process.execPath,
    [
      "--import",
      "data:text/javascript," +
        encodeURIComponent(
          `globalThis.__stub = (${makeFetch.toString()})(${JSON.stringify(pinned)}, ${JSON.stringify(fallback)}, ${JSON.stringify(failWith)});`,
        ),
      harness,
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        GITHUB_TOKEN: token,
        PINNED_REPOS_OUTPUT: outFile,
        GITHUB_USERNAME: "amirrezesf",
      },
    },
  );

  let json = null;
  try {
    json = JSON.parse(await readFile(outFile, "utf8"));
  } catch {
    /* file absent */
  }
  await rm(dir, { recursive: true, force: true });
  return { status: res.status, stdout: res.stdout || "", stderr: res.stderr || "", json, outFile };
}

// --- 1. Happy path -----------------------------------------------------
console.log("\nhappy path");
{
  const r = await runScript({ pinned: PINNED_REPOS });
  check("exits 0", r.status === 0, r.stderr);
  check("source = 'pinned'", r.json?.source === "pinned", String(r.json?.source));
  // Archived repos stay in the JSON on purpose: un-archiving on GitHub should
  // bring the project back without a manual edit. The React layer filters them.
  check("archived repo kept in JSON with flag set", r.json?.repos.some((x) => x.archived === true), JSON.stringify(r.json?.repos.map((x) => x.archived)));
  check("archived flag survives the transform", r.json?.repos.length === 2, `got ${r.json?.repos?.length}`);
  check("nameWithOwner kept", r.json?.repos[0].nameWithOwner === "amirrezesf/Finance-App");

  const t = r.json?.repos[0]?.techStack || [];
  check("Dart surfaced as 'Flutter'", t.includes("Flutter"), JSON.stringify(t));
  check("primary language not duplicated", !t.includes("Dart"), JSON.stringify(t));
  check("'flutter' topic merged into one badge", t.filter((x) => x.toLowerCase() === "flutter").length === 1, JSON.stringify(t));
  check("secondary language kept", t.includes("HTML"), JSON.stringify(t));
  check("meaningful topic kept", r.json?.repos[0].topics.includes("flutter"));
  check("generic topic 'awesome' dropped", !r.json?.repos[0].topics.includes("awesome"));
  check("empty homepage -> liveUrl null", r.json?.repos[0].liveUrl === null, String(r.json?.repos[0].liveUrl));
  check("category falls back to labelled language", r.json?.repos[0].category === "Flutter", String(r.json?.repos[0].category));
  check("stars and forks mapped", r.json?.repos[0].stars === 3 && r.json?.repos[0].forks === 1);
}

// --- 2. Live URL passthrough ------------------------------------------
console.log("\nhomepage passthrough");
{
  const r = await runScript({ pinned: PINNED_REPOS });
  const archived = r.json?.repos.find((x) => x.name === "Archived-Thing");
  check("archived repo retained in JSON (filtered at render)", !!archived);
  check("real homepageUrl becomes liveUrl", archived?.liveUrl === "https://demo.example.com", String(archived?.liveUrl));
}

// --- 3. Fallback when nothing is pinned -------------------------------
console.log("\nfallback when nothing is pinned");
{
  const r = await runScript({ pinned: [] });
  check("exits 0", r.status === 0, r.stderr);
  check("source = 'recent'", r.json?.source === "recent", String(r.json?.source));
  check("fallback excludes archived", r.json?.repos.every((x) => !x.archived));
  check("fallback warns the user", r.stderr.includes("falling back"), r.stderr);
}

// --- 4. Failure keeps the previous snapshot ---------------------------
console.log("\nauth failure is non-destructive");
{
  const previous = {
    generatedAt: "old",
    username: "amirrezesf",
    source: "pinned",
    repos: [{ name: "Keep-Me" }],
  };
  const r = await runScript({ pinned: [], existing: previous, failWith: 401 });
  check("exits non-zero", r.status !== 0, String(r.status));
  check("previous snapshot preserved", r.json?.repos?.[0]?.name === "Keep-Me", JSON.stringify(r.json?.repos));
  check("explains it kept the old data", r.stderr.includes("Keeping the existing"), r.stderr);
}

// --- 5. Missing token --------------------------------------------------
console.log("\nmissing token");
{
  const r = await runScript({ pinned: [], token: "" });
  check("exits non-zero", r.status !== 0, String(r.status));
  check("names the required env var", r.stderr.includes("GITHUB_TOKEN"), r.stderr);
}

// --- 6. Idempotence ----------------------------------------------------
console.log("\nidempotent rewrite");
{
  const first = await runScript({ pinned: PINNED_REPOS });
  const second = await runScript({ pinned: PINNED_REPOS, existing: first.json });
  check("unchanged data skips the write", second.stdout.includes("Unchanged"), second.stdout);
}

console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);