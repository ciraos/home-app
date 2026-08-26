// =============================================================
// 🎛 手动主题覆盖标记（仅客户端使用）
// 用户手动切换主题后，当天不再被「日出日落自动切换」覆盖；
// 第二天自动切换会恢复生效。
// =============================================================

const KEY = "theme-auto-override-date";

/** 今天用户是否手动指定过主题 */
export function isThemeOverriddenToday(now = new Date()): boolean {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return false;
    const d = new Date(stored);
    return !Number.isNaN(d.getTime()) && d.toDateString() === now.toDateString();
  } catch {
    return false;
  }
}

/** 记录今天用户手动切换过主题 */
export function markThemeOverriddenToday(now = new Date()) {
  try {
    localStorage.setItem(KEY, now.toISOString());
  } catch {
    /* localStorage 不可用时静默失败，仅影响手动覆盖标记 */
  }
}
