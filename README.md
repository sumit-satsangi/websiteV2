# W1 — Sumit Satsangi: Turning Data Into Decisions

A static React/Vite portfolio prepared for a public GitHub → Netlify deployment workflow.

## Quick start

```bash
pnpm install --frozen-lockfile
pnpm dev:static
```

Open `http://localhost:3000` for the local preview.

## Build and validate

```bash
pnpm check
pnpm test
pnpm build:static
```

The production bundle is generated in `dist/public`.

## Netlify deployment

This repository includes `netlify.toml` with the W1 deployment contract:

- Build command: `corepack enable && pnpm install --frozen-lockfile && pnpm build:static`
- Publish directory: `dist/public`
- Node.js: 22
- SPA fallback: `client/public/_redirects`

Push the repository to GitHub, import it from Netlify, and keep the settings detected from `netlify.toml`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete handoff, custom-domain notes, and pre-launch checks.

## Project structure

- `client/src/pages/Home.tsx` — the complete single-page portfolio experience.
- `client/src/data/profile.ts` — source-grounded profile, career, projects, credentials, and links.
- `client/src/components/portfolio/` — reusable timeline, constellation, case-study, and visual primitives.
- `client/public/` — route manifest, Netlify fallback, and public static assets.
- `netlify.toml` — GitHub-to-Netlify build, publish, and security-header configuration.

The current content is grounded in the restored W1 portfolio source. No application secrets or runtime environment variables are required for the static build.
