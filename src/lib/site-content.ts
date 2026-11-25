// =============================================================
// 🌐 前台内容加载：读库失败时回落到默认内容，保证首页不白屏
// =============================================================

import {
  defaultProjects,
  defaultSettings,
  defaultSocials,
  defaultStats,
  defaultTimeline,
} from "@/lib/defaults";
import { getProjects, getSettings, getSocials, getStats, getTimeline } from "@/lib/repo";
import type { Project, Settings, Social, Stat, TimelineItem } from "@/lib/types";

export interface SiteData {
  settings: Settings;
  stats: Stat[];
  projects: Project[];
  timeline: TimelineItem[];
  socials: Social[];
}

function withIds<T>(items: T[]): (T & { id: number })[] {
  return items.map((item, index) => ({ ...item, id: index + 1 }));
}

const fallback: SiteData = {
  settings: defaultSettings,
  stats: withIds(defaultStats),
  projects: withIds(defaultProjects),
  timeline: withIds(defaultTimeline),
  socials: withIds(defaultSocials),
};

export async function loadSite(): Promise<SiteData> {
  try {
    const [settings, stats, projects, timeline, socials] = await Promise.all([
      getSettings(),
      getStats(),
      getProjects(),
      getTimeline(),
      getSocials(),
    ]);
    return { settings, stats, projects, timeline, socials };
  } catch (error) {
    console.error("读取站点内容失败，使用默认内容:", error);
    return fallback;
  }
}

/** 只取站点设置（metadata、robots、sitemap 用），失败时用默认值 */
export async function loadSettings(): Promise<Settings> {
  try {
    return await getSettings();
  } catch (error) {
    console.error("读取站点设置失败，使用默认值:", error);
    return defaultSettings;
  }
}
