import { mkdir, writeFile } from "node:fs/promises";
import { blogs, podcastEpisodes, podcastShow, projects } from "../client/src/data/content";

const cleanDate = (value: { iso: string | null } | string | null | undefined) => typeof value === "object" && value ? value.iso : value ?? null;

await mkdir("content", { recursive: true });
await writeFile("content/projects.json", `${JSON.stringify(projects.map((item, index) => ({
  id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  title: item.title,
  date: cleanDate(item.date),
  status: "published",
  order: index + 1,
  type: item.type,
  tags: item.tags,
  summary: item.summary,
  challenge: item.challenge,
  approach: item.approach,
  technology: item.technology,
  role: item.role,
  outcome: item.outcome,
  href: item.href,
  hrefLabel: item.hrefLabel,
  accent: item.accent,
})), null, 2)}\n`);
await writeFile("content/blogs.json", `${JSON.stringify(blogs.map((item, index) => ({
  id: item.id,
  title: item.title,
  date: cleanDate(item.date),
  status: "published",
  order: index + 1,
  tags: item.tags,
  excerpt: item.excerpt,
  body: item.excerpt,
  href: item.href,
  source: item.source,
})), null, 2)}\n`);
await writeFile("content/podcasts.json", `${JSON.stringify(podcastEpisodes.map((item, index) => ({
  id: item.id,
  number: item.number,
  title: item.title,
  date: cleanDate(item.date),
  status: "published",
  order: index + 1,
  tags: ["Productivity Playbook"],
  summary: item.summary,
  duration: item.duration,
  appleHref: item.appleHref,
  spotifyHref: item.spotifyHref,
})), null, 2)}\n`);
await writeFile("content/podcast-show.json", `${JSON.stringify({ ...podcastShow, status: "published" }, null, 2)}\n`);
console.log("Seeded content/projects.json, content/blogs.json, content/podcasts.json, and content/podcast-show.json");
