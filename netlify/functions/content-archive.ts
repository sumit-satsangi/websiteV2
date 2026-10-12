import { readSession } from "../../server/admin-session";
import { isCollection } from "../../server/content-schema";
import { archiveContent } from "../../server/github-content";

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export default async function handler(request: Request) {
  const session = readSession(request);
  if (!session) return json({ error: "Authentication required" }, 401);
  try {
    const body = await request.json() as { collection?: unknown; id?: unknown };
    if (!isCollection(body.collection) || typeof body.id !== "string" || !body.id) return json({ error: "Collection and record id are required" }, 400);
    return json({ ok: true, result: await archiveContent(session.accessToken, body.collection, body.id) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to archive content" }, 400);
  }
}
