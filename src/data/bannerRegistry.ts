import financeBanner from "./banners/finance-app.jpg";
import crmBanner from "./banners/maze-crm.jpg";
import chatBanner from "./banners/chat-app.jpg";
import deliveryBanner from "./banners/food-app.jpg";
import luminoteBanner from "./banners/luminote.jpg";
import skyroombotBanner from "./banners/skyroombot.jpg";
import jarvisBanner from "./banners/jarvis.jpg";
import anydeskappBanner from "./banners/anydeskapp.jpg";

/**
 * Banners are generated into ./banners by scripts/fetch-pinned-repos.mjs and
 * imported statically: Vite fingerprints and bundles them that way. A runtime
 * string URL would bypass hashing and 404 whenever a filename changes, so a new
 * banner needs an entry here.
 */
const BANNERS: Record<string, string> = {
  "finance-app": financeBanner,
  "maze-crm": crmBanner,
  "chat-app": chatBanner,
  "food-app": deliveryBanner,
  "luminote": luminoteBanner,
  "skyroombot": skyroombotBanner,
  "jarvis": jarvisBanner,
  "anydeskapp": anydeskappBanner,
};

/** Resolves a repo's generated banner reference ("banners/<slug>.jpg"). */
export function bannerUrl(banner: string | null | undefined): string | undefined {
  if (!banner) return undefined;
  const slug = banner.replace(/^banners\//, "").replace(/\.jpe?g$/i, "");
  return BANNERS[slug];
}