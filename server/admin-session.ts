import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const SESSION_COOKIE = "w6_session";
const STATE_COOKIE = "w6_oauth_state";
const MAX_AGE = 60 * 60 * 8;

type Session = { login: string; name?: string; accessToken: string; expiresAt: number };

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return createHash("sha256").update(secret).digest();
}

function seal(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64url")).join(".");
}

function unseal(value: string) {
  const [iv, tag, encrypted] = value.split(".").map((part) => Buffer.from(part, "base64url"));
  if (!iv || !tag || !encrypted) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export function isHttps(request: Request) {
  return request.headers.get("x-forwarded-proto") === "https" || process.env.PUBLIC_SITE_URL?.startsWith("https://") === true;
}

function cookieFlags(request: Request, sameSite: "Lax" | "None" = "Lax") {
  return `Path=/; HttpOnly; SameSite=${sameSite}${isHttps(request) ? "; Secure" : ""}`;
}

export function createStateCookie(request: Request, state: string) {
  return `${STATE_COOKIE}=${state}; Max-Age=600; ${cookieFlags(request)}`;
}

export function clearStateCookie(request: Request) {
  return `${STATE_COOKIE}=; Max-Age=0; ${cookieFlags(request)}`;
}

export function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie") ?? "";
  return header.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) ?? null;
}

export function createSessionCookie(request: Request, session: Session) {
  const value = seal(JSON.stringify(session));
  return `${SESSION_COOKIE}=${value}; Max-Age=${MAX_AGE}; ${cookieFlags(request, "None")}`;
}

export function clearSessionCookie(request: Request) {
  return `${SESSION_COOKIE}=; Max-Age=0; ${cookieFlags(request, "None")}`;
}

export function readSession(request: Request): Session | null {
  const raw = readCookie(request, SESSION_COOKIE);
  if (!raw) return null;
  const decoded = unseal(raw);
  if (!decoded) return null;
  try {
    const session = JSON.parse(decoded) as Session;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function createState() {
  return randomBytes(24).toString("base64url");
}

export const sessionCookieName = SESSION_COOKIE;
