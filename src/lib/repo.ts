// =============================================================
// 📚 数据访问：内容读取/写入 + 管理员账号
// 这里直接抛错，由调用方决定是兜底（首页）还是报错（后台）。
// =============================================================

import { ensureDb, getDb } from "@/lib/db";
import type {
  AdminUser,
  Project,
  ProjectLink,
  Settings,
  Social,
  SocialIcon,
  Stat,
  StatKind,
  TimelineItem,
} from "@/lib/types";

interface SettingsRow {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  avatar: string;
  bio: string;
  site_url: string;
  blog_url: string;
  description: string;
  icp: string;
  icp_url: string;
  hero_title: string;
  hero_subtitle: string;
  quote: string;
  coding_start_year: number;
}

interface ProjectRow {
  id: number;
  name: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  sort: number;
}

interface TimelineRow {
  id: number;
  date: string;
  title: string;
  description: string;
  sort: number;
}

interface SocialRow {
  id: number;
  label: string;
  href: string;
  icon: string;
  external: boolean;
  sort: number;
}

interface StatRow {
  id: number;
  label: string;
  kind: string;
  value: string;
  sort: number;
}

// ---------- 站点设置 ----------

export async function getSettings(): Promise<Settings> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<SettingsRow>("SELECT * FROM site_settings WHERE id = 1");
  const row = rows[0];
  if (!row) throw new Error("site_settings 为空");
  return {
    name: row.name,
    role: row.role,
    location: row.location,
    email: row.email,
    github: row.github,
    avatar: row.avatar,
    bio: row.bio,
    siteUrl: row.site_url,
    blogUrl: row.blog_url,
    description: row.description,
    icp: row.icp,
    icpUrl: row.icp_url,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    quote: row.quote,
    codingStartYear: row.coding_start_year,
  };
}

export async function updateSettings(input: Settings): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query(
    `UPDATE site_settings SET
      name=$1, role=$2, location=$3, email=$4, github=$5, avatar=$6, bio=$7,
      site_url=$8, blog_url=$9, description=$10, icp=$11, icp_url=$12,
      hero_title=$13, hero_subtitle=$14, quote=$15, coding_start_year=$16,
      updated_at=now()
     WHERE id = 1`,
    [
      input.name,
      input.role,
      input.location,
      input.email,
      input.github,
      input.avatar,
      input.bio,
      input.siteUrl,
      input.blogUrl,
      input.description,
      input.icp,
      input.icpUrl,
      input.heroTitle,
      input.heroSubtitle,
      input.quote,
      input.codingStartYear,
    ]
  );
}

// ---------- 统计 ----------

export async function getStats(): Promise<Stat[]> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<StatRow>("SELECT * FROM stats ORDER BY sort ASC, id ASC");
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    kind: (row.kind as StatKind) ?? "custom",
    value: row.value,
    sort: row.sort,
  }));
}

export async function createStat(input: Omit<Stat, "id">): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query("INSERT INTO stats (label, kind, value, sort) VALUES ($1,$2,$3,$4)", [
    input.label,
    input.kind,
    input.value,
    input.sort,
  ]);
}

export async function updateStat(stat: Stat): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query("UPDATE stats SET label=$1, kind=$2, value=$3, sort=$4 WHERE id=$5", [
    stat.label,
    stat.kind,
    stat.value,
    stat.sort,
    stat.id,
  ]);
}

export async function deleteStat(id: number): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query("DELETE FROM stats WHERE id=$1", [id]);
}

// ---------- 个人网站 ----------

export async function getProjects(): Promise<Project[]> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<ProjectRow>("SELECT * FROM projects ORDER BY sort ASC, id ASC");
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    tags: row.tags ?? [],
    links: row.links ?? [],
    sort: row.sort,
  }));
}

export async function getProject(id: number): Promise<Project | null> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<ProjectRow>("SELECT * FROM projects WHERE id=$1", [id]);
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    tags: row.tags ?? [],
    links: row.links ?? [],
    sort: row.sort,
  };
}

export async function createProject(input: Omit<Project, "id">): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query(
    "INSERT INTO projects (name, description, tags, links, sort) VALUES ($1,$2,$3,$4::jsonb,$5)",
    [input.name, input.description, input.tags, JSON.stringify(input.links), input.sort]
  );
}

