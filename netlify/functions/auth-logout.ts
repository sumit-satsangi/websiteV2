import { clearSessionCookie } from "../../server/admin-session";

export default async function handler(request: Request) {
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json", "Set-Cookie": clearSessionCookie(request), "Cache-Control": "no-store" } });
}
