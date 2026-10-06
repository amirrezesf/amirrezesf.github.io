/**
 * Tests for banner discovery and selection.
 * Run: node scripts/banners.test.mjs
 */
import { extractBannerPaths, chooseBanner, rawUrl, FALLBACK_PATHS } from "./banners.mjs";

let failures = 0;
function check(name, cond, detail = "") {
  console.log(`${cond ? "  PASS" : "  FAIL"}  ${name}${cond ? "" : `   -> ${detail}`}`);
  if (!cond) failures++;
}

console.log("\nmarkdown images");
check(
  "finds a banner with a title",
  extractBannerPaths('![Header Card](mockups/banner.png "Header Card")')[0] === "mockups/banner.png",
  JSON.stringify(extractBannerPaths('![x](mockups/banner.png "Header Card")')),
);
check(
  "finds a banner without a title",
  extractBannerPaths("![b](Banner.png)")[0] === "Banner.png",
);
check(
  "strips a leading ./",
  extractBannerPaths("![b](./Banner.png)")[0] === "./Banner.png",
);

console.log("\nhtml images");
check(
  "finds an html img src",
  extractBannerPaths('<img src="images/banner-big.png" alt="x">')[0] === "images/banner-big.png",
);
check(
  "single-quoted src",
  extractBannerPaths("<img src='mockups/banner.png'>")[0] === "mockups/banner.png",
);

console.log("\nonly banner-named images qualify");
check(
  "ignores screenshots",
  extractBannerPaths("![home](mobile/screenshots/home_screen.png)").length === 0,
);
check(
  "ignores non-banner images",
  extractBannerPaths("![logo](assets/logo.png)").length === 0,
);
check(
  "matches 'banner' anywhere in the filename",
  extractBannerPaths("![x](a/b/my-banner-final.PNG)").length === 1,
);

console.log("\nexternal and inline images are skipped");
check(
  "skips shields.io badges",
  extractBannerPaths("![n](https://img.shields.io/badge/Nuxt-4.2.1-00DC82?style=x)").length === 0,
);
check(
  "skips any absolute url",
  extractBannerPaths("![x](https://example.com/banner.png)").length === 0,
);
check(
  "skips data uris",
  extractBannerPaths("![x](data:image/png;base64,iVBORbanner)").length === 0,
);

console.log("\nordering and dedupe");
{
  const paths = extractBannerPaths(
    "![a](mockups/banner.png)\n![b](mockups/banner.png)\n![c](other/banner.png)",
  );
  check("dedupes repeated paths", paths.length === 2, JSON.stringify(paths));
  check("keeps README order", paths[0] === "mockups/banner.png", JSON.stringify(paths));
}

console.log("\nchooseBanner");
check("prefers a plain banner.png at any depth", chooseBanner(["mockups/x.png", "assets/banner.png"]) === "assets/banner.png");
check("keeps the only candidate", chooseBanner(["mockups/banner.png"]) === "mockups/banner.png");
check("falls back to the first candidate", chooseBanner(["a/x.png", "b/y.png"]) === "a/x.png");
check("returns null when empty", chooseBanner([]) === null);
check("returns null for undefined input", chooseBanner(undefined) === null);
{
  // README order should win when two paths score equally.
  const chosen = chooseBanner(["images/banner-a.png", "images/banner-b.png"]);
  check("ties break on README order", chosen === "images/banner-a.png", String(chosen));
}

console.log("\nrawUrl");
check(
  "builds a raw url",
  rawUrl("amirrezesf/Food-App", "main", "mockups/banner.png") ===
    "https://raw.githubusercontent.com/amirrezesf/Food-App/main/mockups/banner.png",
);
check(
  "normalizes a leading ./",
  rawUrl("u/r", "main", "./Banner.png") ===
    "https://raw.githubusercontent.com/u/r/main/Banner.png",
);
check(
  "encodes spaces in segments",
  rawUrl("u/r", "main", "my folder/banner.png") ===
    "https://raw.githubusercontent.com/u/r/main/my%20folder/banner.png",
);

console.log("\nconventional fallback paths");
check("includes assets/banner.png", FALLBACK_PATHS.includes("assets/banner.png"));
check("includes images/banner.png", FALLBACK_PATHS.includes("images/banner.png"));
check("prefers assets/ over images/", FALLBACK_PATHS.indexOf("assets/banner.png") < FALLBACK_PATHS.indexOf("images/banner.png"));
check("every path has a banner in the filename", FALLBACK_PATHS.every((p) => /banner/i.test(p)));
check("covers png, jpg and jpeg", ["png", "jpg", "jpeg"].every((ext) => FALLBACK_PATHS.some((p) => p.endsWith(ext))));
check("has no duplicates", new Set(FALLBACK_PATHS).size === FALLBACK_PATHS.length);

console.log("\nprobeFallbackBanner");
{
  // Stub fetch so the probe is exercised without network access.
  const realFetch = globalThis.fetch;
  const calls = [];
  const makeStub = (existing) => async (url, opts) => {
    calls.push({ url, method: opts?.method });
    const path = url.split("/main/")[1];
    if (existing.includes(path)) {
      return { ok: true, headers: { get: () => "image/png" } };
    }
    return { ok: false, status: 404, headers: { get: () => null } };
  };

  try {
    globalThis.fetch = makeStub(["assets/banner.png"]);
    const { probeFallbackBanner } = await import("./banners.mjs");
    check("finds assets/banner.png", (await probeFallbackBanner("u/r", "main")) === "assets/banner.png");
    check("stops probing at the first hit", calls.length === 1, `${calls.length} requests`);
    check("uses HEAD requests", calls[0].method === "HEAD", calls[0].method);
  } finally {
    globalThis.fetch = realFetch;
  }
}
{
  const realFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => ({ ok: false, status: 404, headers: { get: () => null } });
    const { probeFallbackBanner } = await import("./banners.mjs");
    check("returns null when nothing exists", (await probeFallbackBanner("u/r", "main")) === null);
  } finally {
    globalThis.fetch = realFetch;
  }
}
{
  const realFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => ({ ok: true, headers: { get: () => "text/html" } });
    const { probeFallbackBanner } = await import("./banners.mjs");
    check("rejects a non-image content type", (await probeFallbackBanner("u/r", "main")) === null);
  } finally {
    globalThis.fetch = realFetch;
  }
}
{
  const realFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => { throw new Error("network down"); };
    const { probeFallbackBanner } = await import("./banners.mjs");
    check("survives a network error", (await probeFallbackBanner("u/r", "main")) === null);
  } finally {
    globalThis.fetch = realFetch;
  }
}

console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);