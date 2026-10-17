# Editing W10 in RStudio

## Preview loop

1. Open the repository as an RStudio Project.
2. Open the Terminal pane.
3. Run `pnpm w10:generate` once after changing YAML.
4. Run `quarto preview` and open the displayed local URL.
5. Edit `.qmd`, `.yml`, `styles.css` or `assets/site.js` and save.
6. Refresh the preview if the browser does not update automatically.

## New blog

Copy an existing file in `posts/`, rename it with a lowercase hyphenated slug, update the YAML front matter, write the Markdown body, set `status: draft`, preview, then change to `published` when ready.

## New project

Add a record to `_data/projects.yml` with `id`, `title`, `status`, `date`, `tags`, `summary`, `challenge`, `approach`, `technology`, `role`, `outcome`, `href`, `hrefLabel` and `accent` as available.

## New podcast episode

Add a record to `_data/podcasts.yml` with `id`, `number`, `title`, `date`, `status`, `tags`, `summary`, `duration`, `appleHref` and `spotifyHref`.

## Publish

Run `quarto render`, inspect `_site/`, then commit to a branch and open a GitHub pull request. Netlify publishes after the pull request is merged into `main`.
