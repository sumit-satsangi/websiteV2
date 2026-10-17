# W10 deployment: RStudio → GitHub → Netlify

## 1. Local setup

Install Git, RStudio and Quarto. Node/pnpm is used only for the deterministic YAML generator; no React runtime is required for the W10 public site.

```bash
git clone https://github.com/sumit-satsangi/websiteV2.git
cd websiteV2
pnpm install
pnpm w10:generate
quarto preview
```

Use `quarto preview` while editing. Use `quarto render` or `pnpm w10:render` to create `_site/`.

## 2. Netlify settings

Connect the GitHub repository `sumit-satsangi/websiteV2` to Netlify. Keep the settings from `netlify.toml`:

- Build command: `bash scripts/build-w10.sh`
- Publish directory: `_site`
- Node version: `22`
- No Netlify Functions or OAuth environment variables are required for W10 public publishing.

The build command validates `_data/*.yml`, generates the archive fragments in `_generated/`, uses the pinned Quarto `1.10.19` release if Netlify does not already provide Quarto, and renders the site.

## 3. GitHub editing workflow

1. Pull the current `main` branch.
2. Create a branch such as `content/new-project` or `content/october-blog`.
3. Edit YAML or `.qmd` files in RStudio.
4. Run `pnpm w10:generate` and `quarto render` locally.
5. Review `_site/` and the Git diff.
6. Commit and push the branch.
7. Open a pull request against `main`.
8. Merge after review. Netlify builds and publishes `main`.

## 4. Files that should not be committed

Do not commit `_site/`, `.quarto/`, local `.env` files, secrets, access tokens or personal session data. W10 is intentionally kept to the editable Quarto source: `_quarto.yml`, `.qmd`, `_data/`, `styles.css`, `scripts/build-w10.sh` and `netlify.toml`.

## 5. Domain and SEO

Update `site-url` in `_quarto.yml` if the canonical domain changes. The Quarto website format generates page metadata, sitemap and robots files. Keep `manus-routes.json` synchronized when adding a page. If a page becomes a dedicated route, add it to the navigation and the manifest.

## 6. Troubleshooting

- **`quarto: command not found`:** install Quarto from <https://quarto.org/docs/get-started/> and restart RStudio.
- **YAML parse error:** quote values containing `:` or special punctuation; compare the record with an existing entry.
- **Record missing publicly:** check `status`, run `pnpm w10:generate`, and confirm the record appears in `_generated/`.
- **Filters do not show a tag:** check the tag spelling and ensure at least one published record uses it.
- **Netlify build cannot find Quarto:** the W10 build script downloads the pinned Quarto release automatically. Check that the build environment permits outbound HTTPS downloads, or set `QUARTO_VERSION` to an available Quarto release.
- **Page does not appear in navigation:** add it to `_quarto.yml`, create the `.qmd`, add it to `manus-routes.json`, and render again.
