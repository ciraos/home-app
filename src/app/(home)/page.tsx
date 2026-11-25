import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
} from "lucide-react";

import { GithubIcon } from "@/components/icons";
import { SocialIcon } from "@/components/social-icon";
import { getArticles } from "@/lib/articles";
import { loadSettings, loadSite } from "@/lib/site-content";
import type { Stat } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await loadSettings();
  return {
    title: { absolute: `${settings.name}的主页` },
    description: settings.description,
    alternates: { canonical: settings.siteUrl || "/" },
  };
}

/** 区块：编号 + 宋体标题 + 细线，页面靠这条线分区 */
function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <header className="mb-8 flex items-baseline gap-4 border-b border-border pb-4">
        <span className="font-mono text-[11px] text-muted-foreground">{index}</span>
        <h2 className="font-serif text-2xl tracking-wide text-foreground">{title}</h2>
      </header>
      {children}
    </section>
  );
}

/** 统计项数值：自动项按当前数据算，固定项直接显示 */
function statDisplay(
  stat: Stat,
  ctx: { articles?: number; sites: number; years: number }
): string {
  switch (stat.kind) {
    case "articles":
      return ctx.articles === undefined ? "—" : String(ctx.articles);
    case "sites":
      return String(ctx.sites);
    case "coding":
      return `${Math.max(0, ctx.years)}年`;
    default:
      return stat.value || "—";
  }
}

export default async function Home() {
  const [
    { settings, stats, projects, timeline, socials },
    { articles: recentArticles, count: articleCount },
  ] = await Promise.all([loadSite(), getArticles()]);

  const years = new Date().getFullYear() - settings.codingStartYear;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-16 pb-24 sm:pt-20">
      <div className="flex flex-col gap-20 sm:gap-24">
        {/* 关于我 */}
        <Section id="about" index="01" title="关于我">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] text-muted-foreground">
                {settings.role} · {settings.location}
              </p>
              <p className="mt-4 max-w-[38rem] text-[15px] leading-7 text-foreground/85">
                {settings.bio}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted-foreground">
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 transition-colors duration-150 hover:text-foreground"
                >
                  <Mail className="size-4" strokeWidth={1.5} />
                  {settings.email}
                </a>
                <a
                  href={settings.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition-colors duration-150 hover:text-foreground"
                >
                  <GithubIcon className="size-4" />
                  GitHub
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" strokeWidth={1.5} />
                  {settings.location}
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-px self-start border border-border bg-border">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-background p-5">
                  <dd className="font-serif text-3xl tabular-nums text-foreground">
                    {statDisplay(stat, {
                      articles: articleCount,
                      sites: projects.length,
                      years,
                    })}
                  </dd>
                  <dt className="mt-1 text-xs text-muted-foreground">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        {/* 技术栈 */}
        <Section id="skills" index="02" title="技术栈">
          <blockquote className="border-l-2 border-primary pl-6 sm:pl-8">
            <p className="max-w-[30rem] font-serif text-2xl leading-snug text-foreground sm:text-[1.75rem]">
              骗你的，啥都不会，全靠 AI
            </p>
            <footer className="mt-4 font-mono text-[11px] text-muted-foreground">
              —— {settings.name}
            </footer>
          </blockquote>
        </Section>

        {/* 最近文章 */}
        <Section id="posts" index="03" title="最近文章">
          {recentArticles.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无文章，稍后再来看看</p>
          ) : (
            <div className="flex flex-col">
              {recentArticles.map((post) => (
                <Link
                  key={post.id}
                  href={`${settings.blogUrl}/posts`}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-1.5 border-b border-border py-5 transition-colors duration-150 first:border-t sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
                >
                  <span className="font-mono text-[11px] text-muted-foreground">{post.date}</span>
                  <h3 className="font-serif text-lg text-foreground transition-colors duration-150 group-hover:text-primary">
                    {post.title}
                  </h3>
                  {post.tag ? (
                    <span className="text-xs text-muted-foreground">{post.tag}</span>
                  ) : null}
                </Link>
              ))}
            </div>
          )}

          <Link
            href={`${settings.blogUrl}/posts`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-foreground transition-colors duration-150 hover:text-primary"
          >
            查看全部文章
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </Link>
        </Section>

        {/* 个人网站 */}
        <Section id="projects" index="04" title="个人网站">
          <div className="grid gap-x-12 sm:grid-cols-2">
            {projects.map((project) => {
              // 只有一个链接时，整个条目都是可点击区域，而不是只点右上角小箭头
              const singleLink = project.links.length === 1 ? project.links[0] : null;

              const body = (
                <>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3
                      className={`font-serif text-lg text-foreground transition-colors duration-150 ${
                        singleLink ? "group-hover:text-primary" : ""
                      }`}
                    >
                      {project.name}
                    </h3>
                    {singleLink ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors duration-150 group-hover:text-primary">
                        {singleLink.label}
                        <ArrowUpRight className="size-4" strokeWidth={1.5} />
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                    {project.tags.join(" / ")}
                  </p>

                  {project.links.length > 1 ? (
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                      {project.links.map((link) => (
                        <a
                          key={`${link.label}-${link.href}`}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 py-1 text-sm text-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary"
                        >
                          {link.label}
                          <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </>
              );

              return singleLink ? (
                <a
                  key={project.id}
                  href={singleLink.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.name} · ${singleLink.label}（新窗口打开）`}
                  className="group block border-b border-border py-6"
                >
                  {body}
                </a>
              ) : (
                <article key={project.id} className="border-b border-border py-6">
                  {body}
                </article>
              );
            })}
          </div>
        </Section>

        {/* 成长足迹 */}
        <Section id="timeline" index="05" title="成长足迹">
          <ol className="flex flex-col">
            {timeline.map((item, index) => (
              <li
                key={item.id}
                className="grid gap-2 border-b border-border py-5 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-8"
              >
                <span className="font-mono text-[11px] text-muted-foreground">
                  {item.date || String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* 联系我 */}
        <Section id="contact" index="06" title="联系我">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-serif text-2xl text-foreground">欢迎交流</p>
              <p className="mt-2 text-sm text-muted-foreground">
                有问题或合作想法，发邮件最快。
              </p>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target={social.external ? "_blank" : undefined}
                  rel={social.external ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  <SocialIcon name={social.icon} className="size-4" />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
