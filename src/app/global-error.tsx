"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import "./globals.css";

/**
 * 全局错误边界（客户端组件）。
 * 当根布局或任意页面渲染抛错时显示；会替换根布局，因此必须自带 <html>/<body>。
 * 错误边界内不支持 metadata，改用 React <title>。
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("全局渲染出错:", error);
  }, [error]);

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <title>出错了 · 米葱苓的主页</title>
        <main className="flex min-h-dvh w-full items-center justify-center bg-gradient-to-b from-background to-muted/40 px-5">
          <div className="flex w-full max-w-md flex-col items-center text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertTriangle className="size-8 text-destructive" />
            </span>

            <p className="mt-6 text-2xl font-bold">啊哦，出错了</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              抱歉，页面的渲染出了点问题，请稍后刷新或重试。
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
        </main>
      </body>
    </html>
  );
}
