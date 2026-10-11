import { caseStudies, type CaseStudy } from "@/data/profile";

export type ArchiveDate = {
  iso: string | null;
  year: string;
  month: string;
  label: string;
};

export type ProjectItem = CaseStudy & {
  date: ArchiveDate;
  tags: string[];
  summary: string;
};

export type BlogItem = {
  id: string;
  title: string;
  date: ArchiveDate;
  tags: string[];
  excerpt: string;
  href: string;
  source: string;
};

export type PodcastEpisode = {
  id: string;
  number: string;
  title: string;
  date: ArchiveDate;
  summary: string;
  duration: string;
  appleHref: string;
  spotifyHref: string;
};

const date = (iso: string | null): ArchiveDate => {
  if (!iso) return { iso: null, year: "Unspecified", month: "Unspecified", label: "Date not published" };
  const value = new Date(`${iso}T00:00:00Z`);
  return {
    iso,
    year: iso.slice(0, 4),
    month: value.toLocaleString("en-US", { month: "long", timeZone: "UTC" }),
    label: value.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
  };
};

export const projects: ProjectItem[] = [
  {
    ...caseStudies[0],
    date: date(null),
    tags: ["Power BI", "Data analysis", "Visualization", "Expansion planning"],
    summary: "A public analytics challenge exploring how evidence can support a toy-business expansion plan.",
  },
  {
    ...caseStudies[1],
    date: date(null),
    tags: ["Tableau", "Statistics", "Data storytelling", "Investment criteria"],
    summary: "A public dashboard that turns restaurant investment criteria into an explorable decision story.",
  },
];

export const blogs: BlogItem[] = [
  {
    id: "imposter-syndrome",
    title: "08. Imposter Syndrome: Giving Back When You Feel Like a Fraud",
    date: date("2025-07-30"),
    tags: ["Productivity", "Leadership", "Learning", "Medium"],
    excerpt: "A practical reflection on sharing knowledge, mentoring, and moving through the self-doubt that appears when it is time to give back.",
    href: "https://medium.com/@sumit.satsangi/08-imposter-syndrome-giving-back-when-you-feel-like-a-fraud-ac8efa6313e5",
    source: "Medium",
  },
  {
    id: "basics-part-1",
    title: "Basics (Part 1)",
    date: date("2022-01-02"),
    tags: ["R", "Series"],
    excerpt: "A first pass through programming styles in R, written as a practical foundation before taking the next steps.",
    href: "https://www.sumitsatsangi.com/posts/series-r/2022-01-02/",
    source: "sumitsatsangi.com",
  },
  {
    id: "data-sampling",
    title: "2022-01-01",
    date: date("2022-01-01"),
    tags: ["Statistics", "IBS", "Series"],
    excerpt: "A note on samples, population variation, and why a statistician needs to make sure a sample covers the variations in the population.",
    href: "https://www.sumitsatsangi.com/posts/series-ibs/2022-01-01/",
    source: "sumitsatsangi.com",
  },
  {
    id: "statistics-journey",
    title: "2021-12-25",
    date: date("2021-12-25"),
    tags: ["Statistics", "IBS", "Series"],
    excerpt: "A reading note on making statistics easier to understand and sharing the logic behind the journey.",
    href: "https://www.sumitsatsangi.com/posts/series-ibs/2021-12-25/",
    source: "sumitsatsangi.com",
  },
  {
    id: "first-rbind-post",
    title: "First rbind post",
    date: date("2021-12-23"),
    tags: ["R", "Introduction"],
    excerpt: "An open first post about returning to writing online after a long gap, with a deliberately direct voice.",
    href: "https://www.sumitsatsangi.com/posts/introduction/",
    source: "sumitsatsangi.com",
  },
];

