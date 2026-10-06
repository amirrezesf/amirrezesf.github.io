<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8ca41d5d-191d-4893-9d22-ee627bef5c1d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Projects data

The projects section reads from `src/data/pinnedRepos.json`, generated from the
repositories pinned on your GitHub profile. You no longer hand-edit project
titles, descriptions, or links.

`.github/workflows/deploy.yml` re-fetches that file every 6 hours and on every
push to `v2`, then rebuilds and publishes to `gh-pages`. To change what appears,
pin or unpin a repo on <https://github.com/amirrezesf> — no code change needed.

To refresh locally (pinned items require the GraphQL API, so a token is needed):

    GITHUB_TOKEN=<token> npm run sync:projects

`src/data/projectOverrides.ts` is the only file you edit by hand, and only for
what GitHub cannot know: the Persian (fa) copy and any hand-tuned wording.
Overrides are matched by repository name.

### Project banners

Each card's banner is taken from that repository's README. The script looks for
images whose filename contains "banner" (so a repo with many screenshots still
picks the right one), downloads it, and downscales it to 1400px wide as a
stripped JPEG. Generated files land in `src/data/banners/`.

The sources are large — three of the four repos store 7000×3024 PNGs totalling
about 5.9MB — while the cards render them around 458×170px. Downscaling brings
the four banners to roughly 205KB in total.

Two consequences worth knowing:

- ImageMagick must be available where the script runs (`magick` or `convert`).
  It is preinstalled on GitHub's `ubuntu-latest` runners. Without it the original
  bytes are saved unscaled, so nothing breaks.
- `src/data/bannerRegistry.ts` imports the generated files statically, which is
  what lets Vite fingerprint them. A newly pinned repo needs an entry there
  before its banner shows; until then the card renders without an image.

Notes:

- Pinned items are only exposed via the GraphQL API; there is no REST endpoint,
  so a token is required. In CI this uses the automatic `GITHUB_TOKEN`.
- If nothing is pinned, the script falls back to the six most recently pushed
  public repos.
- A failed fetch never overwrites the existing snapshot, so a bad API response
  cannot empty the section.
- Archived repos stay in the JSON but are hidden at render time, so
  un-archiving one brings it back automatically.

    npm test    # exercises the fetch script against a stubbed API
