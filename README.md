# W10 — Sumit Satsangi Markdown/Quarto website

W10 is the RStudio-editable rebuild of the Sumit Satsangi portfolio. The public website is generated from Markdown/Quarto pages, YAML content records, CSS and a small browser script. Edit the source in RStudio, preview locally with Quarto, commit to GitHub, and let Netlify publish the `main` branch.

## Quick start in RStudio

Install **Quarto** from <https://quarto.org/docs/get-started/> and install Git. Clone the repository, open it as an RStudio Project, then run from the RStudio Terminal:

```bash
git clone https://github.com/sumit-satsangi/websiteV2.git
cd websiteV2
pnpm install
pnpm w10:generate
quarto preview
```

Open the local URL shown by Quarto, usually `http://localhost:4200`. Save a `.qmd`, `.yml`, `.css` or `.js` file and Quarto will rebuild the preview.

For a one-time production render:

```bash
pnpm w10:render
```

The generated site is `_site/` and is not committed; Netlify creates it during deployment.

## What to edit

| Goal | File or folder |
|---|---|
| Hero, career, capabilities, impact, work, technology, credentials, education and links | `_data/profile.yml` |
| Projects | `_data/projects.yml` |
| Blog archive cards and metadata | `_data/blogs.yml` |
| Podcast show details | `_data/podcast-show.yml` |
| Podcast episode cards and Apple/Spotify links | `_data/podcasts.yml` |
| Long-form blog article | `posts/*.qmd` |
| Optional dedicated episode page | `podcast/*.qmd` |
| Homepage layout and composition | `index.qmd` and `_generated/profile-body.qmd` output |
| Projects/Blogs/Podcast page structure | `projects.qmd`, `blogs.qmd`, `podcast.qmd` |
| About/Experience/Impact/Technology/Leadership/Contact copy | the matching `.qmd` page |
| Fonts, colours, spacing, responsive layout and motion | `styles.css` |
| Search/tag filters | `assets/site.js` |
| Site navigation, SEO and output | `_quarto.yml` |
| Netlify build and redirects | `netlify.toml` and `_redirects` |

## Content rules

Use simple YAML and ISO dates. Set `status: draft` while editing and `status: published` when a record should appear publicly. Use `status: archived` when you want to retain a record in Git without showing it on the public archive. Blank dates are allowed and appear under `Unspecified`.

Every project, blog and podcast record needs a stable `id` and `title`. Project records should include `tags`, `summary`, `technology`, `href` and `hrefLabel` where available. Blog records should include `excerpt`, `href`, `source` and `canonical-url` where available. Podcast records should include `appleHref` and `spotifyHref` when those episode links exist.

## Validate before pushing

```bash
pnpm w10:generate
quarto render
```

Check `_site/` visually, then:

```bash
git diff --check
git status
git add .
git commit -m "Update W10 website content"
git push origin main
```

Netlify runs `bash scripts/build-w10.sh` and publishes `_site/`. See [DEPLOYMENT.md](DEPLOYMENT.md) for the GitHub and Netlify setup.

## Important W10 change

W10 is a static Markdown/Quarto site. Routine editing happens in RStudio or GitHub’s file editor through normal branches and pull requests. No OAuth secrets, GitHub tokens or session secrets are required to build the public site.

## W10 beginner notes

If you are unsure where to start, open `W10-CODE-GUIDE.md`. It explains every active file in plain English and includes copy-paste examples for projects, blogs, podcast episodes, design changes, previewing, and publishing.
