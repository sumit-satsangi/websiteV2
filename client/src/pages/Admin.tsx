import { Archive, CheckCircle2, Github, LogOut, Plus, RefreshCw, Save, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SignalMark } from "@/components/portfolio/PortfolioPrimitives";

type Collection = "projects" | "blogs" | "podcasts";
type Session = { authenticated: boolean; user?: { login: string; name?: string } };
type RecordValue = Record<string, unknown>;

const collectionLabels: Record<Collection, string> = { projects: "Projects", blogs: "Blogs", podcasts: "Podcast" };
const emptyRecord = (collection: Collection): RecordValue => ({
  id: "new-entry",
  title: "",
  date: "",
  status: "draft",
  order: 0,
  tags: [],
  ...(collection === "projects" ? { type: "Project", summary: "", challenge: "", approach: "", technology: [], role: "", outcome: "", href: "", hrefLabel: "View the project", accent: "amber" } : {}),
  ...(collection === "blogs" ? { excerpt: "", body: "", href: "", source: "Personal archive", coverImage: "" } : {}),
  ...(collection === "podcasts" ? { number: "", summary: "", duration: "", appleHref: "", spotifyHref: "", artwork: "" } : {}),
});

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data as { error?: string }).error || `Request failed (${response.status})`);
  return data as T;
}

function Field({ label, value, onChange, multiline = false, hint }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; hint?: string }) {
  return <label className="admin-field"><span>{label}</span>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={label === "Body / Markdown" ? 13 : 5} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}{hint ? <small>{hint}</small> : null}</label>;
}

