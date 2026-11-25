// =============================================================
// 🧩 内容模型：数据库行与首页/后台共用的类型
// =============================================================

/** 站点与个人资料（单行表 site_settings） */
export interface Settings {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  avatar: string;
  bio: string;
  siteUrl: string;
  blogUrl: string;
  description: string;
  icp: string;
  icpUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  /** 首页大标题下方的一句话 */
  quote: string;
  codingStartYear: number;
}

/** 统计项的数值来源 */
export type StatKind = "articles" | "sites" | "coding" | "coffee" | "custom";

export interface Stat {
  id: number;
  label: string;
  kind: StatKind;
  value: string;
  sort: number;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  sort: number;
}

export interface TimelineItem {
  id: number;
  date: string;
  title: string;
  description: string;
  sort: number;
}

export type SocialIcon = "github" | "mail" | "rss" | "globe";

export interface Social {
  id: number;
  label: string;
  href: string;
  icon: SocialIcon;
  external: boolean;
  sort: number;
}

export interface AdminUser {
  id: number;
  username: string;
}
