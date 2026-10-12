import { readSession } from "../../server/admin-session";
import { isCollection, validateRecord } from "../../server/content-schema";
import { listContent, saveContent } from "../../server/github-content";

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export default async function handler(request: Request) {
  const session = readSession(request);
  if (!session) return json({ error: "Authentication required" }, 401);
  try {
    const body = await request.json() as { collection?: unknown; record?: unknown; message?: unknown };
    if (!isCollection(body.collection)) return json({ error: "Unknown content collection" }, 400);
    const parsed = validateRecord(body.collection, body.record);
    const records = await listContent(session.accessToken, body.collection) as Array<{ id?: string }>;
    const next = records.some((record) => record.id === (parsed as { id: string }).id)
      ? records.map((record) => record.id === (parsed as { id: string }).id ? parsed : record)
      : [...records, parsed];
    const message = typeof body.message === "string" && body.message.trim() ? body.message.trim().slice(0, 140) : `Update ${body.collection} ${(parsed as { title?: string }).title || (parsed as { id: string }).id}`;
    return json({ ok: true, result: await saveContent(session.accessToken, body.collection, next, message) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to save content" }, 400);
  }
}
