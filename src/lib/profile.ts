// =============================================================
// 🏠 首页内容配置
// 这里的所有内容都是占位示例，请替换成你自己的真实信息。
// 修改后保存，刷新首页即可看到效果，无需改动页面代码。
// =============================================================

import type { ComponentType } from "react";
import {
  Database,
  GitBranch,
  Laptop,
  Mail,
  Rss,
  Server,
  Wrench,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";

/** 图标类型：lucide 图标与自定义品牌图标通用 */
export type IconType = ComponentType<{ className?: string }>;

// ---------- 基本信息 ----------
export const profile = {
  name: "米葱苓",
  role: "前端开发 / 独立开发者",
  location: "中国 · 淮南",
  email: "ciraos@yeah.net", // TODO: 改成你的邮箱
  github: "https://github.com/ciraos", // TODO: 改成你的 GitHub 主页
  avatar: "/avatar.avif",
  bio: "你好呀，我是米葱苓 👋 一个喜欢折腾的开发者。这个主页用来记录我的学习笔记、生活日常和一些有趣的小项目。平时喜欢研究前端、写点小工具，也热衷于把想法变成能跑起来的代码。",
} as const;

// ---------- 数据统计 ----------
export const stats: { label: string; value: string }[] = [
  { label: "文章", value: "12" },
  { label: "项目", value: "6" },
  { label: "码龄", value: "3年" },
  { label: "咖啡", value: "∞" },
];

// ---------- 技术栈 ----------
export const skillGroups: { title: string; icon: IconType; items: string[] }[] = [
  {
    title: "前端",
    icon: Laptop,
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "后端",
    icon: Server,
    items: ["Node.js", "Python", "RESTful API"],
  },
  {
    title: "数据库与运维",
    icon: Database,
    items: ["MySQL", "Redis", "Docker", "Linux", "Nginx"],
  },
  {
    title: "常用工具",
    icon: Wrench,
    items: ["Git", "VS Code"],
  },
];

// ---------- 最近文章（占位，替换成你的真实文章） ----------
export const posts: {
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  url: string;
}[] = [
    {
      title: "从零搭建个人主页：技术选型与踩坑记录",
      excerpt: "记录了我从选框架、配域名到部署上线的全过程，以及那些让人抓狂的小坑。",
      tag: "随笔",
      date: "2025-11-02",
      url: "#",
    },
    {
      title: "Next.js 16 迁移实践笔记",
      excerpt: "升级到 Next.js 16 后遇到的变化与应对方案，包括配置、路由与图片优化的调整。",
      tag: "前端",
      date: "2025-09-18",
      url: "#",
    },
    {
      title: "我的第一台服务器折腾记",
      excerpt: "从买服务器、装系统到配置 Nginx 与 HTTPS，一个新手踩过的所有坑。",
      tag: "运维",
      date: "2025-06-30",
      url: "#",
    },
  ];

// ---------- 个人项目（占位，替换成你的真实项目） ----------
export const projects: {
  name: string;
  description: string;
  tags: string[];
  links: { label: string; href: string; icon: IconType }[];
}[] = [
    {
      name: "home-app · 个人主页",
      description:
        "你现在看到的这个网站，基于 Next.js 16 + Tailwind CSS 构建，支持暗色模式，并接入了随机毒鸡汤 API。",
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
      links: [{ label: "GitHub", href: "https://github.com/", icon: GithubIcon }],
    },
    // {
    //   name: "毒鸡汤 API",
    //   description:
    //     "托管在 nsuuu.com 的毒鸡汤接口，随机返回一句“扎心”文案，为本站 hero 区提供每日毒汤。",
    //   tags: ["API", "Node.js"],
    //   links: [{ label: "接口地址", href: "https://v1.nsuuu.com/api", icon: Globe }],
    // },
    {
      name: "学习笔记仓库",
      description:
        "整理前端、后端与运维相关的学习笔记，持续更新中，欢迎 star 和交流。",
      tags: ["Markdown", "文档"],
      links: [{ label: "GitHub", href: "https://github.com/", icon: GithubIcon }],
    },
    {
      name: "小工具集",
      description:
        "日常开发中顺手写的一些小工具与脚本，比如图片压缩、JSON 格式化等。",
      tags: ["Node.js", "脚本"],
      links: [{ label: "仓库", href: "https://github.com/", icon: GitBranch }],
    },
  ];

// ---------- 成长时间线（占位，替换成你的经历） ----------
export const timeline: { date: string; title: string; description: string }[] = [
  {
    date: "2025",
    title: "搭建个人主页",
    description: "用 Next.js 从零搭起了这个小站，开始把想法变成线上作品。",
  },
  {
    date: "2024",
    title: "折腾服务器与域名",
    description: "买了第一台服务器，学会了 Linux、Nginx 与 HTTPS，也踩了不少坑。",
  },
  {
    date: "2023",
    title: "开始学习前端开发",
    description: "从 HTML/CSS 起步，接触了 JavaScript 与 React，打开了新世界的大门。",
  },
  {
    date: "2022",
    title: "与编程结缘",
    description: "因为好奇一行代码如何变成网页，从此走上程序员之路。",
  },
];

// ---------- 联系方式 ----------
export const socials: {
  label: string;
  href: string;
  icon: IconType;
  external?: boolean;
}[] = [
    { label: "GitHub", href: "https://github.com/ciraos", icon: GithubIcon, external: true },
    { label: "邮箱", href: "mailto:ciraos@yeah.net", icon: Mail },
    { label: "RSS", href: "#", icon: Rss, external: true },
    // { label: "毒鸡汤 API", href: "https://v1.nsuuu.com/api", icon: Quote, external: true },
  ];
