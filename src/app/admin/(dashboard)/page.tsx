import Link from "next/link";

import { getProjects, getSocials, getStats, getTimeline } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [projects, timeline, socials, stats] = await Promise.all([
    getProjects(),
    getTimeline(),
    getSocials(),
    getStats(),
  ]);

  const cards = [
    { href: "/admin/settings", title: "站点信息", desc: "名字、简介、头像、域名、备案号", meta: "基础资料" },
    { href: "/admin/stats", title: "数据统计", desc: "文章 / 网站 / 码龄 / 自定义", meta: `${stats.length} 项` },
    { href: "/admin/projects", title: "个人网站", desc: "项目卡片、标签、外链", meta: `${projects.length} 个` },
    { href: "/admin/timeline", title: "成长足迹", desc: "时间线条目", meta: `${timeline.length} 条` },
    { href: "/admin/socials", title: "联系方式", desc: "GitHub、邮箱、RSS 等", meta: `${socials.length} 个` },
    { href: "/admin/account", title: "账号安全", desc: "修改登录密码", meta: "管理员" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">概览</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          站点内容都来自数据库，修改后前台立即生效（首页为动态渲染）。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors duration-150 hover:border-primary/40"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold group-hover:text-primary">{card.title}</h2>
              <span className="shrink-0 text-xs text-muted-foreground">{card.meta}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">关于「最近文章」</p>
        <p className="mt-1">
          文章列表仍然读取博客接口（
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_ARTICLES_API_URL</code>
          ），不在这个后台维护。其它所有首页内容都可以在左侧编辑。
        </p>
      </div>
    </div>
  );
}
