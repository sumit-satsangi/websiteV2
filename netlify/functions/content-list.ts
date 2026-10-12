import { readSession } from "../../server/admin-session";
import { isCollection } from "../../server/content-schema";
import { listContent } from "../../server/github-content";

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export default async function handler(request: Request) {
  const session = readSession(request);
  if (!session) return json({ error: "Authentication required" }, 401);
  const collection = new URL(request.url).searchParams.get("collection");
  if (!isCollection(collection)) return json({ error: "Unknown content collection" }, 400);
  try {
    return json({ collection, records: await listContent(session.accessToken, collection) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to read content" }, 502);
  }
}
