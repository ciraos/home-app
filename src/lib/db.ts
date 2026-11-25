// =============================================================
// 🗄 数据库连接 + 建表 + 首次种子数据
//
// 支持两种连接（都由 DATABASE_URL 决定）：
//   postgres://user:pass@host:5432/db  → 真实 PostgreSQL（生产）
//   pglite://./data/pg                 → PGlite（WASM PostgreSQL，本地零依赖）
// 两者 SQL 完全一致，只有驱动不同。
// =============================================================

import { mkdir } from "node:fs/promises";
import path from "node:path";

import { Pool } from "pg";
import {
  defaultProjects,
  defaultSettings,
  defaultSocials,
  defaultStats,
  defaultTimeline,
} from "@/lib/defaults";

export type DbQuery = <T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
) => Promise<T[]>;

interface Db {
  query: DbQuery;
  transaction: <T>(fn: (query: DbQuery) => Promise<T>) => Promise<T>;
}

/** 全局缓存：开发环境热更新时不重复建连接/建表 */
const globalForDb = globalThis as unknown as {
  __homeDb?: Promise<Db>;
  __homeSchema?: Promise<void>;
};

async function createPg(url: string): Promise<Db> {
  // 只认 DATABASE_URL 这一行连接串；SSL 等参数写在 URL 里（?sslmode=require）
  const pool = new Pool({
    connectionString: url,
    max: 5,
    connectionTimeoutMillis: 5_000,
  });

  const query: DbQuery = async (sql, params) => {
    const result = await pool.query(sql, params as never[]);
    return result.rows;
  };

  return {
    query,
    transaction: async (fn) => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await fn(async (sql, params) => {
          const r = await client.query(sql, params as never[]);
          return r.rows;
        });
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        throw error;
      } finally {
        client.release();
      }
    },
  };
}

async function createPglite(url: string): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite");
  // pglite://./data/pg → ./data/pg；pglite:///abs/path → /abs/path
  const target = url.replace(/^pglite:(\/\/)?/, "") || "./data/pg";
  // turbopackIgnore：避免动态路径触发整个项目被纳入 standalone 追踪
  const dataDir = path.resolve(/* turbopackIgnore: true */ process.cwd(), target);

  // PGlite 不会自动创建父目录
  await mkdir(dataDir, { recursive: true });
  const client = new PGlite(dataDir);

  const query: DbQuery = async (sql, params) => {
    const result = await client.query(sql, params as never[]);
    return result.rows as never[];
  };

  return {
    query,
    transaction: async (fn) => {
      await client.exec("BEGIN");
      try {
        const result = await fn(query);
        await client.exec("COMMIT");
        return result;
      } catch (error) {
        await client.exec("ROLLBACK").catch(() => {});
        throw error;
      }
    },
  };
}

export function getDb(): Promise<Db> {
  if (!globalForDb.__homeDb) {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) {
      return Promise.reject(new Error("缺少 DATABASE_URL，请参考 .env.example 配置"));
    }

    // 只有 pglite:// 且不带 user@host 的才算本地 PGlite 路径
    const isPglite = url.startsWith("pglite:") && !url.includes("@");
    if (!isPglite && !/^postgres(ql)?:\/\//.test(url)) {
      return Promise.reject(
        new Error("DATABASE_URL 需要 postgresql:// 或 pglite:// 前缀")
      );
    }

    globalForDb.__homeDb = (isPglite ? createPglite(url) : createPg(url)).catch((error) => {
      delete globalForDb.__homeDb;
      throw error;
    });
  }
  return globalForDb.__homeDb;
}

