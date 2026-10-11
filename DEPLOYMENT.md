# W1 deployment handoff

This repository is the W5 static export of the Sumit Satsangi portfolio. It is ready to follow a public GitHub → Netlify workflow.

## Netlify settings

The checked-in `netlify.toml` already defines the deployment settings:

- **Build command:** `corepack enable && pnpm install --frozen-lockfile && pnpm build:static`
- **Publish directory:** `dist/public`
- **Node.js:** 22
- **SPA fallback:** `client/public/_redirects` routes visitor paths back to `index.html`.

## Deploy from GitHub

1. Push this repository to your public GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Select GitHub and choose the repository.
4. Keep the detected settings from `netlify.toml`, then deploy.
5. Attach the custom domain in Netlify if required.

No environment variables are required for the static portfolio build.

## Local verification

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build:static
pnpm dev:static
```

The local preview runs at `http://localhost:3000`. The production output is written to `dist/public` and contains `index.html`, `manus-routes.json`, the static assets, and the Netlify fallback file.

## Before going live

The canonical and social metadata currently reference `https://www.sumitsatsangi.com/`. If the new Netlify site will use a different canonical domain, update these values in `client/index.html` before publishing:

- `og:url`
- `canonical`
- `og:image` if a new social preview asset is preferred

The public source-grounded content and design are preserved from the restored W1 baseline. The W5 release is recorded in Git history with the deployment configuration included in the same commit.
