import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getCurrentUser, isSetupRequired } from "@/lib/auth";
import { loadSettings } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "登录后台",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isSetupRequired()) redirect("/setup");
  if (await getCurrentUser()) redirect("/admin");

  const settings = await loadSettings();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-bold">{settings.name} · 后台</h1>
          <p className="mt-2 text-sm text-muted-foreground">登录后可以编辑站点的全部内容</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">
            ← 返回首页
          </Link>
        </p>
      </div>
    </main>
  );
}
