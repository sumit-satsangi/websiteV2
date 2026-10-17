# W10 code guide — how to edit this website

W10 is a **static Quarto website**. You do not need to understand React, databases, server code, OAuth, or an admin dashboard. Most future changes happen in YAML, Markdown, or CSS files.

## The simple mental model

1. You edit source files in RStudio.
2. The small Node script `scripts/generate-w10.mjs` reads YAML content and creates temporary HTML fragments.
3. Quarto reads the `.qmd` pages and those generated fragments.
4. Quarto writes the finished website into `_site/`.
5. GitHub stores the source. Netlify builds `_site/` and publishes it.

Never edit `_site/` directly. It is generated and ignored by Git.

## First-time setup in RStudio

Install Git, Node.js 22+, pnpm, and Quarto. In the RStudio Terminal:

```bash
git clone https://github.com/sumit-satsangi/websiteV2.git
cd websiteV2
pnpm install
pnpm w10:generate
quarto preview
```

Open the local URL printed by Quarto, normally `http://localhost:4200`. Keep that command running while editing. Quarto refreshes the browser after saved changes.

## Which file should I edit?

| You want to change | Edit this |
|---|---|
| Name, headline, biography, email, career, capabilities, impact, projects shown on Home, technology, credentials, education | `_data/profile.yml` |
| Project archive cards | `_data/projects.yml` |
| Blog archive cards | `_data/blogs.yml` |
| Podcast show details | `_data/podcast-show.yml` |
| Podcast episode archive cards and Apple/Spotify links | `_data/podcasts.yml` |
| A full article | Add or edit `posts/your-article.qmd` |
| Home page wording and section order | `index.qmd` and generated content in `scripts/generate-w10.mjs` |
| Projects, Blogs, Podcast page headings and explanations | `projects.qmd`, `blogs.qmd`, `podcast.qmd` |
| About, Experience, Impact, Technology, Leadership or Contact page copy | The matching `.qmd` file |
| Colours, fonts, spacing, cards, buttons and mobile layout | `styles.css` |
| Search boxes and tag filters | `assets/site.js` |
| Navigation, page titles and SEO | `_quarto.yml` |
| Netlify build and short URL redirects | `netlify.toml` and `_redirects` |
| Website logo | `assets/ss-mark.svg` |

## Editing YAML safely

YAML is sensitive to spaces. Use two spaces for indentation. Do not use tabs. If a value contains a colon, put the whole value in quotes.

A project record looks like this:

```yaml
- id: my-new-project
  title: My New Project
  status: draft
  date: 2026-10-17
  tags: [Power BI, Analytics]
  summary: A short sentence shown on the project card.
  href: https://example.com/my-project
  hrefLabel: View the project
```

Use `status: draft` while editing. Use `status: published` when the record should appear. Use `status: archived` to keep it in Git without displaying it. Leave `date:` blank when there is no confirmed date; the archive will place it in **Unspecified**.

## Adding a blog

Copy an existing file in `posts/`. Change the front matter between the two `---` lines:

```yaml
---
title: My article title
date: 2026-10-17
author: Sumit Satsangi
categories: [Analytics, Leadership]
status: draft
description: One sentence used in the archive and SEO metadata.
canonical-url: https://example.com/original-article
---
```

Write normal Markdown below the closing `---`. Headings use `##`, links use `[link text](https://example.com)`, and bold uses `**bold text**`.

## Adding a podcast episode

Add one record to `_data/podcasts.yml`. Keep the episode number, date, summary, duration, Apple link, and Spotify link together. Use the exact public platform links. Do not invent a link if one does not exist; leave it blank and update the card template only if you intentionally want a different empty-link design.

## Changing the design

Open `styles.css`. The first `:root` block contains the main design tokens. Change these first instead of hunting through the whole file:

- `--ink`: dark background
- `--paper`: warm text and light section background
- `--amber`: primary accent
- `--gutter`: page side spacing
- `--max`: maximum content width

The CSS is organised in this order: global tokens, navigation, hero, sections, cards, archive filters, reading pages, responsive breakpoints, and reduced-motion accessibility. Search for a class name such as `.archive-card` before changing its visual rule.

## Changing the page structure

A `.qmd` page has YAML front matter at the top, followed by Markdown and HTML. Keep the front matter between `---` lines. Use the existing page classes such as `.page-hero`, `.reading-section`, `.section-band`, `.button`, and `.principle-grid` so the current design remains consistent.

The Home page is assembled by `scripts/generate-w10.mjs`. That file deliberately contains comments beside the main content-generation blocks. Change YAML first. Only edit the generator when you need a new section or a different HTML layout.

## Preview and validation

Run these commands before publishing:

```bash
pnpm w10:generate   # validate YAML and rebuild temporary fragments
quarto render       # render the complete website into _site
```

Or use the shortcut:

```bash
pnpm w10:render
```

If there is a YAML error, read the line number in the terminal. Common fixes are missing spaces, missing quotes, or an unclosed list. If a page is missing, check its `.qmd` filename and `_quarto.yml` render list.

## Publishing through GitHub and Netlify

```bash
git status
git diff --check
git add .
git commit -m "Describe the website change"
git push origin main
```

A safer workflow is to create a branch, push it, and open a pull request. Netlify should use:

- Build command: `bash scripts/build-w10.sh`
- Publish directory: `_site`
- Node version: `22`

The build script downloads Quarto `1.10.19` automatically if Netlify does not already have Quarto.

## Things not to do

Do not edit `_site/`, do not commit `.env` files or passwords, do not paste private tokens into YAML, and do not delete `_data/profile.yml` because the homepage generator depends on it. Keep dates in `YYYY-MM-DD` format. Keep public claims source-grounded.

## W10 source map

- `_quarto.yml` — Quarto website settings and navigation.
- `index.qmd` — Home page entry point.
- `*.qmd` — editable pages.
- `_data/*.yml` — editable content.
- `scripts/generate-w10.mjs` — YAML validation and HTML generation.
- `scripts/build-w10.sh` — local/Netlify build wrapper.
- `styles.css` — complete visual system.
- `assets/site.js` — archive search and tag filtering.
- `manus-routes.json` — declared page routes.
- `netlify.toml` — deployment instructions for Netlify.
- `_redirects` — friendly short URLs.