function RecordEditor({ collection, record, onChange }: { collection: Collection; record: RecordValue; onChange: (next: RecordValue) => void }) {
  const stringValue = (key: string) => String(record[key] ?? "");
  const set = (key: string, value: string | string[] | number) => onChange({ ...record, [key]: value });
  const tags = Array.isArray(record.tags) ? record.tags.join(", ") : String(record.tags ?? "");
  const technology = Array.isArray(record.technology) ? record.technology.join(", ") : String(record.technology ?? "");
  return <div className="admin-form">
    <div className="admin-form__grid admin-form__grid--identity"><Field label="ID / slug" value={stringValue("id")} onChange={(value) => set("id", value)} hint="Use lowercase letters, numbers, and hyphens." /><Field label="Title" value={stringValue("title")} onChange={(value) => set("title", value)} /><Field label="Date" value={stringValue("date")} onChange={(value) => set("date", value)} hint="YYYY-MM-DD, or leave blank." /><label className="admin-field"><span>Status</span><select value={stringValue("status")} onChange={(event) => set("status", event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><Field label="Order" value={stringValue("order")} onChange={(value) => set("order", Number(value) || 0)} /></div>
    <Field label="Tags" value={tags} onChange={(value) => set("tags", value.split(",").map((tag) => tag.trim()).filter(Boolean))} hint="Comma-separated. Example: Power BI, Strategy" />
    {collection === "projects" ? <><div className="admin-form__grid"><Field label="Project type" value={stringValue("type")} onChange={(value) => set("type", value)} /><Field label="Role" value={stringValue("role")} onChange={(value) => set("role", value)} /><Field label="Technology" value={technology} onChange={(value) => set("technology", value.split(",").map((item) => item.trim()).filter(Boolean))} /></div><Field label="Summary" value={stringValue("summary")} onChange={(value) => set("summary", value)} multiline /><Field label="Challenge" value={stringValue("challenge")} onChange={(value) => set("challenge", value)} multiline /><Field label="Approach" value={stringValue("approach")} onChange={(value) => set("approach", value)} multiline /><Field label="Outcome" value={stringValue("outcome")} onChange={(value) => set("outcome", value)} multiline /><div className="admin-form__grid"><Field label="Public URL" value={stringValue("href")} onChange={(value) => set("href", value)} /><Field label="Link label" value={stringValue("hrefLabel")} onChange={(value) => set("hrefLabel", value)} /><Field label="Accent" value={stringValue("accent")} onChange={(value) => set("accent", value)} /></div></> : null}
    {collection === "blogs" ? <><Field label="Excerpt" value={stringValue("excerpt")} onChange={(value) => set("excerpt", value)} multiline /><Field label="Body / Markdown" value={stringValue("body")} onChange={(value) => set("body", value)} multiline hint="The public archive currently links to the external article; this field is ready for future on-site Markdown." /><div className="admin-form__grid"><Field label="Public URL" value={stringValue("href")} onChange={(value) => set("href", value)} /><Field label="Source" value={stringValue("source")} onChange={(value) => set("source", value)} /><Field label="Cover image URL" value={stringValue("coverImage")} onChange={(value) => set("coverImage", value)} /></div></> : null}
    {collection === "podcasts" ? <><div className="admin-form__grid"><Field label="Episode number" value={stringValue("number")} onChange={(value) => set("number", value)} /><Field label="Duration" value={stringValue("duration")} onChange={(value) => set("duration", value)} /></div><Field label="Summary" value={stringValue("summary")} onChange={(value) => set("summary", value)} multiline /><div className="admin-form__grid"><Field label="Apple Podcasts URL" value={stringValue("appleHref")} onChange={(value) => set("appleHref", value)} /><Field label="Spotify URL" value={stringValue("spotifyHref")} onChange={(value) => set("spotifyHref", value)} /><Field label="Artwork URL" value={stringValue("artwork")} onChange={(value) => set("artwork", value)} /></div></> : null}
  </div>;
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [collection, setCollection] = useState<Collection>("projects");
  const [records, setRecords] = useState<RecordValue[]>([]);
  const [record, setRecord] = useState<RecordValue | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSession = async () => {
    try { setSession(await requestJson<Session>("/api/auth/session")); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to check session"); setSession({ authenticated: false }); }
  };
  const loadCollection = async (nextCollection = collection) => {
    setBusy(true); setError("");
    try { const data = await requestJson<{ records: RecordValue[] }>(`/api/content/list?collection=${nextCollection}`); setRecords(data.records); setRecord(data.records[0] ?? null); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load content"); } finally { setBusy(false); }
  };
  useEffect(() => { void loadSession(); }, []);
  useEffect(() => { if (session?.authenticated) void loadCollection(); }, [session?.authenticated, collection]);

  const publishedCount = useMemo(() => records.filter((item) => item.status === "published").length, [records]);
  const startNew = () => { setRecord(emptyRecord(collection)); setShowPreview(false); setMessage(""); setError(""); };
  const save = async () => {
    if (!record) return;
    setBusy(true); setError(""); setMessage("");
    try { const result = await requestJson<{ result?: { pullRequestUrl?: string | null; branch?: string } }>("/api/content/save", { method: "POST", body: JSON.stringify({ collection, record, message: `Update ${collection}: ${record.title || record.id}` }) }); setMessage(result.result?.pullRequestUrl ? `Saved to GitHub branch ${result.result.branch}. Pull request: ${result.result.pullRequestUrl}` : "Saved to GitHub."); await loadCollection(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to save"); } finally { setBusy(false); }
  };
  const archive = async () => {
    if (!record || !window.confirm(`Archive ${record.title || record.id}?`)) return;
    setBusy(true); setError("");
    try { await requestJson("/api/content/archive", { method: "POST", body: JSON.stringify({ collection, id: record.id }) }); setMessage("Archive change prepared as a GitHub pull request."); await loadCollection(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to archive"); } finally { setBusy(false); }
  };
  const logout = async () => { await requestJson("/api/auth/logout", { method: "POST" }).catch(() => undefined); setSession({ authenticated: false }); };

  if (session && !session.authenticated) return <div className="admin-page"><header className="admin-header"><a className="wordmark" href="/"><SignalMark compact /><span className="wordmark__text"><strong>SS</strong><small>W6 CMS</small></span></a><a className="admin-public-link" href="/">View public site <ExternalLink size={14} /></a></header><main className="admin-login"><span className="data-label">W6 / Private workspace</span><h1>Publish the next useful thing.</h1><p>Sign in with the allowlisted GitHub account to manage Projects, Blogs, and Podcast records. Saves become reviewable GitHub pull requests.</p><a className="admin-login__button" href="/api/auth/start"><Github size={18} /> Continue with GitHub</a>{error ? <p className="admin-error">{error}</p> : null}<p className="admin-login__note">GitHub OAuth secrets stay server-side. Production sessions use encrypted, secure cookies.</p></main></div>;
  if (!session) return <div className="admin-page admin-loading"><RefreshCw className="spin" size={20} /> Checking admin session…</div>;

  return <div className="admin-page"><header className="admin-header"><a className="wordmark" href="/"><SignalMark compact /><span className="wordmark__text"><strong>SS</strong><small>W6 CMS</small></span></a><div className="admin-header__actions"><span className="admin-user">{session.user?.name || session.user?.login}</span><a className="admin-public-link" href="/">Public site <ExternalLink size={14} /></a><button className="admin-logout" type="button" onClick={() => void logout()}><LogOut size={15} /> Log out</button></div></header><main className="admin-main"><div className="admin-intro"><div><span className="data-label">Content operations / {session.user?.login}</span><h1>Control the signal.</h1><p>Structured content lives in GitHub. Choose a collection, edit a validated template, then create a pull request for review.</p></div><div className="admin-stat"><strong>{records.length}</strong><span>{publishedCount} published / {collectionLabels[collection].toLowerCase()}</span></div></div><div className="admin-workspace"><aside className="admin-sidebar"><span className="admin-sidebar__label">Collections</span>{(Object.keys(collectionLabels) as Collection[]).map((item) => <button className={collection === item ? "admin-sidebar__item admin-sidebar__item--active" : "admin-sidebar__item"} key={item} type="button" onClick={() => setCollection(item)}>{collectionLabels[item]}<span>{item === collection ? records.length : "→"}</span></button>)}<button className="admin-sidebar__new" type="button" onClick={startNew}><Plus size={15} /> New {collectionLabels[collection].slice(0, -1)}</button></aside><section className="admin-editor"><div className="admin-editor__toolbar"><div><span className="data-label">{collectionLabels[collection]} / records</span><h2>{record ? String(record.title || "Untitled record") : `No ${collectionLabels[collection].toLowerCase()} selected`}</h2></div><button className="admin-refresh" type="button" onClick={() => void loadCollection()} disabled={busy}><RefreshCw size={15} /> Refresh</button></div><div className="admin-records">{records.map((item) => <button className={record?.id === item.id ? "admin-record admin-record--active" : "admin-record"} type="button" key={String(item.id)} onClick={() => { setRecord(item); setMessage(""); setError(""); }}><span>{String(item.date || "Unspecified")}</span><strong>{String(item.title || item.id)}</strong><small>{String(item.status || "draft")}</small></button>)}</div>{record ? <><RecordEditor collection={collection} record={record} onChange={setRecord} />{showPreview ? <div className="admin-preview"><span className="data-label">Preview / {collectionLabels[collection]}</span><h3>{String(record.title || "Untitled record")}</h3><p>{String(record.excerpt || record.summary || record.body || record.description || "Add a summary to see it here.")}</p>{Array.isArray(record.tags) && record.tags.length ? <div className="tag-list">{record.tags.map((tag) => <span key={String(tag)}>{String(tag)}</span>)}</div> : null}</div> : null}<div className="admin-editor__actions"><button className="admin-save" type="button" onClick={() => void save()} disabled={busy}><Save size={16} /> {busy ? "Working…" : "Save as GitHub PR"}</button><button className="admin-refresh" type="button" onClick={() => setShowPreview((value) => !value)}>{showPreview ? "Hide preview" : "Preview"}</button><button className="admin-archive" type="button" onClick={() => void archive()} disabled={busy}><Archive size={15} /> Archive</button></div></> : <button className="admin-empty" type="button" onClick={startNew}><Plus size={18} /> Create the first record</button>}{message ? <p className="admin-success"><CheckCircle2 size={16} />{message}</p> : null}{error ? <p className="admin-error">{error}</p> : null}</section></div></main></div>;
}
