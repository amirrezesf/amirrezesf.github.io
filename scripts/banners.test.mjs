/**
 * Tests for banner discovery and selection.
 * Run: node scripts/banners.test.mjs
 */
import { extractBannerPaths, chooseBanner, rawUrl } from "./banners.mjs";

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

console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);