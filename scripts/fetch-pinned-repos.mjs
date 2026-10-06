#!/usr/bin/env node
/**
 * Fetches the GitHub user's pinned repositories and writes them to
 * src/data/pinnedRepos.json, which the site imports at build time.
 *
 * Pinned items are only available through the GraphQL API (there is no REST
 * endpoint), so a token is required.
 *
 *   GITHUB_USERNAME=amirrezesf GITHUB_TOKEN=ghp_xxx node scripts/fetch-pinned-repos.mjs
 *
 * Token resolution order: GITHUB_TOKEN, GH_TOKEN, GITHUB_API_TOKEN.
 * On failure the existing JSON is left untouched so a bad fetch can never
 * wipe the project list.
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractBannerPaths, chooseBanner, rawUrl, processBanner } from "./banners.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const USERNAME = process.env.GITHUB_USERNAME || "amirrezesf";
// PINNED_REPOS_OUTPUT is overridable so the test suite can redirect writes
// into a temp directory instead of clobbering the real snapshot.
const OUTPUT = process.env.PINNED_REPOS_OUTPUT
  ? resolve(process.env.PINNED_REPOS_OUTPUT)
  : resolve(__dirname, "../src/data/pinnedRepos.json");
const MAX_PINNED = 6; // GitHub allows pinning at most 6 repositories

const PINNED_QUERY = `
  query PinnedRepos($login: String!, $count: Int!) {
    user(login: $login) {
      pinnedItems(first: $count, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            nameWithOwner
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            isArchived
            pushedAt
            defaultBranchRef { name }
            primaryLanguage { name }
            languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
              nodes { name }
            }
            repositoryTopics(first: 8) {
              nodes { topic { name } }
            }
            readme: object(expression: "HEAD:README.md") {
              ... on Blob { text }
            }
          }
        }
      }
    }
  }
`;

// Used only when the account has nothing pinned, so the site is never empty.
const TOP_REPOS_QUERY = `
  query TopRepos($login: String!, $count: Int!) {
    user(login: $login) {
      repositories(
        first: $count
        isFork: false
        isArchived: false
        privacy: PUBLIC
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          name
          nameWithOwner
          description
          url
          homepageUrl
          stargazerCount
          forkCount
          isArchived
          pushedAt
          defaultBranchRef { name }
          primaryLanguage { name }
          languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
            nodes { name }
          }
          repositoryTopics(first: 8) {
            nodes { topic { name } }
          }
          readme: object(expression: "HEAD:README.md") {
            ... on Blob { text }
          }
        }
      }
    }
  }
`;

const token =
  process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_API_TOKEN;

if (!token) {
  console.error(
    "Missing GITHUB_TOKEN. Pinned repositories require an authenticated GraphQL request.",
  );
  process.exit(1);
}

async function githubGraphQL(query, variables) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "fetch-pinned-repos",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API responded ${res.status} ${res.statusText}`);
  }

  const body = await res.json();
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  return body.data;
}

/**
 * GitHub reports the language, but the badge should name the framework a
 * visitor recognises: a repo whose primary language is Dart is a Flutter app.
 */
const LANGUAGE_LABELS = {
  Dart: "Flutter",
  Vue: "Vue.js",
};

/** Topics too generic to earn a badge. */
const GENERIC_TOPICS =
  /^(awesome|opensource|show-and-tell|tutorial|learning|example|template|boilerplate|starter|project|demo)$/i;

/**
 * Turns a topic slug into a display label. Categories are rendered in an
 * uppercase badge, so a raw "vue" or "flutter" would read as noise next to
 * hand-written labels like "E-Commerce".
 */
function humanize(slug) {
  if (!slug) return "";
  return LANGUAGE_LABELS[slug]
    || slug
        .split(/[-_]/)
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" ");
}

