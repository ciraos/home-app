import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";
import { loadSettings } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "后台",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  const settings = await loadSettings();

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
          <Link href="/admin" className="shrink-0 text-sm font-semibold">
            {settings.name} · 后台
          </Link>
          <AdminNav />
          <div className="flex shrink-0 items-center gap-3 text-sm">
            <Link href="/" target="_blank" className="text-muted-foreground hover:text-primary">
              查看首页 ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                退出
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto w-full max-w-4xl px-5 pb-2 text-xs text-muted-foreground">
          已登录：{user.username}
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-8">{children}</main>
    </div>
  );
}
