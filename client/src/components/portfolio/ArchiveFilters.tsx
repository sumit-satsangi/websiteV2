import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ArchiveDate } from "@/data/content";

export function ArchiveFilters({
  dates,
  tags,
  onChange,
}: {
  dates: ArchiveDate[];
  tags: string[];
  onChange: (filters: { query: string; year: string; month: string; tag: string }) => void;
}) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [tag, setTag] = useState("all");
  const years = useMemo(() => Array.from(new Set(dates.map((item) => item.year))).sort((a, b) => b.localeCompare(a)), [dates]);
  const months = useMemo(() => Array.from(new Set(dates.filter((item) => year === "all" || item.year === year).map((item) => item.month))).filter(Boolean), [dates, year]);

  const update = (next: Partial<{ query: string; year: string; month: string; tag: string }>) => {
    const nextFilters = { query, year, month, tag, ...next };
    onChange(nextFilters);
  };

  return (
    <div className="archive-filters" aria-label="Archive filters">
      <label className="archive-search"><Search size={16} /><span className="sr-only">Search archive</span><input value={query} onChange={(event) => { setQuery(event.target.value); update({ query: event.target.value }); }} placeholder="Search title, summary, or tag" /></label>
      <label><span>Year</span><select value={year} onChange={(event) => { setYear(event.target.value); setMonth("all"); update({ year: event.target.value, month: "all" }); }}><option value="all">All years</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span>Month</span><select value={month} onChange={(event) => { setMonth(event.target.value); update({ month: event.target.value }); }}><option value="all">All months</option>{months.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span>Tag</span><select value={tag} onChange={(event) => { setTag(event.target.value); update({ tag: event.target.value }); }}><option value="all">All tags</option>{tags.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    </div>
  );
}
