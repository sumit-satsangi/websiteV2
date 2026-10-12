# Implementation checklist — Sumit Satsangi portfolio

## Source-grounded content

- [x] Use the publicly readable existing website and search-indexed LinkedIn headline as the factual source; do not infer private LinkedIn data.
- [x] Preserve verified professional history: Astraa / Saama Product Manager (Mar 2022–present), Genpact progression (Aug 2012–Mar 2022), independent training (Sep 2007–Jul 2012), and earlier Genpact / GE Capital International Services (Sep 2005–Apr 2007).
- [x] Preserve verified education, projects, certifications, tools, public links, and domain coverage; omit information that is not verifiable.
- [x] Do not publish unsupported example metrics such as $2M+, 90%, 5,000+, or 500+; use only source-backed evidence.

## Executive visual identity

- [x] Create a complete visual redesign with a deep charcoal / near-black foundation, warm off-white type, one restrained amber accent, generous whitespace, fine borders, subtle grids, elegant typography, and limited glass effects.
- [x] Position Sumit as a senior data and analytics leader who bridges business strategy, analytics, technology, and execution, not as a generic developer.
- [x] Include the hero headline “Turning Data Into Decisions.”, a source-grounded subheadline, “Explore My Work”, “Let’s Connect”, and a persistent “Let’s Talk” CTA.
- [x] Use a distinctive SS signal-bar mark and an executive data-editorial layout rather than a generic portfolio template or stock imagery.

## Dynamic portfolio experience

- [x] Provide simple anchor navigation for Home, About, Experience, Impact, Projects, Thought Leadership, and Contact.
- [x] Build a Career Intelligence timeline covering verified career stages; hover and keyboard focus reveal role, organization, date, industry context, technologies, responsibility, and outcome when supported.
- [x] Build the “Where Business Meets Data.” capability constellation as interconnected capabilities, not a conventional skills grid.
- [x] Build a Selected Impact section using source-backed evidence only, with explanations for each signal.
- [x] Build premium case-study cards for the verified Maven Toys and Maven Restaurant projects with challenge, approach, technology, role, outcome, and public proof links.
- [x] Build a grouped Technology Landscape for Power BI, Tableau, Alteryx, R, SQL, Excel, DAX, M Query, Power Query, VBA, QuickSight, OBIEE, Spotfire, Box, ACBS, Siebel, Webcash, and CTX+ where verified.
- [x] Build leadership proof points for stakeholder management, team leadership, Scrum / SAFe, requirements translation, operational governance, training, and executive communication from the source.
- [x] Build Thought Leadership links around verified website posts, GitHub, LinkedIn, and Tableau Public; do not invent a podcast or YouTube presence.
- [x] Build “Beyond the Resume” and “Have an interesting problem?” contact sections with verified email and profile links plus inquiry categories.

## Technical quality

- [x] Keep the site mobile-first, fully responsive, semantic, accessible, fast, and free of unnecessary dependencies.
- [x] Use keyboard-accessible timeline controls, visible focus states, descriptive links, good contrast, and reduced-motion fallbacks.
- [x] Use purposeful scroll reveals, subtle metric/timeline motion, hover states, and micro-interactions; respect prefers-reduced-motion.
- [x] Add SEO title, description, canonical/social metadata, and the static `/manus-routes.json` route manifest for `/` and `/404`.
- [x] Register/retain host-managed TypeScript diagnostics and resolve actionable diagnostics.
- [x] Run `pnpm check`, `pnpm test`, and `pnpm build:static`; start the preview server and verify the preview response.
- [x] Review desktop and mobile screenshots for clipping, hierarchy, overflow, timeline behavior, and visual consistency.
- [x] Commit the finished site to canonical `main`; report preview unless successful publication is confirmed.


## W6 — Maintainable GitHub-backed CMS

- [x] Recreate the current W5 public website as a maintainable React/Vite application while preserving its current public design, typography, charcoal/amber visual system, responsive behavior, accessibility patterns, Projects/Blogs/Podcast pages, archive filtering, and podcast links.
- [x] Move public content into structured GitHub-backed `content/` JSON records so content can be updated without editing page components; validate fields, omit drafts from the public build, sort descending by date, and group archives by Year → Month with an explicit Unspecified group for missing dates.
- [x] Add a protected `/admin` route with GitHub OAuth login, an allowlisted administrator check, secure session cookies, logout, and session-expired states; never expose OAuth secrets, repository write tokens, session secrets, or admin allowlists to browser code.
- [x] Add CMS templates for Projects, Blogs, and Podcast episodes with create/edit/preview, draft/published status, tags, dates, ordering, external links, image fields, validation messages, and empty states.
- [x] Make CMS saves GitHub-backed by validating records server-side, creating a branch, committing the content change, and opening or updating a pull request; show the resulting GitHub branch/PR state in the admin UI.
- [x] Add Netlify-compatible serverless functions for OAuth start/callback/session/logout and GitHub content list/save/archive/preview operations, with documented environment variables and no committed secrets.
- [x] Keep the Netlify build deterministic with `pnpm install --frozen-lockfile && pnpm build:static`, publish `dist/public`, preserve SPA fallback routing, and document GitHub OAuth App callback configuration, repository permissions, environment variables, local development, and branch/PR behavior.
- [x] Keep `/manus-routes.json` synchronized with public and admin routes, configure TypeScript diagnostics before source edits, and validate with `pnpm check`, `pnpm test`, `pnpm build:static`, route smoke tests, and a read-only requirements review.
