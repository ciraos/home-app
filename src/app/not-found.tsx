import type { Metadata } from "next";
import Link from "next/link";
import { Home as HomeIcon, SearchX } from "lucide-react";

// 样式与主题变量由根布局（src/app/layout.tsx）统一加载

export const metadata: Metadata = {
  title: "404 · 页面走丢了",
  description: "你访问的页面不存在，可能被移动、删除或根本没有存在过。",
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-gradient-to-b from-background to-muted/40 px-5 py-16">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        {/* 大号 404 */}
        <div
          aria-hidden="true"
          className="select-none bg-gradient-to-br from-primary via-primary/70 to-primary/20 bg-clip-text text-[7rem] font-extrabold leading-none text-transparent sm:text-[10rem]"
        >
          404
        </div>

        {/* 走丢的说明 */}
        <p className="mt-2 text-2xl font-bold text-foreground">
          咦？这条路走不通呀
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-sm leading-relaxed text-muted-foreground">
          <SearchX className="size-4 shrink-0" />
          你访问的页面不存在，它可能被移走、删除，或者根本没存在过。
        </p>

        {/* 回到首页 */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <HomeIcon className="size-4" />
          回到首页
        </Link>

        <span className="mt-6 text-xs text-muted-foreground/70">
          米葱苓 · 404
        </span>
      </div>
    </main>
  );
}
