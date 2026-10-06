import pinned from "./pinnedRepos.json";
import { projectOverrides } from "./projectOverrides";
import { bannerUrl } from "./bannerRegistry";
import { Project } from "../types";

export type Lang = "en" | "fa";

/** The raw repository payload produced by scripts/fetch-pinned-repos.mjs. */
export type FetchedRepo = {
  name: string;
  nameWithOwner: string;
  githubUrl: string;
  liveUrl: string | null;
  description: string;
  category: string;
  techStack: string[];
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  archived: boolean;
  pushedAt: string;
  defaultBranch: string;
  /** README-relative location of the banner, e.g. "mockups/banner.png". */
  bannerPath: string | null;
  /** Generated banner reference, e.g. "banners/food-app.jpg". */
  banner?: string | null;
};

export type PinnedSnapshot = {
  generatedAt: string;
  username: string;
  source: "pinned" | "recent";
  repos: FetchedRepo[];
};

const snapshot = pinned as PinnedSnapshot;

function findOverride(repo: FetchedRepo) {
  const key = Object.keys(projectOverrides).find(
    (k) => k.toLowerCase() === repo.name.toLowerCase(),
  );
  return key ? projectOverrides[key] : undefined;
}

function toProject(repo: FetchedRepo, lang: Lang): Project {
  const override = findOverride(repo);
  const fa = override?.fa;

  const title =
    lang === "fa"
      ? fa?.title ?? repo.name
      : override?.title ?? repo.name;

  const description =
    lang === "fa"
      ? fa?.description ?? repo.description
      : override?.description ?? repo.description;

  const category =
    lang === "fa"
      ? fa?.category ?? override?.category ?? repo.category
      : override?.category ?? repo.category;

  // techStack arrives already normalized by the fetch script; an override
  // replaces it wholesale when you want specific badges.
  const techStack = override?.techStack ?? repo.techStack;

  return {
    id: repo.name,
    title,
    description,
    category,
    techStack,
    githubUrl: repo.githubUrl,
    liveUrl: repo.liveUrl ?? undefined,
    // A hand-set override wins; otherwise use the banner generated from the
    // repo README.
    image: override?.image ?? bannerUrl(repo.banner),
  };
}

/** Builds the project list for a language from the fetched snapshot + overrides. */
export function buildProjects(lang: Lang): Project[] {
  return snapshot.repos
    // Archived repos are a deliberate "no longer maintained" signal; hide them.
    .filter((repo) => !repo.archived)
    .map((repo) => toProject(repo, lang));
}

export const pinnedMeta = {
  username: snapshot.username,
  source: snapshot.source,
  generatedAt: snapshot.generatedAt,
  count: snapshot.repos.length,
};