import { ArrowUpRight, CalendarDays, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { ArchiveFilters } from "@/components/portfolio/ArchiveFilters";
import { InternalPageShell } from "@/components/portfolio/InternalPageShell";
import { projects } from "@/data/content";

export default function Projects() {
  const [filters, setFilters] = useState({ query: "", year: "all", month: "all", tag: "all" });
  const tags = useMemo(() => Array.from(new Set(projects.flatMap((item) => item.tags))).sort(), []);
  const filtered = useMemo(() => projects.filter((item) => {
    const haystack = `${item.title} ${item.summary} ${item.challenge} ${item.approach} ${item.tags.join(" ")}`.toLowerCase();
    return (!filters.query || haystack.includes(filters.query.toLowerCase())) && (filters.year === "all" || item.date.year === filters.year) && (filters.month === "all" || item.date.month === filters.month) && (filters.tag === "all" || item.tags.includes(filters.tag));
  }), [filters]);

  return (
    <InternalPageShell eyebrow="Projects" title="Work, arranged for inspection." intro="The latest public analytics work sits on the homepage. This archive gives the complete verified project list a more useful shape: searchable, tagged, and grouped by the date published when that date is available.">
      <section className="archive-section section-shell section-shell--rule">
        <div className="archive-toolbar"><div><span className="data-label">Project archive</span><h2>{filtered.length} public project{filtered.length === 1 ? "" : "s"}</h2></div><Filter size={21} strokeWidth={1.2} /></div>
        <ArchiveFilters dates={projects.map((item) => item.date)} tags={tags} onChange={setFilters} />
        <div className="archive-list">{filtered.map((item, index) => <article className="archive-card archive-card--project" key={item.title}><div className="archive-card__index">{String(index + 1).padStart(2, "0")}</div><div className="archive-card__main"><div className="archive-card__meta"><span><CalendarDays size={14} />{item.date.label}</span><span>{item.type}</span></div><h3>{item.title}</h3><p>{item.summary}</p><div className="tag-list">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="archive-card__side"><strong>Outcome</strong><p>{item.outcome}</p><a className="text-link" href={item.href} target="_blank" rel="noreferrer">{item.hrefLabel} <ArrowUpRight size={15} /></a></div></article>)}</div>
        {!filtered.length ? <p className="archive-empty">No projects match these filters.</p> : null}
      </section>
    </InternalPageShell>
  );
}
