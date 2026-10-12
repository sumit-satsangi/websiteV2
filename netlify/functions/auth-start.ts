import { createState, createStateCookie } from "../../server/admin-session";

export default async function handler(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return new Response("GitHub OAuth is not configured.", { status: 503 });
  const state = createState();
  const callback = `${process.env.PUBLIC_SITE_URL || new URL(request.url).origin}/api/auth/callback`;
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: callback, scope: "public_repo", state });
  return new Response(null, { status: 302, headers: { Location: `https://github.com/login/oauth/authorize?${params.toString()}`, "Set-Cookie": createStateCookie(request, state) } });
}
