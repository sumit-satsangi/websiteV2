import type { ContentCollection } from "./content-schema";

const API = "https://api.github.com";

type GithubFile = { sha: string; content: string };

type GithubResponse<T> = { status: number; data: T; response: Response };

function repository() {
  const owner = process.env.GITHUB_CONTENT_OWNER;
  const repo = process.env.GITHUB_CONTENT_REPO;
  const baseBranch = process.env.GITHUB_CONTENT_BRANCH || "main";
  if (!owner || !repo) throw new Error("GITHUB_CONTENT_OWNER and GITHUB_CONTENT_REPO are required");
  return { owner, repo, baseBranch };
}

async function github<T>(token: string, path: string, init: RequestInit = {}): Promise<GithubResponse<T>> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "sumitfolio-w6-cms",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const data = (await response.json().catch(() => null)) as T;
  return { status: response.status, data, response };
}

function contentPath(collection: ContentCollection) {
  return `/content/${collection}.json`;
}

export async function getContentFile(token: string, collection: ContentCollection, ref?: string): Promise<GithubFile | null> {
  const { owner, repo } = repository();
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  const result = await github<{ sha?: string; content?: string }>(token, `/repos/${owner}/${repo}/contents${contentPath(collection)}${query}`);
  if (result.status === 404) return null;
  if (result.status >= 400 || !result.data?.sha || !result.data.content) throw new Error(`GitHub content read failed (${result.status})`);
  return { sha: result.data.sha, content: Buffer.from(result.data.content.replace(/\n/g, ""), "base64").toString("utf8") };
}

export async function listContent(token: string, collection: ContentCollection) {
  const file = await getContentFile(token, collection, repository().baseBranch);
  if (!file) return [] as unknown[];
  const parsed = JSON.parse(file.content) as unknown;
  return Array.isArray(parsed) ? parsed : [];
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "entry";
}

export async function saveContent(token: string, collection: ContentCollection, records: unknown[], message: string) {
  const { owner, repo, baseBranch } = repository();
  const ref = await github<{ object?: { sha?: string } }>(token, `/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`);
  if (ref.status >= 400 || !ref.data?.object?.sha) throw new Error(`GitHub branch read failed (${ref.status})`);
  const branch = `cms/${collection}/${slug(message)}-${Date.now().toString(36)}`;
  const createRef = await github(token, `/repos/${owner}/${repo}/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.data.object.sha }) });
  if (createRef.status >= 400) throw new Error(`GitHub branch creation failed (${createRef.status})`);

  const current = await getContentFile(token, collection, baseBranch);
  const encoded = Buffer.from(`${JSON.stringify(records, null, 2)}\n`, "utf8").toString("base64");
  const commit = await github<{ content?: { html_url?: string }; commit?: { html_url?: string } }>(token, `/repos/${owner}/${repo}/contents${contentPath(collection)}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: encoded, branch, ...(current ? { sha: current.sha } : {}) }),
  });
  if (commit.status >= 400) throw new Error(`GitHub content commit failed (${commit.status})`);

  const pull = await github<{ html_url?: string; number?: number }>(token, `/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title: message, head: branch, base: baseBranch, body: "Created by the Sumit Satsangi W6 content manager." }),
  });
  if (pull.status >= 400) throw new Error(`GitHub pull request creation failed (${pull.status})`);
  return { branch, pullRequestUrl: pull.data?.html_url ?? null, pullRequestNumber: pull.data?.number ?? null };
}

export async function archiveContent(token: string, collection: ContentCollection, id: string) {
  const records = await listContent(token, collection) as Array<{ id?: string; status?: string }>;
  const next = records.map((record) => record.id === id ? { ...record, status: "archived" } : record);
  if (!records.some((record) => record.id === id)) throw new Error("Content record not found");
  return saveContent(token, collection, next, `Archive ${collection} ${id}`);
}
