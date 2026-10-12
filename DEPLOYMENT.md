# W6 deployment and GitHub OAuth handoff

W6 is a Netlify-ready React/Vite portfolio with a GitHub-backed CMS. The public site reads published JSON records from the repository at build time. The protected admin dashboard uses Netlify Functions for GitHub OAuth and GitHub Contents API operations.

## 1. Push the code repository

The target repository is `https://github.com/sumit-satsangi/websiteV2`. It was empty when W6 work started. Push the W6 code to its `main` branch, or import the finished code into that repository before connecting Netlify.

The content manager expects these files to exist on the repository’s default branch:

```text
content/projects.json
content/blogs.json
content/podcasts.json
content/podcast-show.json
```

## 2. Create the GitHub OAuth App

In GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App**. Use:

- **Application name:** `Sumit Satsangi W6 CMS`
- **Homepage URL:** your deployed Netlify site URL, for example `https://your-site.netlify.app`
- **Authorization callback URL:** `https://your-site.netlify.app/api/auth/callback`
- **Application description:** `Private content manager for the Sumit Satsangi portfolio`

Create the app, copy the **Client ID**, and generate a new **Client secret**. Keep the secret only in Netlify’s environment-variable store. If you use a custom domain, use that exact HTTPS origin for both Homepage URL and callback URL.

The OAuth flow requests the `public_repo` scope because CMS saves create a branch, commit JSON content, and open a pull request in the public `websiteV2` repository. The admin account must have write access to the repository.

## 3. Configure Netlify environment variables

In **Netlify → Site configuration → Environment variables**, add these values for the Production and Deploy Preview scopes as appropriate:

| Variable | Value | Notes |
|---|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID | Safe to store server-side; never commit it to `.env` in the repository. |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret | Secret; server-side only. |
| `GITHUB_CONTENT_OWNER` | `sumit-satsangi` | Repository owner. |
| `GITHUB_CONTENT_REPO` | `websiteV2` | Repository name. |
| `GITHUB_CONTENT_BRANCH` | `main` | Public build source branch. |
| `GITHUB_ALLOWED_LOGINS` | `sumit-satsangi` | Comma-separated GitHub usernames allowed into `/admin`. |
| `SESSION_SECRET` | A random value of at least 32 characters | Used to encrypt the admin session cookie. Generate with `openssl rand -base64 48`. |
| `PUBLIC_SITE_URL` | `https://your-site.netlify.app` | Exact HTTPS site origin; no trailing slash. |

After adding or changing variables, trigger a new deploy. Do not paste secrets into GitHub issues, source files, browser JavaScript, or chat messages.

## 4. Connect the Netlify site

1. Choose **Add new site → Import an existing project**.
2. Select GitHub and choose `sumit-satsangi/websiteV2`.
3. Keep the settings detected from `netlify.toml`:
   - Build command: `corepack enable && pnpm install --frozen-lockfile && pnpm build:static`
   - Publish directory: `dist/public`
   - Node.js: 22
   - Functions directory: `netlify/functions`
4. Add the environment variables above.
5. Deploy and open `/admin` on the deployed HTTPS URL.

## 5. First admin login and content workflow

Visit `/admin`, choose **Continue with GitHub**, and authorize the OAuth App. The GitHub login must appear in `GITHUB_ALLOWED_LOGINS`. The dashboard reads the three content collections from `main`.

To add or edit a record, choose a collection, select a record or choose **New**, complete the template, and select **Save as GitHub PR**. W6 validates the record server-side, creates a `cms/...` branch, commits the collection JSON, and opens a pull request. Review and merge the pull request in GitHub; the next Netlify deploy makes published records visible. Use **Archive** instead of deleting records when historical traceability matters.

## 6. Local development

Public-only local preview:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build:static
pnpm dev:static
```

To exercise Netlify Functions locally, create an untracked `.env` from `.env.example`, use a GitHub OAuth App callback URL appropriate for your local Netlify runtime, and run:

```bash
pnpm dlx netlify-cli dev
```

Do not use production OAuth secrets in an untrusted machine or share local session cookies. The session cookie uses `SameSite=None; Secure` on HTTPS Netlify deployments and a less strict local development mode over plain HTTP.

## 7. Troubleshooting

- **Callback mismatch:** the callback URL in GitHub must exactly equal `PUBLIC_SITE_URL` plus `/api/auth/callback`.
- **Not allowed:** add the exact lowercase GitHub username to `GITHUB_ALLOWED_LOGINS`, then redeploy.
- **GitHub content read failed:** confirm the repository has `main`, the four `content/*.json` files, and that the admin account has write access.
- **Pull request creation failed:** confirm the OAuth app was authorized with `public_repo` and that the repository is not archived or read-only.
- **Cookies do not persist:** use the HTTPS Netlify URL, not an embedded third-party preview, for the first OAuth test; confirm `PUBLIC_SITE_URL` is HTTPS.

The canonical/social metadata currently references `https://www.sumitsatsangi.com/`. Update `client/index.html` if the W6 deployment uses a different canonical domain.