const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    id integer PRIMARY KEY CHECK (id = 1),
    name text NOT NULL,
    role text NOT NULL,
    location text NOT NULL,
    email text NOT NULL,
    github text NOT NULL,
    avatar text NOT NULL,
    bio text NOT NULL,
    site_url text NOT NULL,
    blog_url text NOT NULL,
    description text NOT NULL,
    icp text NOT NULL,
    icp_url text NOT NULL,
    hero_title text NOT NULL,
    hero_subtitle text NOT NULL,
    quote text NOT NULL DEFAULT '',
    coding_start_year integer NOT NULL DEFAULT 2020,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  // 老库补列：首页那句话改成数据库字段
  `ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS quote text NOT NULL DEFAULT ''`,
  `CREATE TABLE IF NOT EXISTS stats (
    id serial PRIMARY KEY,
    label text NOT NULL,
    kind text NOT NULL DEFAULT 'custom',
    value text NOT NULL DEFAULT '',
    sort integer NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id serial PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    tags text[] NOT NULL DEFAULT '{}',
    links jsonb NOT NULL DEFAULT '[]'::jsonb,
    sort integer NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS timeline (
    id serial PRIMARY KEY,
    date text NOT NULL DEFAULT '',
    title text NOT NULL,
    description text NOT NULL,
    sort integer NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS socials (
    id serial PRIMARY KEY,
    label text NOT NULL,
    href text NOT NULL,
    icon text NOT NULL DEFAULT 'globe',
    external boolean NOT NULL DEFAULT false,
    sort integer NOT NULL DEFAULT 0
  )`,
];

async function countOf(query: DbQuery, table: string): Promise<number> {
  const rows = await query<{ n: number }>(`SELECT COUNT(*)::int AS n FROM ${table}`);
  return rows[0]?.n ?? 0;
}

async function seed(query: DbQuery): Promise<void> {
  if ((await countOf(query, "site_settings")) === 0) {
    const s = defaultSettings;
    await query(
      `INSERT INTO site_settings
        (id, name, role, location, email, github, avatar, bio, site_url, blog_url,
         description, icp, icp_url, hero_title, hero_subtitle, quote, coding_start_year)
       VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        s.name,
        s.role,
        s.location,
        s.email,
        s.github,
        s.avatar,
        s.bio,
        s.siteUrl,
        s.blogUrl,
        s.description,
        s.icp,
        s.icpUrl,
        s.heroTitle,
        s.heroSubtitle,
        s.quote,
        s.codingStartYear,
      ]
    );
  }

  if ((await countOf(query, "stats")) === 0) {
    for (const item of defaultStats) {
      await query("INSERT INTO stats (label, kind, value, sort) VALUES ($1,$2,$3,$4)", [
        item.label,
        item.kind,
        item.value,
        item.sort,
      ]);
    }
  }

  if ((await countOf(query, "projects")) === 0) {
    for (const item of defaultProjects) {
      await query(
        "INSERT INTO projects (name, description, tags, links, sort) VALUES ($1,$2,$3,$4::jsonb,$5)",
        [item.name, item.description, item.tags, JSON.stringify(item.links), item.sort]
      );
    }
  }

  if ((await countOf(query, "timeline")) === 0) {
    for (const item of defaultTimeline) {
      await query(
        "INSERT INTO timeline (date, title, description, sort) VALUES ($1,$2,$3,$4)",
        [item.date, item.title, item.description, item.sort]
      );
    }
  }

  if ((await countOf(query, "socials")) === 0) {
    for (const item of defaultSocials) {
      await query(
        "INSERT INTO socials (label, href, icon, external, sort) VALUES ($1,$2,$3,$4,$5)",
        [item.label, item.href, item.icon, item.external, item.sort]
      );
    }
  }
}

async function init(): Promise<void> {
  const db = await getDb();
  for (const sql of SCHEMA_SQL) {
    await db.query(sql);
  }
  await db.transaction(seed);
  // 老库补列后是空字符串，用默认那句话填上
  await db.query("UPDATE site_settings SET quote = $1 WHERE id = 1 AND quote = ''", [
    defaultSettings.quote,
  ]);
}

/** 建表 + 首次写入默认内容；每个进程只执行一次 */
export function ensureDb(): Promise<void> {
  if (!globalForDb.__homeSchema) {
    globalForDb.__homeSchema = init().catch((error) => {
      delete globalForDb.__homeSchema;
      throw error;
    });
  }
  return globalForDb.__homeSchema;
}
