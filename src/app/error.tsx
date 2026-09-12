"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * 路由段页面错误边界（客户端组件）。
 * 当 `(home)` 下的页面渲染抛错时显示此兜底 UI。
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // 将错误上报或打印，便于排查
    console.error("页面渲染出错:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center px-5 py-16">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="size-8 text-destructive" />
        </span>

        <p className="mt-6 text-2xl font-bold text-foreground">啊哦，出错了</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          页面加载时出了点小问题，可能是网络波动，稍后重试一下就好。
        </p>

        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <RefreshCw className="size-4" />
          再试一次
        </button>
      </div>
    </div>
  );
}
