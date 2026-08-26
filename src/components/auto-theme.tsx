"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { getDayTheme, getNextTransitionMs } from "@/lib/sun";
import { isThemeOverriddenToday } from "@/lib/theme-override";

/**
 * 根据本地日出/日落时间自动切换深浅色主题：
 * - 白天 → 浅色，夜晚 → 深色；
 * - 在日出/日落时刻精确切换，并以 60s 间隔兜底（覆盖跨天、时区变化等边界情况）；
 * - 用户当天手动切换过主题（右下角按钮 / 顶栏下拉）则当天暂停自动切换，次日恢复。
 */
export function AutoTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const apply = () => {
      if (isThemeOverriddenToday()) return;
      const next = getDayTheme();
      if (next !== themeRef.current) setTheme(next);
      scheduleNext();
    };

    const scheduleNext = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // setTimeout 上限约 24.8 天，取较小值
      timeoutId = setTimeout(apply, Math.min(getNextTransitionMs(), 2_147_000_000));
    };

    // 60s 兜底轮询：处理跨天、手动覆盖标记过期等边界
    const intervalId = setInterval(() => {
      if (isThemeOverriddenToday()) return;
      const next = getDayTheme();
      if (next !== themeRef.current) setTheme(next);
    }, 60_000);

    // 页面重新可见时立即校准
    const onVisible = () => {
      if (!document.hidden) {
        if (isThemeOverriddenToday()) return;
        const next = getDayTheme();
        if (next !== themeRef.current) setTheme(next);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    apply();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [setTheme]);

  return null;
}
