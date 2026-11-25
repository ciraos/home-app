"use server";

// =============================================================
// 🛠 后台 Server Actions：登录/退出/改密码 + 所有内容 CRUD
// 每个写操作都先 requireAdmin()，未登录会被重定向。
// =============================================================

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { publishContentUpdate } from "@/lib/content-events";
import {
  endSession,
  getCurrentUser,
  hashPassword,
  requireAdmin,
  startSession,
  verifyPassword,
} from "@/lib/auth";
import { countUsers, findUserByUsername, updateUserPassword } from "@/lib/repo";
import {
  createProject,
  createSocial,
  createStat,
  createTimelineItem,
  deleteProject,
  deleteSocial,
  deleteStat,
  deleteTimelineItem,
  getProject,
  getTimelineItem,
  updateProject,
  updateSettings,
  updateSocial,
  updateStat,
  updateTimelineItem,
} from "@/lib/repo";
import type { SocialIcon, StatKind } from "@/lib/types";
import { saveImage } from "@/lib/uploads";

// ---------- 小工具 ----------

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const int = (fd: FormData, key: string, fallback = 0) => {
  const value = Number.parseInt(String(fd.get(key) ?? ""), 10);
  return Number.isFinite(value) ? value : fallback;
};
const bool = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return value === "on" || value === "true" || value === "1";
};
// 内容变化：清 Next 缓存 + 通知所有在线页面软刷新
const refresh = () => {
  revalidatePath("/", "layout");
  publishContentUpdate();
};
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const STAT_KINDS: StatKind[] = ["articles", "sites", "coding", "coffee", "custom"];
const SOCIAL_ICONS: SocialIcon[] = ["github", "mail", "rss", "globe"];

// ---------- 登录 / 退出 ----------

export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const username = str(fd, "username");
  const password = String(fd.get("password") ?? "");

  if (!username || !password) return { error: "请输入用户名和密码" };
  if ((await countUsers()) === 0) return { error: "还没有管理员，请先完成初始化" };

  const user = await findUserByUsername(username);
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !ok) {
    await sleep(400);
    return { error: "用户名或密码错误" };
  }

  await startSession(user.id);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

export async function changePasswordAction(
  _prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const current = await getCurrentUser();
  if (!current) return { error: "登录已失效，请重新登录" };

  const oldPassword = String(fd.get("currentPassword") ?? "");
  const newPassword = String(fd.get("newPassword") ?? "");
  const confirm = String(fd.get("confirmPassword") ?? "");

  if (newPassword.length < 8) return { error: "新密码至少 8 位" };
  if (newPassword !== confirm) return { error: "两次输入的新密码不一致" };

  const user = await findUserByUsername(current.username);
  if (!user || !(await verifyPassword(oldPassword, user.passwordHash))) {
    await sleep(400);
    return { error: "当前密码不正确" };
  }

  await updateUserPassword(user.id, await hashPassword(newPassword));
  return { ok: "密码已更新" };
}

// ---------- 站点信息 ----------

export async function saveSettingsAction(fd: FormData): Promise<void> {
  await requireAdmin();

  let avatar = str(fd, "avatar");
  const file = fd.get("avatarFile");
  if (file instanceof File && file.size > 0) {
    avatar = await saveImage(file);
  }

  const year = int(fd, "codingStartYear", 2020);
  const currentYear = new Date().getFullYear();

  await updateSettings({
    name: str(fd, "name") || "未命名",
    role: str(fd, "role"),
    location: str(fd, "location"),
    email: str(fd, "email"),
    github: str(fd, "github"),
    avatar: avatar || "/avatar.avif",
    bio: str(fd, "bio"),
    siteUrl: str(fd, "siteUrl"),
    blogUrl: str(fd, "blogUrl"),
    description: str(fd, "description"),
    icp: str(fd, "icp"),
    icpUrl: str(fd, "icpUrl"),
    heroTitle: str(fd, "heroTitle"),
    heroSubtitle: str(fd, "heroSubtitle"),
    quote: str(fd, "quote"),
    codingStartYear: Math.min(Math.max(year, 1980), currentYear),
  });

  refresh();
  redirect("/admin/settings?saved=1");
}