export const podcastShow = {
  title: "Productivity Playbook",
  host: "Sumit Satsangi",
  category: "Self-Improvement",
  cadence: "Updated weekly",
  description: "Actionable insights and practical advice for productivity, data analytics, professionalism, and continuous growth.",
  artwork: "https://is1-ssl.mzstatic.com/image/thumb/PodcastSource211/v4/4d/23/fe/4d23fe30-0038-530d-817b-47b5802be1d6/43e482df-af94-41a0-ab5f-413a8f270cbb.jpg/1200x1200bf-60.jpg",
  appleHref: "https://podcasts.apple.com/us/podcast/productivity-playbook/id1800800982",
  spotifyHref: "https://open.spotify.com/show/3FD7W2rNCn1ifhWuZwzBPA?si=8cb17a7e08b043d5",
};

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "10-2", number: "10.2", title: "Productivity for Remote Creators - Part 2: From Overwhelmed to Organized – Building Systems That Stick", date: date("2025-09-23"), duration: "11m", summary: "Moving from overwhelm to organization by building sustainable systems, habits, reviews, and recovery routines.", appleHref: "https://podcasts.apple.com/us/podcast/10-2-productivity-for-remote-creators-part-2-from-overwhelmed/id1800800982?i=1000728231322", spotifyHref: "https://open.spotify.com/episode/5Fuu1199ASTZHc9eLGyx24",
  },
  {
    id: "10-1", number: "10.1", title: "Productivity for Remote Creators - Part 1: Setting Up a Digital Workspace", date: date("2025-08-10"), duration: "14m", summary: "Designing a digital workspace that supports focus, creativity, wellbeing, and intentional remote workflows.", appleHref: "https://podcasts.apple.com/us/podcast/10-1-productivity-for-remote-creators-part-1-setting/id1800800982?i=1000721462381", spotifyHref: "https://open.spotify.com/episode/2Z4NeUxEHfBRqweCp3SW1p",
  },
  {
    id: "09", number: "09", title: "The Myth of Multitasking – Why Focus Wins Every Time", date: date("2025-08-02"), duration: "12m", summary: "Why multitasking keeps us from meaningful results, and how nurturing focus can transform a workflow.", appleHref: "https://podcasts.apple.com/us/podcast/09-the-myth-of-multitasking-why-focus-wins-every-time/id1800800982?i=1000720502713", spotifyHref: "https://open.spotify.com/episode/6yLBanG6BtTg4p27mIBzkf",
  },
  {
    id: "08", number: "08", title: "Imposter Syndrome: Giving Back When You Feel Like a Fraud", date: date("2025-07-26"), duration: "8m", summary: "A conversation about sharing knowledge, mentoring, and stepping into the work of giving back.", appleHref: "https://podcasts.apple.com/us/podcast/08-imposter-syndrome-giving-back-when-you-feel-like-a-fraud/id1800800982?i=1000719396810", spotifyHref: "https://open.spotify.com/episode/2xYzsnPLFFf9LfJjqxXduW",
  },
  {
    id: "07", number: "07", title: "Your Environment is Lying to You", date: date("2025-07-13"), duration: "6m", summary: "How the spaces around us influence our goals, and how to design an environment that supports action.", appleHref: "https://podcasts.apple.com/us/podcast/07-your-environment-is-lying-to-you/id1800800982?i=1000717141909", spotifyHref: "https://open.spotify.com/episode/1dJbUbp4qlihsI9rPnVAWy",
  },
  {
    id: "06", number: "06", title: "Comparison is the Thief of Productivity", date: date("2025-04-06"), duration: "5m", summary: "Reclaiming focus and momentum when comparison quietly steals attention from the journey.", appleHref: "https://podcasts.apple.com/us/podcast/06-comparison-is-the-thief-of-productivity/id1800800982?i=1000702478980", spotifyHref: "https://open.spotify.com/episode/1M33H3EvFrZ2qpu7fgJNqE",
  },
  {
    id: "05", number: "05", title: "The Energy Equation – How to Stay Productive Without Burning Out", date: date("2025-03-30"), duration: "6m", summary: "Pacing energy, avoiding instant gratification traps, and using rest, recovery, and progress tracking for the long game.", appleHref: "https://podcasts.apple.com/us/podcast/05-the-energy-equation-how-to-stay-productive-without/id1800800982?i=1000701581315", spotifyHref: "https://open.spotify.com/episode/2LVzDjlJj3Tm2ayhgOzePy",
  },
  {
    id: "04", number: "04", title: "Making It Work – Productivity with Limited Resources", date: date("2025-03-23"), duration: "8m", summary: "Practical ways to focus on what is possible when tools, budget, or connections feel limited.", appleHref: "https://podcasts.apple.com/us/podcast/04-making-it-work-productivity-with-limited-resources/id1800800982?i=1000700576607", spotifyHref: "https://open.spotify.com/episode/2newIh0jCactNwongQWGq1",
  },
  {
    id: "03", number: "03", title: "Pomodoro Technique – A Practical Guide", date: date("2025-03-16"), duration: "11m", summary: "A practical guide to using 25-minute focus sprints to beat procrastination and get more done.", appleHref: "https://podcasts.apple.com/us/podcast/03-pomodoro-technique-a-practical-guide/id1800800982?i=1000699466894", spotifyHref: "https://open.spotify.com/episode/0vVotZYCXIXiojpw51YA2L",
  },
  {
    id: "02", number: "02", title: "Mastering Long Term Goal Tracking", date: date("2024-11-25"), duration: "5m", summary: "Bridging delayed gratification and daily progress with a simple system using a whiteboard and calendar.", appleHref: "https://podcasts.apple.com/us/podcast/02-mastering-long-term-goal-tracking/id1800800982?i=1000698366733", spotifyHref: "https://open.spotify.com/episode/5LoDHbKpapB4xzLt35Mlrh",
  },
  {
    id: "01", number: "01", title: "Browse Less, Plan More – Tackling Everyday Distractions", date: date("2024-11-18"), duration: "4m", summary: "Turning endless browsing into purposeful planning with a simple method for daily tasks and reminders.", appleHref: "https://podcasts.apple.com/us/podcast/01-browse-less-plan-more-tackling-everyday-distractions/id1800800982?i=1000698365623", spotifyHref: "https://open.spotify.com/episode/6VGbVJNgu0qv7FxDtVP8km",
  },
  {
    id: "00", number: "00", title: "Introduction", date: date(null), duration: "1m", summary: "An introduction to Productivity Playbook and its focus on productivity, analytics, professionalism, and career growth.", appleHref: "https://podcasts.apple.com/us/podcast/00-introduction/id1800800982?i=1000698345570", spotifyHref: "https://open.spotify.com/episode/5JMMOs68nV174h0g7m9W5p",
  },
];
