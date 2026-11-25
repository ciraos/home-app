import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SetupForm } from "@/components/admin/setup-form";
import { isSetupRequired } from "@/lib/auth";
import { loadSettings } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "初始化站点",
  robots: { index: false, follow: false },
};

export default async function SetupPage() {
  // 已经有管理员：初始化入口彻底关闭
  if (!(await isSetupRequired())) redirect("/admin/login");

  const settings = await loadSettings();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">SETUP</p>
          <h1 className="mt-2 font-serif text-2xl font-bold">{settings.name} · 初始化</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            这是站点第一次启动。创建管理员后，所有内容都可以在后台编辑，
            <br className="hidden sm:block" />
            并且不再开放任何注册入口。
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <SetupForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          已经有账号？
          <Link href="/admin/login" className="ml-1 text-primary hover:underline">
            直接登录
          </Link>
        </p>
      </div>
    </main>
  );
}
