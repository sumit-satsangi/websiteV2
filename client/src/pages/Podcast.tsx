import { ArrowUpRight, CalendarDays, Headphones } from "lucide-react";
import { InternalPageShell } from "@/components/portfolio/InternalPageShell";
import { podcastEpisodes, podcastShow } from "@/data/content";

function PlatformLink({ platform, href }: { platform: "Apple" | "Spotify"; href: string }) {
  return <a className={`platform-link platform-link--${platform.toLowerCase()}`} href={href} target="_blank" rel="noreferrer"><span className="platform-icon" aria-hidden="true">{platform === "Apple" ? "A" : "S"}</span>{platform} Podcasts <ArrowUpRight size={13} /></a>;
}

export default function Podcast() {
  return (
    <InternalPageShell eyebrow="Podcast" title="Productivity, made practical." intro="Productivity Playbook is Sumit Satsangi’s public show about productivity, data analytics, professionalism, and continuous growth. Browse the complete episode archive and choose Apple Podcasts or Spotify for every listen.">
      <section className="podcast-show section-shell section-shell--dark">
        <div className="podcast-show__card"><img src={podcastShow.artwork} alt={`${podcastShow.title} album art`} /><div className="podcast-show__copy"><span className="data-label">The show</span><h2>{podcastShow.title}</h2><p>{podcastShow.description}</p><div className="podcast-show__meta"><span>{podcastShow.host}</span><span>{podcastShow.category}</span><span>{podcastShow.cadence}</span></div><div className="platform-links"><PlatformLink platform="Apple" href={podcastShow.appleHref} /><PlatformLink platform="Spotify" href={podcastShow.spotifyHref} /></div></div></div>
      </section>
      <section className="podcast-archive section-shell section-shell--rule"><div className="archive-toolbar"><div><span className="data-label">Episode archive</span><h2>{podcastEpisodes.length} episodes</h2></div><Headphones size={22} strokeWidth={1.2} /></div><div className="podcast-list">{podcastEpisodes.map((episode, index) => <article className="podcast-episode" key={episode.id}><div className="podcast-episode__number">{episode.number}</div><div className="podcast-episode__main"><div className="archive-card__meta"><span><CalendarDays size={14} />{episode.date.label}</span><span>{episode.duration}</span></div><h3>{episode.title}</h3><p>{episode.summary}</p></div><div className="podcast-episode__links"><PlatformLink platform="Apple" href={episode.appleHref} /><PlatformLink platform="Spotify" href={episode.spotifyHref} /></div></article>)}</div></section>
    </InternalPageShell>
  );
}
