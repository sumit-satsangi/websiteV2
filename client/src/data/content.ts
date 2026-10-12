import { rawBlogs, rawPodcastEpisodes, rawPodcastShow, rawProjects } from "./generatedContent";

export type ArchiveDate = {
  iso: string | null;
  year: string;
  month: string;
  label: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  type: string;
  date: ArchiveDate;
  tags: readonly string[];
  summary: string;
  challenge: string;
  approach: string;
  technology: readonly string[];
  role: string;
  outcome: string;
  href: string;
  hrefLabel: string;
  accent: string;
};

export type BlogItem = {
  id: string;
  title: string;
  date: ArchiveDate;
  tags: readonly string[];
  excerpt: string;
  body: string;
  href: string;
  source: string;
};

export type PodcastEpisode = {
  id: string;
  number: string;
  title: string;
  date: ArchiveDate;
  tags: readonly string[];
  summary: string;
  duration: string;
  appleHref: string;
  spotifyHref: string;
};

export type PodcastShow = {
  title: string;
  host: string;
  category: string;
  cadence: string;
  description: string;
  artwork: string;
  appleHref: string;
  spotifyHref: string;
};

const formatDate = (iso: string | null | undefined): ArchiveDate => {
  if (!iso) return { iso: null, year: "Unspecified", month: "Unspecified", label: "Date not published" };
  const value = new Date(`${iso}T00:00:00Z`);
  return {
    iso,
    year: iso.slice(0, 4),
    month: value.toLocaleString("en-US", { month: "long", timeZone: "UTC" }),
    label: value.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
  };
};

const isPublished = (item: { status?: string }) => item.status !== "draft" && item.status !== "archived";
const byDate = <T extends { date: ArchiveDate; order?: number }>(a: T, b: T) => (b.date.iso ?? "").localeCompare(a.date.iso ?? "") || (a.order ?? 0) - (b.order ?? 0);

export const projects: ProjectItem[] = rawProjects.filter(isPublished).map((item) => ({ ...item, date: formatDate(item.date) })).sort(byDate);
export const blogs: BlogItem[] = rawBlogs.filter(isPublished).map((item) => ({ ...item, date: formatDate(item.date) })).sort(byDate);
export const podcastEpisodes: PodcastEpisode[] = rawPodcastEpisodes.filter(isPublished).map((item) => ({ ...item, date: formatDate(item.date) })).sort(byDate);
export const podcastShow: PodcastShow = rawPodcastShow;
