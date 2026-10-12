import { clearStateCookie, createSessionCookie, isHttps, readCookie } from "../../server/admin-session";

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = readCookie(request, "w6_oauth_state");
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const callback = `${process.env.PUBLIC_SITE_URL || url.origin}/api/auth/callback`;
  if (!code || !state || !expectedState || state !== expectedState || !clientId || !clientSecret) return new Response("Invalid or incomplete GitHub OAuth request.", { status: 400 });

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: callback }),
  });
  const token = await tokenResponse.json() as { access_token?: string; error?: string };
  if (!tokenResponse.ok || !token.access_token) return new Response("GitHub OAuth token exchange failed.", { status: 502 });

  const userResponse = await fetch("https://api.github.com/user", { headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token.access_token}`, "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "sumitfolio-w6-cms" } });
  const user = await userResponse.json() as { login?: string; name?: string };
  const allowed = (process.env.GITHUB_ALLOWED_LOGINS || "").split(",").map((login) => login.trim().toLowerCase()).filter(Boolean);
  if (!userResponse.ok || !user.login || !allowed.includes(user.login.toLowerCase())) return new Response("This GitHub account is not allowed to access the content manager.", { status: 403 });

  const response = Response.redirect(`${process.env.PUBLIC_SITE_URL || url.origin}/admin`, 302);
  response.headers.append("Set-Cookie", createSessionCookie(request, { login: user.login, name: user.name, accessToken: token.access_token, expiresAt: Date.now() + 1000 * 60 * 60 * 8 }));
  response.headers.append("Set-Cookie", clearStateCookie(request));
  response.headers.set("Cache-Control", "no-store");
  if (!isHttps(request)) response.headers.set("X-W6-Auth-Note", "Local HTTP mode; use HTTPS in Netlify for production cookies.");
  return response;
}
