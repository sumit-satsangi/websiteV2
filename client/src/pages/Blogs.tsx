import { ArrowUpRight, CalendarDays, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { ArchiveFilters } from "@/components/portfolio/ArchiveFilters";
import { InternalPageShell } from "@/components/portfolio/InternalPageShell";
import { blogs } from "@/data/content";

export default function Blogs() {
  const [filters, setFilters] = useState({ query: "", year: "all", month: "all", tag: "all" });
  const tags = useMemo(() => Array.from(new Set(blogs.flatMap((item) => item.tags))).sort(), []);
  const filtered = useMemo(() => blogs.filter((item) => {
    const haystack = `${item.title} ${item.excerpt} ${item.tags.join(" ")}`.toLowerCase();
    return (!filters.query || haystack.includes(filters.query.toLowerCase())) && (filters.year === "all" || item.date.year === filters.year) && (filters.month === "all" || item.date.month === filters.month) && (filters.tag === "all" || item.tags.includes(filters.tag));
  }), [filters]);

  return (
    <InternalPageShell eyebrow="Blogs" title="Notes that stay useful." intro="A chronological reading list assembled from the public Sumit Satsangi archive and the linked Medium publication. Search by topic, then narrow by Year → Month when you want a particular chapter.">
      <section className="archive-section section-shell section-shell--rule">
        <div className="archive-toolbar"><div><span className="data-label">Writing archive</span><h2>{filtered.length} public entr{filtered.length === 1 ? "y" : "ies"}</h2></div><Filter size={21} strokeWidth={1.2} /></div>
        <ArchiveFilters dates={blogs.map((item) => item.date)} tags={tags} onChange={setFilters} />
        <div className="archive-list">{filtered.map((item, index) => <article className="archive-card" key={item.id}><div className="archive-card__index">{String(index + 1).padStart(2, "0")}</div><div className="archive-card__main"><div className="archive-card__meta"><span><CalendarDays size={14} />{item.date.label}</span><span>{item.source}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><a className="archive-card__arrow" href={item.href} target="_blank" rel="noreferrer" aria-label={`Read ${item.title}`}><ArrowUpRight size={20} /></a></article>)}</div>
        {!filtered.length ? <p className="archive-empty">No posts match these filters.</p> : null}
      </section>
    </InternalPageShell>
  );
}
