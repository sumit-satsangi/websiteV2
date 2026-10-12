import { z } from "zod";

const common = {
  id: z.string().min(1).max(120),
  title: z.string().min(1).max(240),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  order: z.number().int().min(0).max(9999).optional(),
  tags: z.array(z.string().min(1).max(80)).max(30).default([]),
};

const projectSchema = z.object({
  ...common,
  type: z.string().max(180).default("Project"),
  summary: z.string().max(1200).default(""),
  challenge: z.string().max(3000).default(""),
  approach: z.string().max(3000).default(""),
  technology: z.array(z.string().max(80)).max(30).default([]),
  role: z.string().max(300).default(""),
  outcome: z.string().max(3000).default(""),
  href: z.string().url().or(z.literal("")),
  hrefLabel: z.string().max(120).default("View the project"),
  accent: z.string().max(40).default("amber"),
}).passthrough();

const blogSchema = z.object({
  ...common,
  excerpt: z.string().max(1200).default(""),
  body: z.string().max(100000).default(""),
  href: z.string().url().or(z.literal("")),
  source: z.string().max(120).default("Personal archive"),
  coverImage: z.string().url().or(z.literal("")).optional(),
}).passthrough();

const podcastSchema = z.object({
  ...common,
  number: z.string().max(20).default(""),
  summary: z.string().max(2000).default(""),
  duration: z.string().max(40).default(""),
  appleHref: z.string().url().or(z.literal("")),
  spotifyHref: z.string().url().or(z.literal("")),
  artwork: z.string().url().or(z.literal("")).optional(),
}).passthrough();

export type ContentCollection = "projects" | "blogs" | "podcasts";
export const collectionNames: ContentCollection[] = ["projects", "blogs", "podcasts"];

export function validateRecord(collection: ContentCollection, value: unknown) {
  const schema = collection === "projects" ? projectSchema : collection === "blogs" ? blogSchema : podcastSchema;
  return schema.parse(value);
}

export function isCollection(value: unknown): value is ContentCollection {
  return typeof value === "string" && collectionNames.includes(value as ContentCollection);
}
