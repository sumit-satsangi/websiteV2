import { readSession } from "../../server/admin-session";

export default async function handler(request: Request) {
  const session = readSession(request);
  return new Response(JSON.stringify(session ? { authenticated: true, user: { login: session.login, name: session.name } } : { authenticated: false }), { status: 200, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
