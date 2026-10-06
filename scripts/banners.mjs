/**
 * Banner discovery and optimization for project cards.
 *
 * Each project's banner comes from its README rather than a hardcoded path,
 * because the four pinned repos store theirs in different places
 * (images/banner-big.png, ./Banner.png, mockups/banner.png). Only images whose
 * path contains "banner" are considered, so a repo with several screenshots
 * picks the intended one.
 *
 * Banners are downloaded once, downscaled, and re-encoded as JPEG. The sources
 * are 7000px-wide PNGs (up to 3.8MB) rendered into a ~700x180 card, so serving
 * them directly would add roughly 6MB to a first page load.
 */

import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const BANNER_DIR = resolve(__dirname, "../src/data/banners");

// Cards render at roughly 700x180 CSS px; 2x keeps it sharp on retina without
// the multi-megabyte originals.
const TARGET_WIDTH = 1400;
const JPEG_QUALITY = 78;

const MAX_SOURCE_BYTES = 12 * 1024 * 1024;

/**
 * Extracts candidate banner paths from README markdown.
 *
 * Handles both markdown `![alt](path "title")` and HTML <img src="...">,
 * resolving relative paths against the README's location at the repo root.
 */
export function extractBannerPaths(readme) {
  if (!readme) return [];

  const candidates = [];
  const push = (raw, index) => {
    const src = raw.trim();
    if (!src) return;

    // Skip shields.io badges and other external decorations.
    if (/^https?:\/\//i.test(src)) return;
    if (/shields\.io|badge|img\.shields/i.test(src)) return;
    // data: URIs are inline, not repo assets.
    if (/^data:/i.test(src)) return;

    // Only banner-named images qualify. This is what makes the choice
    // unambiguous when a README has many screenshots.
    const name = src.split("/").pop() || "";
    if (!/banner/i.test(name)) return;

    candidates.push(src);
  };

  // markdown images: ![alt](src "optional title")
  for (const m of readme.matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g)) {
    push(m[1]);
  }

  // html images: <img ... src="...">
  for (const m of readme.matchAll(/<img[^>]*\ssrc\s*=\s*["']([^"']+)["']/gi)) {
    push(m[1]);
  }

  // De-duplicate while preserving README order.
  return [...new Set(candidates)];
}

/** Builds the raw.githubusercontent.com URL for a repo file. */
export function rawUrl(nameWithOwner, branch, path) {
  const clean = String(path).replace(/^\.?\//, "");
  return `https://raw.githubusercontent.com/${nameWithOwner}/${branch}/${clean
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

/**
 * Picks the banner to use. Prefers a top-level `banner.png`-style file, then
 * the largest-looking path, staying deterministic.
 */
export function chooseBanner(paths) {
  if (!paths?.length) return null;
  const scored = paths.map((p, i) => {
    const lower = p.toLowerCase();
    let score = i; // README order is the tiebreaker
    if (/(^|\/)banner\.png$/.test(lower)) score -= 100;
    if (/(^|\/)[^/]*banner[^/]*\.(png|jpe?g|webp)$/.test(lower)) score -= 50;
    if (/banner-big/.test(lower)) score -= 10;
    return score;
  });
  return paths[scored.indexOf(Math.min(...scored))];
}

function run(cmd, args, { timeout = 60_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`${cmd} timed out after ${timeout}ms`));
    }, timeout);

    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolvePromise();
      else reject(new Error(`${cmd} exited ${code}: ${stderr.slice(0, 300)}`));
    });
  });
}

/** True when ImageMagick is usable. */
export async function hasImageTool() {
  try {
    await run("magick", ["-version"], { timeout: 15_000 });
    return true;
  } catch {
    try {
      await run("convert", ["-version"], { timeout: 15_000 });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Downloads a banner and writes a downscaled JPEG into the banners directory.
 * Returns the served path relative to src/data, or null on any failure so a
 * missing image can never break the build.
 */
export async function processBanner(url, outName) {
  const outFile = resolve(BANNER_DIR, `${outName}.jpg`);

  // Skip work when an up-to-date file already exists.
  try {
    const s = await stat(outFile);
    if (s.size > 0) return `banners/${outName}.jpg`;
  } catch {
    /* not yet generated */
  }

  const res = await fetch(url, { headers: { "User-Agent": "fetch-pinned-repos" } });
  if (!res.ok) throw new Error(`banner download ${res.status} for ${url}`);

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) throw new Error("empty banner response");
  if (buf.length > MAX_SOURCE_BYTES) {
    throw new Error(`banner too large (${(buf.length / 1024 / 1024).toFixed(1)}MB)`);
  }

  await mkdir(BANNER_DIR, { recursive: true });
  const tmpIn = resolve(BANNER_DIR, `.tmp-${outName}`);
  await writeFile(tmpIn, buf);

  const bin = (await hasImageTool()) ? "magick" : "convert";
  const args = [
    tmpIn,
    // Never upscale a small banner.
    "-resize",
    `${TARGET_WIDTH}x>`,
    "-strip",
    "-quality",
    String(JPEG_QUALITY),
    "-interlace",
    "Plane",
    outFile,
  ];

  try {
    await run(bin, args, { timeout: 90_000 });
  } catch (err) {
    // Without ImageMagick the raw bytes are still better than nothing.
    console.warn(`  ! could not optimize ${outName}: ${err.message}`);
    await writeFile(outFile, buf);
    return `banners/${outName}.jpg`;
  } finally {
    // Best-effort cleanup of the temporary source.
    try {
      const { unlink } = await import("node:fs/promises");
      await unlink(tmpIn);
    } catch {
      /* ignore */
    }
  }

  const finalSize = (await stat(outFile)).size;
  console.log(
    `  banner ${outName}: ${(buf.length / 1024).toFixed(0)}KB -> ${(finalSize / 1024).toFixed(0)}KB`,
  );
  return `banners/${outName}.jpg`;
}