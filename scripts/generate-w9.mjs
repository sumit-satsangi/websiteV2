import fs from "node:fs/promises";
import path from "node:path";
import { parse, stringify } from "yaml";

const root = process.cwd();
const dataDir = path.join(root, "_data");
const generatedDir = path.join(root, "_generated");

const readYaml = async (file) => parse(await fs.readFile(path.join(dataDir, file), "utf8"));
const esc = (value = "") => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
const href = (value = "") => esc(value);
const safeId = (value = "") => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const dateLabel = (value) => value ? new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00Z`)) : "Date not published";
const monthLabel = (value) => value ? new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(`${value}-01T00:00:00Z`)) : "Unspecified";
const published = (items) => items.filter((item) => (item.status ?? "published") === "published");
const sorted = (items) => [...items].sort((a, b) => (b.date || "0000-00-00").localeCompare(a.date || "0000-00-00") || (a.order || 0) - (b.order || 0));
const groups = (items) => {
  const map = new Map();
  for (const item of sorted(items)) {
    const year = item.date ? item.date.slice(0, 4) : "Unspecified";
    const month = item.date ? `${item.date.slice(0, 7)}|${monthLabel(item.date.slice(0, 7))}` : "unspecified|Unspecified";
    if (!map.has(year)) map.set(year, new Map());
    if (!map.get(year).has(month)) map.get(year).set(month, []);
    map.get(year).get(month).push(item);
  }
  return map;
};
const tagButtons = (items) => ["All", ...new Set(items.flatMap((item) => item.tags || []))].map((tag) => `<button class="filter-chip${tag === "All" ? " is-active" : ""}" type="button" data-tag-filter="${esc(tag)}">${esc(tag)}</button>`).join("\n");
const projectCard = (item) => `<article class="archive-card" data-search="${esc([item.title, item.summary, item.type, ...(item.tags || [])].join(" "))}" data-tags="${esc((item.tags || []).join("|"))}">
  <div class="archive-card__meta"><span>${esc(item.type || "Project")}</span><span>${esc(dateLabel(item.date))}</span></div>
  <h3>${esc(item.title)}</h3>
  <p>${esc(item.summary || item.outcome || "")}</p>
  <div class="tag-row">${(item.tags || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
  <a class="text-link" href="${href(item.href)}" target="_blank" rel="noreferrer">${esc(item.hrefLabel || "View the work")} <span aria-hidden="true">↗</span></a>
</article>`;
const blogCard = (item) => `<article class="archive-card" data-search="${esc([item.title, item.excerpt, item.source, ...(item.tags || [])].join(" "))}" data-tags="${esc((item.tags || []).join("|"))}">
  <div class="archive-card__meta"><span>${esc(item.source || "Article")}</span><span>${esc(dateLabel(item.date))}</span></div>
  <h3>${esc(item.title)}</h3>
  <p>${esc(item.excerpt || item.body || "")}</p>
  <div class="tag-row">${(item.tags || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
  <a class="text-link" href="${href(item.href)}" target="_blank" rel="noreferrer">Read the article <span aria-hidden="true">↗</span></a>
</article>`;
const podcastCard = (item) => `<article class="archive-card" data-search="${esc([item.title, item.summary, ...(item.tags || [])].join(" "))}" data-tags="${esc((item.tags || []).join("|"))}">
  <div class="archive-card__meta"><span>Episode ${esc(item.number || "")}</span><span>${esc(dateLabel(item.date))} · ${esc(item.duration || "")}</span></div>
  <h3>${esc(item.title)}</h3>
  <p>${esc(item.summary || "")}</p>
  <div class="platform-links"><a href="${href(item.appleHref)}" target="_blank" rel="noreferrer"><span class="platform-icon platform-icon--apple"></span> Apple Podcasts ↗</a><a href="${href(item.spotifyHref)}" target="_blank" rel="noreferrer"><span class="platform-icon platform-icon--spotify">●</span> Spotify ↗</a></div>
</article>`;
const archiveHtml = (items, card, emptyMessage) => {
  const visible = sorted(published(items));
  const yearGroups = [...groups(visible)].map(([year, months]) => `<details class="archive-year" open><summary>${esc(year)} <span>${months.size} month${months.size === 1 ? "" : "s"}</span></summary>${[...months].map(([month, records]) => `<section class="archive-month"><h3>${esc(month.split("|")[1])}</h3><div class="archive-grid">${records.map(card).join("\n")}</div></section>`).join("\n")}</details>`).join("\n");
  return visible.length ? yearGroups : `<div class="empty-state">${esc(emptyMessage)}</div>`;
};
const profile = await readYaml("profile.yml");
const projects = await readYaml("projects.yml");
const blogs = await readYaml("blogs.yml");
const podcasts = await readYaml("podcasts.yml");
const show = await readYaml("podcast-show.yml");
for (const [name, value] of Object.entries({ profile, projects, blogs, podcasts, show })) {
  if (!value) throw new Error(`Missing W9 data: ${name}`);
}
for (const [collectionName, records] of Object.entries({ projects, blogs, podcasts })) {
  if (!Array.isArray(records)) throw new Error(`${collectionName}.yml must contain a YAML list`);
  for (const record of records) {
    if (!record.id || !record.title) throw new Error(`${collectionName}: every record needs id and title`);
    if (record.status && !["draft", "published", "archived"].includes(record.status)) throw new Error(`${collectionName}/${record.id}: invalid status`);
    if (record.date && !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) throw new Error(`${collectionName}/${record.id}: date must be YYYY-MM-DD or blank`);
  }
}
await fs.rm(generatedDir, { recursive: true, force: true });
await fs.mkdir(generatedDir, { recursive: true });
const projectPublished = published(projects);
const blogPublished = published(blogs);
const podcastPublished = published(podcasts);
await fs.writeFile(path.join(generatedDir, "projects-body.qmd"), `<div class="filter-panel"><label for="project-search">Search projects</label><input id="project-search" class="archive-search" data-search-input="projects" type="search" placeholder="Search title, tag or technology"><div class="filter-chips" data-filter-group="projects">${tagButtons(projectPublished)}</div></div><div class="archive-results" data-results="projects">${archiveHtml(projects, projectCard, "No published projects are available yet.")}</div>\n`, "utf8");
await fs.writeFile(path.join(generatedDir, "blogs-body.qmd"), `<div class="filter-panel"><label for="blog-search">Search articles</label><input id="blog-search" class="archive-search" data-search-input="blogs" type="search" placeholder="Search title, tag or source"><div class="filter-chips" data-filter-group="blogs">${tagButtons(blogPublished)}</div></div><div class="archive-results" data-results="blogs">${archiveHtml(blogs, blogCard, "No published articles are available yet.")}</div>\n`, "utf8");
await fs.writeFile(path.join(generatedDir, "podcast-body.qmd"), `<div class="filter-panel"><label for="podcast-search">Search episodes</label><input id="podcast-search" class="archive-search" data-search-input="podcasts" type="search" placeholder="Search episode title or topic"><div class="filter-chips" data-filter-group="podcasts">${tagButtons(podcastPublished)}</div></div><div class="archive-results" data-results="podcasts">${archiveHtml(podcasts, podcastCard, "No published podcast episodes are available yet.")}</div>\n`, "utf8");
const profileHero = `<section class="hero-section" id="home"><div class="eyebrow">Available for the right problem</div><div class="hero-grid"><div><p class="hero-kicker">${esc(profile.eyebrow)}</p><h1>${esc(profile.headline)}</h1><p class="hero-intro">${esc(profile.intro)}</p><div class="hero-actions"><a class="button button--solid" href="#work">Explore my work <span aria-hidden="true">→</span></a><a class="button" href="contact.html">Let's connect <span aria-hidden="true">↗</span></a></div><p class="source-note">${esc(profile.sourceNote)}</p></div><div class="signal-panel"><div class="signal-panel__top"><span>Career intelligence</span><span>2005 → now</span></div><div class="signal-orbit"><span></span><span></span><span></span><i></i><i></i><i></i></div><div class="signal-panel__bottom"><span>Current readout</span><strong>Context → Signal → Decision</strong><small>Product leadership · analytics systems · stakeholder clarity</small></div></div></div></section>`;
const impactHtml = (profile.impactSignals || []).map((item) => `<article class="impact-card"><strong>${esc(item.value)}</strong><h3>${esc(item.label)}</h3><p>${esc(item.detail)}</p></article>`).join("\n");
const careerHtml = (profile.career || []).map((item) => `<article class="career-card"><div class="career-card__meta"><span>${esc(item.period)}</span><span>${esc(item.category)}</span></div><h3>${esc(item.role)}</h3><p class="career-card__org">${esc(item.organization)} · ${esc(item.industry)}</p>${item.subRoles?.length ? `<ul class="subroles">${item.subRoles.map((role) => `<li>${esc(role)}</li>`).join("")}</ul>` : ""}<p>${esc(item.summary)}</p><p class="outcome"><b>Outcome</b> ${esc(item.outcome)}</p><div class="tag-row">${(item.technologies || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div></article>`).join("\n");
const capabilityHtml = (profile.capabilities || []).map((item) => `<article class="capability-card"><span>${esc(item.group)}</span><h3>${esc(item.label)}</h3><p>${esc(item.description)}</p></article>`).join("\n");
const caseHtml = (profile.caseStudies || []).map((item) => `<article class="case-card"><div class="case-card__index">${esc(item.number)}</div><div><div class="eyebrow">${esc(item.type)}</div><h3>${esc(item.title)}</h3><dl><dt>Challenge</dt><dd>${esc(item.challenge)}</dd><dt>Approach</dt><dd>${esc(item.approach)}</dd><dt>Outcome</dt><dd>${esc(item.outcome)}</dd></dl><div class="tag-row">${(item.technology || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div><a class="text-link" href="${href(item.href)}" target="_blank" rel="noreferrer">${esc(item.hrefLabel)} ↗</a></div></article>`).join("\n");
const technologyHtml = (profile.technologyGroups || []).map((group) => `<div class="technology-row"><div><span class="eyebrow">${esc(group.label)}</span><p>${esc(group.note)}</p></div><div class="tag-row">${(group.items || []).map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div></div>`).join("\n");
const credentialsHtml = (profile.accomplishments || []).map((item) => `<li>${esc(item)}</li>`).join("");
const educationHtml = (profile.education || []).map((item) => `<article><span class="eyebrow">${esc(item.period)}</span><h3>${esc(item.degree)}</h3><p>${esc(item.institution)}</p><small>${esc(item.note)}</small></article>`).join("\n");
await fs.writeFile(path.join(generatedDir, "profile-body.qmd"), `${profileHero}\n<section class="section-band" id="about"><div class="section-heading"><div class="eyebrow">01 / About</div><h2>Where business meets data.</h2><p>${esc(profile.intro)} The work is less about producing another report and more about making the next decision easier to see.</p></div><div class="split-grid"><div><p class="lead-copy">A career built across banking operations, training, strategy and analytics, and product leadership — with the same operating question underneath: what will make the signal useful to the person who has to act on it?</p><a class="text-link" href="about.html">Read the working philosophy ↗</a></div><div class="note-stack"><div><b>01</b><span>Start with the question.</span></div><div><b>02</b><span>Shape the evidence.</span></div><div><b>03</b><span>Make the decision legible.</span></div></div></div></section>\n<section class="section-band section-band--light" id="experience"><div class="section-heading"><div class="eyebrow">02 / Experience</div><h2>Career intelligence.</h2><p>Four chapters across analytics delivery, business intelligence, capability building and banking operations.</p></div><div class="career-grid">${careerHtml}</div><a class="text-link" href="experience.html">See the full career history ↗</a></section>\n<section class="section-band" id="impact"><div class="section-heading"><div class="eyebrow">03 / Impact</div><h2>Evidence, not theatre.</h2><p>Selected signals from the public record.</p></div><div class="impact-grid">${impactHtml}</div><a class="text-link" href="impact.html">Inspect the impact signals ↗</a></section>\n<section class="section-band section-band--light" id="capabilities"><div class="section-heading"><div class="eyebrow">04 / Capability system</div><h2>Where business meets data.</h2><p>Capabilities are connected by the work they help make possible.</p></div><div class="capability-grid">${capabilityHtml}</div></section>\n<section class="section-band" id="work"><div class="section-heading"><div class="eyebrow">05 / Selected work</div><h2>Work, arranged for inspection.</h2><p>Public analytics challenges, structured as decision stories.</p></div><div class="case-grid">${caseHtml}</div><a class="text-link" href="projects.html">Open the complete project archive ↗</a></section>\n<section class="section-band section-band--light" id="technology"><div class="section-heading"><div class="eyebrow">06 / Technology landscape</div><h2>The stack is a means.</h2><p>Tools grouped by the role they play in the analytics ecosystem.</p></div><div class="technology-list">${technologyHtml}</div><a class="text-link" href="technology.html">Explore the technology landscape ↗</a></section>\n<section class="section-band" id="leadership"><div class="section-heading"><div class="eyebrow">07 / Leadership & thought leadership</div><h2>Translate intent into execution.</h2><p>Stakeholder clarity, team leadership and practical public learning.</p></div><div class="split-grid"><div><ul class="clean-list"><li>Requirements translation for CXO-level questions</li><li>Cross-functional delivery leadership</li><li>Operational governance and standard work</li><li>Training, enablement and executive communication</li></ul></div><div><ul class="clean-list">${credentialsHtml}</ul><a class="text-link" href="leadership.html">See leadership and credentials ↗</a></div></div></section>\n<section class="section-band contact-band" id="contact"><div class="section-heading"><div class="eyebrow">08 / Contact</div><h2>Have an interesting problem?</h2><p>If the question sits between strategy, data and execution, it may be worth a conversation.</p></div><div class="contact-actions"><a class="button button--solid" href="mailto:${href(profile.email)}">${esc(profile.email)} ↗</a><a class="button" href="${href(profile.links.linkedin)}" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></section>\n`, "utf8");
await fs.writeFile(path.join(generatedDir, "career-body.qmd"), `<section class="section-band section-band--light"><div class="career-grid">${careerHtml}</div></section>\n`, "utf8");
await fs.writeFile(path.join(generatedDir, "impact-body.qmd"), `<section class="section-band"><div class="impact-grid">${impactHtml}</div></section>\n`, "utf8");
await fs.writeFile(path.join(generatedDir, "technology-body.qmd"), `<section class="section-band section-band--light"><div class="technology-list">${technologyHtml}</div></section>\n`, "utf8");
for (const file of await fs.readdir(generatedDir)) {
  if (!file.endsWith(".qmd")) continue;
  const filePath = path.join(generatedDir, file);
  const html = await fs.readFile(filePath, "utf8");
  await fs.writeFile(filePath, `\`\`\`{=html}\n${html.replace(/\n+/g, "")}\n\`\`\`\n`, "utf8");
}
const counts = { projects: projectPublished.length, blogs: blogPublished.length, podcasts: podcastPublished.length };
await fs.writeFile(path.join(generatedDir, "site-stats.yml"), stringify({ generated: new Date().toISOString(), counts }), "utf8");
console.log(`W9 content validated: ${counts.projects} projects, ${counts.blogs} blogs, ${counts.podcasts} podcast episodes`);
