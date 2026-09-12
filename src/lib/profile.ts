// =============================================================
// 🏠 首页内容配置
// 这里的所有内容都是占位示例，请替换成你自己的真实信息。
// 修改后保存，刷新首页即可看到效果，无需改动页面代码。
// =============================================================

import type { ComponentType } from "react";
import {
  Database,
  Globe,
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
// 「网站」数量由下方 projects 列表长度实时计算（见 page.tsx 渲染逻辑）
export const stats: { label: string; value: string }[] = [
  { label: "文章", value: "12" }, // 实际值由 articles API 实时获取
  { label: "网站", value: "0" }, // 实际值 = projects.length
  { label: "码龄", value: "0年" }, // 实际值 = 当前年份 - 2020（随年份自动 +1）
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

// ---------- 最近文章（已改为从 blog.ciraos.top 前端 API 实时拉取，见 src/lib/articles.ts） ----------

// ---------- 个人网站 ----------
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
      links: [{ label: "主页", href: "https://ciraos.top", icon: Globe }],
    },
    {
      name: "博客",
      description:
        "我的博客站点，记录学习笔记、踩坑经验与生活点滴。",
      tags: ["博客"],
      links: [{ label: "博客", href: "https://blog.ciraos.top", icon: Globe }],
    },
    {
      name: "预览博客",
      description:
        "博客新主题与新功能的预览环境，用于上线前的体验和调试。",
      tags: ["预览"],
      links: [{ label: "预览", href: "https://demo.blog.ciraos.top", icon: Globe }],
    },
    {
      name: "ech0",
      description:
        "「ech0」——一个有回声的小项目（占位描述，内容可自行替换）。",
      tags: ["ech0"],
      links: [{ label: "ech0", href: "https://ech0.ciraos.top", icon: Globe }],
    },
    {
      name: "葱苓节点",
      description:
        "葱苓的网络节点（占位描述，内容可自行替换）。",
      tags: ["节点"],
      links: [{ label: "节点", href: "https://node.ciraos.top", icon: Globe }],
    },
    {
      name: "葱苓的网盘",
      description:
        "葱苓的网盘，用于文件分享与存储（占位描述，内容可自行替换）。",
      tags: ["网盘"],
      links: [{ label: "网盘", href: "https://pan.ciraos.top", icon: Globe }],
    },
    {
      name: "青龙面板",
      description:
        "青龙面板（不对外公开，不提供链接）。",
      tags: ["面板"],
      links: [],
    },
    {
      name: "uptime-kuma",
      description:
        "站点可用性监控面板（uptime-kuma）。",
      tags: ["监控"],
      links: [{ label: "监控", href: "https://stat.ciraos.top", icon: Globe }],
    },
  ];

// ---------- 成长时间线（占位，替换成你的经历） ----------
// date 为可选：记不清年份时可注释掉，页面则不显示日期
export const timeline: { date?: string; title: string; description: string }[] = [
  {
    // date: "2025", // 已注释：记不清具体年份
    title: "搭建个人主页",
    description: "用 Next.js 从零搭起了这个小站，开始把想法变成线上作品。",
  },
  {
    // date: "2024", // 已注释：记不清具体年份
    title: "折腾服务器与域名",
    description: "买了第一台服务器，学会了 Linux、Nginx 与 HTTPS，也踩了不少坑。",
  },
  {
    // date: "2023", // 已注释：记不清具体年份
    title: "开始学习前端开发",
    description: "从 HTML/CSS 起步，接触了 JavaScript 与 React，打开了新世界的大门。",
  },
  {
    // date: "2020", // 已注释：记不清具体年份
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
    { label: "RSS", href: "/rss.xml", icon: Rss, external: true },
    // { label: "毒鸡汤 API", href: "https://v1.nsuuu.com/api", icon: Quote, external: true },
  ];