/** Collapses a GraphQL repository node into the flat shape the site consumes. */
function toRepo(node) {
  const topics = (node.repositoryTopics?.nodes || [])
    .map((t) => t.topic.name)
    .filter((t) => !GENERIC_TOPICS.test(t));

  // The primary language is already represented; listing it twice is noise.
  const languages = (node.languages?.nodes || [])
    .map((l) => l.name)
    .filter((l) => l !== node.primaryLanguage?.name);

  const techStack = [
    node.primaryLanguage?.name,
    ...topics,
    ...languages,
  ]
    .filter(Boolean)
    .map((t) => LANGUAGE_LABELS[t] ?? t)
    // "flutter" and "Flutter" must not become two badges.
    .filter((t, i, all) => all.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i);

  // Where the README's banner lives, so the image can be fetched separately.
  const bannerPath = chooseBanner(extractBannerPaths(node.readme?.text));

  return {
    name: node.name,
    nameWithOwner: node.nameWithOwner,
    githubUrl: node.url,
    liveUrl: node.homepageUrl || null,
    description: node.description || "",
    category: humanize(topics[0]) || "Project",
    techStack,
    stars: node.stargazerCount,
    forks: node.forkCount,
    language: node.primaryLanguage?.name || null,
    topics,
    archived: node.isArchived,
    pushedAt: node.pushedAt,
    defaultBranch: node.defaultBranchRef?.name || "main",
    bannerPath: bannerPath ? bannerPath.replace(/^\.?\//, "") : null,
  };
}

async function main() {
  const data = await githubGraphQL(PINNED_QUERY, {
    login: USERNAME,
    count: MAX_PINNED,
  });

  let nodes = data.user?.pinnedItems?.nodes || [];
  let source = "pinned";

  if (nodes.length === 0) {
    console.warn(`No pinned repositories for ${USERNAME}; falling back to most recently pushed.`);
    const fallback = await githubGraphQL(TOP_REPOS_QUERY, {
      login: USERNAME,
      count: MAX_PINNED,
    });
    nodes = fallback.user?.repositories?.nodes || [];
    source = "recent";
  }

  if (nodes.length === 0) {
    throw new Error(`Found no public repositories for ${USERNAME}.`);
  }

  const repos = nodes.filter((n) => n && n.nameWithOwner).map(toRepo);

  // Download each README banner and downscale it. A failure here is logged and
  // skipped: a card without a banner is better than a failed deploy.
  const withBanners = await attachBanners(repos);

  const payload = {
    generatedAt: new Date().toISOString(),
    username: USERNAME,
    source,
    repos: withBanners,
  };

  await mkdir(dirname(OUTPUT), { recursive: true });

  // Skip the write when nothing changed, so rebuilds stay diff-free.
  let existing = null;
  try {
    existing = await readFile(OUTPUT, "utf8");
  } catch {
    /* first run */
  }

  const stable = JSON.stringify(payload, null, 2) + "\n";
  const previous = existing ? JSON.parse(existing) : null;
  if (previous && JSON.stringify(previous.repos) === JSON.stringify(withBanners)) {
    console.log(`Unchanged: ${withBanners.length} ${source} repositories.`);
    return;
  }

  await writeFile(OUTPUT, stable, "utf8");
  console.log(`Wrote ${withBanners.length} ${source} repositories to ${OUTPUT}`);
  for (const r of withBanners) {
    console.log(
      `  - ${r.nameWithOwner} (${r.techStack.join(", ") || "no tech detected"})` +
        (r.banner ? ` banner=${r.banner}` : " banner=none"),
    );
  }
}

/**
 * Downloads and optimizes each repo's banner, returning copies of the repo
 * records with a `banner` field pointing at the generated file.
 */
async function attachBanners(repos) {
  const out = [];

  for (const repo of repos) {
    if (!repo.bannerPath) {
      console.log(`  banner ${repo.name}: none found in README`);
      out.push(repo);
      continue;
    }

    const url = rawUrl(repo.nameWithOwner, repo.defaultBranch, repo.bannerPath);
    // The banner file is named after the repo, so renaming a repo or pointing
    // at a different path cannot serve a stale image.
    const slug = repo.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");

    try {
      const served = await processBanner(url, slug);
      out.push({ ...repo, banner: served });
    } catch (err) {
      console.warn(`  banner ${repo.name}: skipped (${err.message})`);
      out.push(repo);
    }
  }

  return out;
}

main().catch(async (err) => {
  console.error(`fetch-pinned-repos failed: ${err.message}`);
  try {
    await readFile(OUTPUT, "utf8");
    console.error("Keeping the existing src/data/pinnedRepos.json.");
  } catch {
    console.error("No existing snapshot to fall back on.");
  }
  process.exit(1);
});