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
what GitHub cannot know: project screenshots and the Persian (fa) copy. Overrides
are matched by repository name.

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
