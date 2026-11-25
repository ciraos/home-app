// =============================================================
// 🔐 鉴权：scrypt 密码哈希 + HMAC 签名会话 Cookie（无状态）
// 单管理员模型：/setup 只在 users 表为空时可用。
// =============================================================

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { countUsers, findUserById } from "@/lib/repo";
import type { AdminUser } from "@/lib/types";

const scryptAsync = promisify(scrypt);

const COOKIE_NAME = "home_session";
const SESSION_DAYS = 30;

function authSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("缺少 AUTH_SECRET（至少 16 位），请参考 .env.example");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", authSecret()).update(payload).digest("base64url");
}

// ---------- 密码 ----------

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, salt, hex] = stored.split(":");
  if (algo !== "scrypt" || !salt || !hex) return false;
  const expected = Buffer.from(hex, "hex");
  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// ---------- 会话 ----------

export function createSessionToken(userId: number): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + SESSION_DAYS * 86_400_000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined): { uid: number } | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      uid?: number;
      exp?: number;
    };
    if (!data.uid || !data.exp || data.exp < Date.now()) return null;
    return { uid: data.uid };
  } catch {
    return null;
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  };
}

/** 登录/注册成功后写入会话（只能在 Server Action / Route Handler 里调用） */
export async function startSession(userId: number): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(userId), cookieOptions());
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** 当前会话（未登录返回 null） */
export async function getSession(): Promise<{ uid: number } | null> {
  const store = await cookies();
  return readSessionToken(store.get(COOKIE_NAME)?.value);
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const session = await getSession();
  if (!session) return null;
  return findUserById(session.uid);
}

/** 后台页面守卫：未登录跳登录页；还没有管理员则先去初始化 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (user) return user;
  if ((await countUsers()) === 0) redirect("/setup");
  redirect("/admin/login");
}

/** 是否还没初始化（没有管理员） */
export async function isSetupRequired(): Promise<boolean> {
  return (await countUsers()) === 0;
}
