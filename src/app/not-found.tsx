import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { loadSettings } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "404 · 页面走丢了",
  description: "你访问的页面不存在，可能被移动、删除或根本没有存在过。",
};

export default async function NotFound() {
  const settings = await loadSettings();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-20">
      <div className="w-full max-w-md">
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">404</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground">
          这条路走不通
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          页面不存在，可能被移走、删除，或者根本没存在过。
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm text-foreground transition-colors duration-150 hover:border-primary hover:text-primary"
        >
          回到首页
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </Link>

        <p className="mt-20 font-mono text-[11px] text-muted-foreground">
          {settings.name} · 404
        </p>
      </div>
    </main>
  );
}
