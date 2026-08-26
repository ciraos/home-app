import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  BookMarked,
  Calendar,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Rocket,
  Send,
  Zap,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import {
  posts,
  profile,
  projects,
  skillGroups,
  socials,
  stats,
  timeline,
  type IconType,
} from "@/lib/profile";

export const metadata: Metadata = {
  title: "米葱苓的主页",
  description: "米葱苓的主页，记录了我的学习、生活和一些有趣的事情。",
};

/** 卡片通用样式：与全站白底 + 圆角 + 阴影的风格保持一致 */
const card =
  "rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl dark:bg-card";

/** 区块容器：图标 + 标题 */
function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: IconType;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-4">
      <h2 className="mb-5 flex items-center gap-2.5 text-xl font-bold">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-12 px-5 py-10">
      {/* 关于我 */}
      <Section id="about" icon={Heart} title="关于我">
        <div
          className={`${card} flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8`}
        >
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={96}
            height={96}
            className="size-24 shrink-0 rounded-full border-4 border-gray-200 object-cover dark:border-gray-600"
          />
          <div className="min-w-0">
            <p className="text-lg font-semibold">
              {profile.name}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {profile.role}
              </span>
            </p>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {profile.location}
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <Mail className="size-4" />
                {profile.email}
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${card} flex flex-col items-center gap-1 p-5 text-center`}
            >
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 技术栈 */}
      <Section id="skills" icon={Zap} title="技术栈">
        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.title} className={`${card} p-6`}>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <group.icon className="size-4 text-primary" />
                {group.title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground dark:bg-muted/20"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 最近文章 */}
      <Section id="posts" icon={BookMarked} title="最近文章">
        <div className="grid gap-4 sm:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.title}
              href={post.url}
              className={`${card} group flex flex-col gap-2.5 p-6`}
            >
              <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                {post.tag}
              </span>
              <h3 className="font-semibold transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                {post.date}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="#"
          className="mt-4 inline-flex items-center gap-1 text-sm text-primary transition-colors hover:underline"
        >
          查看全部文章
          <ArrowRight className="size-4" />
        </Link>
      </Section>

      {/* 个人项目 */}
      <Section id="projects" icon={Rocket} title="个人项目">
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div key={project.name} className={`${card} flex flex-col gap-3 p-6`}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{project.name}</h3>
                <div className="flex shrink-0 gap-1.5">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <link.icon className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground dark:bg-muted/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 成长足迹 */}
      <Section id="timeline" icon={GraduationCap} title="成长足迹">
        <div className={`${card} p-6 sm:p-8`}>
          <ol className="relative space-y-6 border-l border-border pl-6">
            {timeline.map((item) => (
              <li key={item.title} className="relative">
                <span className="absolute -left-7.5 top-1 size-3 rounded-full bg-primary ring-4 ring-primary/20" />
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 联系我 */}
      <Section id="contact" icon={Send} title="联系我">
        <div className={`${card} flex flex-col items-center gap-4 p-8 text-center`}>
          <p className="text-lg font-semibold">欢迎交流 👋</p>
          <p className="max-w-md text-sm text-muted-foreground">
            有任何问题或合作想法，都可以通过下面的方式找到我，看到就会回复～
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.external ? "_blank" : undefined}
                rel={social.external ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                <social.icon className="size-4" />
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* 回到顶部 */}
      <div className="flex justify-center">
        <a
          href="#"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowUp className="size-4" />
          回到顶部
        </a>
      </div>
    </div>
  );
}
