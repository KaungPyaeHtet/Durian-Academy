import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "da_admin";
const MAX_AGE_SEC = 60 * 60 * 12; // 12 hours

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

/** Constant-time password check against ADMIN_PASSWORD. */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

/** Stateless token: "<expiryEpochMs>.<hmac>" */
export function createSessionToken(): string {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  return `${exp}.${sign(String(exp))}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [expStr, mac] = token.split(".");
  if (!expStr || !mac) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = sign(expStr);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Read the current request's cookie and tell if the admin is logged in. */
export async function isLoggedIn(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export const SESSION_MAX_AGE = MAX_AGE_SEC;
