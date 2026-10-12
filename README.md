# W6 — Sumit Satsangi: Turning Data Into Decisions

A maintainable React/Vite portfolio with a GitHub-backed content manager for Projects, Blogs, and Podcast episodes. The public design remains the W5 executive data-editorial experience; content records are separated from page components so routine updates do not require UI edits.

## Quick start

```bash
pnpm install --frozen-lockfile
pnpm content:generate
pnpm dev:static
```

Open `http://localhost:3000` for the public preview. Edit the JSON templates in `content/`, then run `pnpm content:generate` to refresh the generated client adapter.

For the OAuth/admin functions locally, use Netlify’s local runtime after installing the CLI on demand:

```bash
pnpm dlx netlify-cli dev
```

## Build and validate

```bash
pnpm check
pnpm test
pnpm build:static
```

The production bundle is generated in `dist/public`. Every static build regenerates `client/src/data/generatedContent.ts` from `content/` before Vite runs.

## Content editing model

- `content/projects.json` — project records and public proof links.
- `content/blogs.json` — blog metadata plus editable Markdown body fields.
- `content/podcasts.json` — episode metadata and Apple/Spotify links.
- `content/podcast-show.json` — show-level title, description, links, and album art.
- `client/src/data/profile.ts` — stable professional profile, career, capabilities, credentials, and education.

The public build excludes `draft` and `archived` records, sorts by date, and keeps an explicit `Unspecified` date group when a source record has no published date.

## Admin dashboard

Open `/admin` on the deployed site. GitHub OAuth protects the dashboard. Projects, Blogs, and Podcast templates support create/edit, tags, dates, ordering, draft/published status, links, image fields, preview-ready text, and archive actions. Saving does not mutate `main` directly: the server validates the record, creates a CMS branch, commits the JSON change, and opens a GitHub pull request.

## Netlify deployment

`netlify.toml` defines the build command, publish directory, Netlify Functions directory, OAuth/content API redirects, admin SPA fallback, and security headers. See [DEPLOYMENT.md](DEPLOYMENT.md) for the exact GitHub OAuth App setup and environment variables.

## Project structure

- `client/src/pages/` — public pages and the W6 admin dashboard.
- `client/src/components/portfolio/` — reusable visual and page-shell components.
- `client/src/data/` — typed adapter over editable content records.
- `content/` — GitHub-backed JSON content templates.
- `server/` — encrypted session, schema validation, and GitHub API helpers.
- `netlify/functions/` — OAuth, session, content list/save/archive functions.
- `scripts/generate-content.mjs` — deterministic content adapter generator.
- `netlify.toml` — Netlify build, functions, redirects, and headers.

No real OAuth credentials, GitHub tokens, session secrets, or admin allowlists belong in this repository.