// ---------- 统计 ----------

export async function createStatAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const kind = str(fd, "kind") as StatKind;
  await createStat({
    label: str(fd, "label") || "新统计",
    kind: STAT_KINDS.includes(kind) ? kind : "custom",
    value: str(fd, "value"),
    sort: int(fd, "sort", 100),
  });
  refresh();
  redirect("/admin/stats?saved=1");
}

export async function updateStatAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const kind = str(fd, "kind") as StatKind;
  await updateStat({
    id: int(fd, "id"),
    label: str(fd, "label") || "未命名",
    kind: STAT_KINDS.includes(kind) ? kind : "custom",
    value: str(fd, "value"),
    sort: int(fd, "sort", 100),
  });
  refresh();
  redirect("/admin/stats?saved=1");
}

export async function deleteStatAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await deleteStat(int(fd, "id"));
  refresh();
  redirect("/admin/stats?saved=1");
}

// ---------- 个人网站 ----------

function parseLinks(fd: FormData) {
  const labels = fd.getAll("linkLabel").map((v) => String(v).trim());
  const hrefs = fd.getAll("linkHref").map((v) => String(v).trim());
  return labels
    .map((label, index) => ({ label, href: hrefs[index] ?? "" }))
    .filter((link) => link.label !== "" && link.href !== "");
}

function parseTags(fd: FormData): string[] {
  return str(fd, "tags")
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function saveProjectAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const input = {
    name: str(fd, "name") || "未命名",
    description: str(fd, "description"),
    tags: parseTags(fd),
    links: parseLinks(fd),
    sort: int(fd, "sort", 100),
  };

  if (id > 0 && (await getProject(id))) {
    await updateProject({ id, ...input });
  } else {
    await createProject(input);
  }

  refresh();
  redirect("/admin/projects?saved=1");
}

export async function deleteProjectAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await deleteProject(int(fd, "id"));
  refresh();
  redirect("/admin/projects?saved=1");
}

// ---------- 成长足迹 ----------

export async function saveTimelineAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = int(fd, "id", 0);
  const input = {
    date: str(fd, "date"),
    title: str(fd, "title") || "未命名",
    description: str(fd, "description"),
    sort: int(fd, "sort", 100),
  };

  if (id > 0 && (await getTimelineItem(id))) {
    await updateTimelineItem({ id, ...input });
  } else {
    await createTimelineItem(input);
  }

  refresh();
  redirect("/admin/timeline?saved=1");
}

export async function deleteTimelineAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await deleteTimelineItem(int(fd, "id"));
  refresh();
  redirect("/admin/timeline?saved=1");
}

// ---------- 联系方式 ----------

export async function createSocialAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const icon = str(fd, "icon") as SocialIcon;
  await createSocial({
    label: str(fd, "label") || "新链接",
    href: str(fd, "href"),
    icon: SOCIAL_ICONS.includes(icon) ? icon : "globe",
    external: bool(fd, "external"),
    sort: int(fd, "sort", 100),
  });
  refresh();
  redirect("/admin/socials?saved=1");
}

export async function updateSocialAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const icon = str(fd, "icon") as SocialIcon;
  await updateSocial({
    id: int(fd, "id"),
    label: str(fd, "label") || "未命名",
    href: str(fd, "href"),
    icon: SOCIAL_ICONS.includes(icon) ? icon : "globe",
    external: bool(fd, "external"),
    sort: int(fd, "sort", 100),
  });
  refresh();
  redirect("/admin/socials?saved=1");
}

export async function deleteSocialAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await deleteSocial(int(fd, "id"));
  refresh();
  redirect("/admin/socials?saved=1");
}