export async function updateProject(project: Project): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query(
    "UPDATE projects SET name=$1, description=$2, tags=$3, links=$4::jsonb, sort=$5 WHERE id=$6",
    [
      project.name,
      project.description,
      project.tags,
      JSON.stringify(project.links),
      project.sort,
      project.id,
    ]
  );
}

export async function deleteProject(id: number): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query("DELETE FROM projects WHERE id=$1", [id]);
}

// ---------- 成长足迹 ----------

export async function getTimeline(): Promise<TimelineItem[]> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<TimelineRow>("SELECT * FROM timeline ORDER BY sort ASC, id ASC");
  return rows.map((row) => ({
    id: row.id,
    date: row.date,
    title: row.title,
    description: row.description,
    sort: row.sort,
  }));
}

export async function getTimelineItem(id: number): Promise<TimelineItem | null> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<TimelineRow>("SELECT * FROM timeline WHERE id=$1", [id]);
  const row = rows[0];
  return row
    ? {
        id: row.id,
        date: row.date,
        title: row.title,
        description: row.description,
        sort: row.sort,
      }
    : null;
}

export async function createTimelineItem(input: Omit<TimelineItem, "id">): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query("INSERT INTO timeline (date, title, description, sort) VALUES ($1,$2,$3,$4)", [
    input.date,
    input.title,
    input.description,
    input.sort,
  ]);
}

export async function updateTimelineItem(item: TimelineItem): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query("UPDATE timeline SET date=$1, title=$2, description=$3, sort=$4 WHERE id=$5", [
    item.date,
    item.title,
    item.description,
    item.sort,
    item.id,
  ]);
}

export async function deleteTimelineItem(id: number): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query("DELETE FROM timeline WHERE id=$1", [id]);
}

// ---------- 联系方式 ----------

export async function getSocials(): Promise<Social[]> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<SocialRow>("SELECT * FROM socials ORDER BY sort ASC, id ASC");
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    href: row.href,
    icon: (row.icon as SocialIcon) ?? "globe",
    external: row.external,
    sort: row.sort,
  }));
}

export async function createSocial(input: Omit<Social, "id">): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query(
    "INSERT INTO socials (label, href, icon, external, sort) VALUES ($1,$2,$3,$4,$5)",
    [input.label, input.href, input.icon, input.external, input.sort]
  );
}

export async function updateSocial(social: Social): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query(
    "UPDATE socials SET label=$1, href=$2, icon=$3, external=$4, sort=$5 WHERE id=$6",
    [social.label, social.href, social.icon, social.external, social.sort, social.id]
  );
}

export async function deleteSocial(id: number): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query("DELETE FROM socials WHERE id=$1", [id]);
}

// ---------- 管理员 ----------

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
}

export async function countUsers(): Promise<number> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<{ n: number }>("SELECT COUNT(*)::int AS n FROM users");
  return rows[0]?.n ?? 0;
}

export async function findUserByUsername(
  username: string
): Promise<{ id: number; username: string; passwordHash: string } | null> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<UserRow>("SELECT * FROM users WHERE username=$1", [username]);
  const row = rows[0];
  return row ? { id: row.id, username: row.username, passwordHash: row.password_hash } : null;
}

export async function findUserById(id: number): Promise<AdminUser | null> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<{ id: number; username: string }>(
    "SELECT id, username FROM users WHERE id=$1",
    [id]
  );
  return rows[0] ?? null;
}

/**
 * 创建第一个管理员：只有 users 表为空时才会插入。
 * 返回新用户 id；已有用户时返回 null（并发下也只有一个人能成功）。
 */
export async function createFirstAdmin(username: string, passwordHash: string): Promise<number | null> {
  await ensureDb();
  const db = await getDb();
  const rows = await db.query<{ id: number }>(
    `INSERT INTO users (username, password_hash)
     SELECT $1, $2
     WHERE NOT EXISTS (SELECT 1 FROM users)
     RETURNING id`,
    [username, passwordHash]
  );
  return rows[0]?.id ?? null;
}

export async function updateUserPassword(id: number, passwordHash: string): Promise<void> {
  await ensureDb();
  const db = await getDb();
  await db.query("UPDATE users SET password_hash=$1 WHERE id=$2", [passwordHash, id]);
}
