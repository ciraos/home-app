"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * 订阅后台的内容变更：收到 SSE update 后软刷新当前路由，
 * 已打开的首页不用手动刷新就能看到新内容。
 */
export function LiveRefresh() {
  const router = useRouter();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // 合并短时间内的多次通知，避免连续保存时重复刷新
    const scheduleRefresh = () => {
      if (timer.current !== null) return;
      timer.current = window.setTimeout(() => {
        timer.current = null;
        router.refresh();
      }, 120);
    };

    const source = new EventSource("/api/events");
    const onUpdate = () => scheduleRefresh();
    source.addEventListener("update", onUpdate);

    // 标签页重新可见时兜底校准（比如休眠期间断开了 SSE）
    const onVisible = () => {
      if (!document.hidden) scheduleRefresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      source.removeEventListener("update", onUpdate);
      source.close();
      document.removeEventListener("visibilitychange", onVisible);
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [router]);

  return null;
}
