"use server";

// =============================================================
// 🚀 首次初始化：创建唯一管理员
// 只有 users 表为空时才能成功，之后此入口自动失效。
// =============================================================

import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { hashPassword, startSession } from "@/lib/auth";
import { countUsers, createFirstAdmin } from "@/lib/repo";

export async function setupAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const username = String(fd.get("username") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirmPassword") ?? "");

  if (username.length < 2 || username.length > 32) {
    return { error: "用户名需要 2–32 个字符" };
  }
  if (!/^[\w\u4e00-\u9fa5.-]+$/.test(username)) {
    return { error: "用户名只能包含中英文、数字、下划线、点和横线" };
  }
  if (password.length < 8) {
    return { error: "密码至少 8 位" };
  }
  if (password !== confirm) {
    return { error: "两次输入的密码不一致" };
  }

  if ((await countUsers()) > 0) {
    return { error: "站点已经初始化过了，请直接登录" };
  }

  const id = await createFirstAdmin(username, await hashPassword(password));
  if (!id) {
    return { error: "管理员已存在，请直接登录" };
  }

  await startSession(id);
  redirect("/admin");
}
