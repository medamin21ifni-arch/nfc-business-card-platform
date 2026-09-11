import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "nfc_admin_session";
const secret = () => process.env.ADMIN_PASSWORD || "local-development-password";

export function makeSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 1000 * 60 * 60 * 24 * 30 })).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function validSession(value?: string) {
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now(); } catch { return false; }
}

export async function isAdmin() {
  return validSession((await cookies()).get(cookieName)?.value);
}

export { cookieName };
