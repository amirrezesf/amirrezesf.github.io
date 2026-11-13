import chatBanner from "./banners/chat-app.webp";
import deliveryBanner from "./banners/food-app.webp";
import luminoteBanner from "./banners/luminote.webp";
import skyroombotBanner from "./banners/skyroombot.webp";
import jarvisBanner from "./banners/jarvis.webp";
import anydeskappBanner from "./banners/anydeskapp.webp";

/**
 * Banners are generated into ./banners by scripts/fetch-pinned-repos.mjs and
 * imported statically: Vite fingerprints and bundles them that way. A runtime
 * string URL would bypass hashing and 404 whenever a filename changes, so a new
 * banner needs an entry here.
 */

const BANNERS: Record<string, string> = {
  "chat-app": chatBanner,
  "food-app": deliveryBanner,
  "luminote": luminoteBanner,
  "skyroombot": skyroombotBanner,
  "jarvis": jarvisBanner,
  "anydeskapp": anydeskappBanner,
};

/** Resolves a repo's generated banner reference ("banners/<slug>.webp"). */
export function bannerUrl(banner: string | null | undefined): string | undefined {
  if (!banner) return undefined;
  const slug = banner
    .replace(/^banners\//, "")
    .replace(/\.webp$/i, "")
    .replace(/\.jpe?g$/i, "");
  return BANNERS[slug];
}