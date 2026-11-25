// =============================================================
// 🌱 默认内容：首次初始化数据库时写入，同时作为读库失败时的兜底
// 后台改过之后就以数据库为准，这里的值只影响全新部署。
// =============================================================

import type { Project, Settings, Social, Stat, TimelineItem } from "@/lib/types";

export const defaultSettings: Settings = {
  name: "米葱苓",
  role: "前端开发 / 独立开发者",
  location: "中国 · 淮南",
  email: "ciraos@yeah.net",
  github: "https://github.com/ciraos",
  avatar: "/avatar.avif",
  bio: "你好呀，我是米葱苓 👋 一个喜欢折腾的开发者。这个主页用来记录我的学习笔记、生活日常和一些有趣的小项目。平时喜欢研究前端、写点小工具，也热衷于把想法变成能跑起来的代码。",
  siteUrl: "https://ciraos.top",
  blogUrl: "https://blog.ciraos.top",
  description: "米葱苓的主页，记录了我的学习、生活和一些有趣的事情。",
  icp: "皖ICP备2023018992号-1",
  icpUrl: "https://beian.miit.gov.cn",
  heroTitle: "米葱苓SAMA的",
  heroSubtitle: "主页",
  quote:
    "以前我觉得是兄弟就能抛开一切，两肋插刀！现在明白了维系情义也要大家实力相当 ——选自散文集《我在人间凑数的日子》",
  codingStartYear: 2020,
};

export const defaultStats: Omit<Stat, "id">[] = [
  { label: "文章", kind: "articles", value: "", sort: 10 },
  { label: "网站", kind: "sites", value: "", sort: 20 },
  { label: "码龄", kind: "coding", value: "", sort: 30 },
  { label: "咖啡", kind: "coffee", value: "∞", sort: 40 },
];

export const defaultProjects: Omit<Project, "id">[] = [
  {
    name: "home-app · 个人主页",
    description:
      "你现在看到的这个网站，基于 Next.js 16 + Tailwind CSS 构建，支持暗色模式，并接入了随机毒鸡汤 API。",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    links: [{ label: "主页", href: "https://ciraos.top" }],
    sort: 10,
  },
  {
    name: "博客",
    description: "我的博客站点，记录学习笔记、踩坑经验与生活点滴。",
    tags: ["博客"],
    links: [{ label: "博客", href: "https://blog.ciraos.top" }],
    sort: 20,
  },
  {
    name: "预览博客",
    description: "博客新主题与新功能的预览环境，用于上线前的体验和调试。",
    tags: ["预览"],
    links: [{ label: "预览", href: "https://demo.blog.ciraos.top" }],
    sort: 30,
  },
  {
    name: "ech0",
    description: "「ech0」——一个有回声的小项目（占位描述，内容可自行替换）。",
    tags: ["ech0"],
    links: [{ label: "ech0", href: "https://ech0.ciraos.top" }],
    sort: 40,
  },
  {
    name: "葱苓节点",
    description: "用来监控服务器状态的小站。",
    tags: ["节点", "监控"],
    links: [{ label: "节点", href: "https://node.ciraos.top" }],
    sort: 50,
  },
  {
    name: "ciraos new api",
    description: "自用的 AI 中转站，统一转发各家模型接口。",
    tags: ["AI", "中转"],
    links: [{ label: "new api", href: "https://sub.ciraos.top" }],
    sort: 60,
  },
  {
    name: "葱苓博客流量分析",
    description: "用来分析博客访问流量的看板。",
    tags: ["流量", "统计"],
    links: [{ label: "流量分析", href: "https://eodata.ciraos.top" }],
    sort: 70,
  },
  {
    name: "葱苓的网盘",
    description: "葱苓的网盘，用于文件分享与存储（占位描述，内容可自行替换）。",
    tags: ["网盘"],
    links: [{ label: "网盘", href: "https://pan.ciraos.top" }],
    sort: 80,
  },
  {
    name: "青龙面板",
    description: "青龙面板（不对外公开，不提供链接）。",
    tags: ["面板"],
    links: [],
    sort: 90,
  },
  {
    name: "uptime-kuma",
    description: "站点可用性监控面板（uptime-kuma）。",
    tags: ["监控"],
    links: [{ label: "监控", href: "https://stat.ciraos.top" }],
    sort: 100,
  },
];

export const defaultTimeline: Omit<TimelineItem, "id">[] = [
  {
    date: "",
    title: "搭建个人主页",
    description: "用 Next.js 从零搭起了这个小站，开始把想法变成线上作品。",
    sort: 10,
  },
  {
    date: "",
    title: "折腾服务器与域名",
    description: "买了第一台服务器，学会了 Linux、Nginx 与 HTTPS，也踩了不少坑。",
    sort: 20,
  },
  {
    date: "",
    title: "开始学习前端开发",
    description: "从 HTML/CSS 起步，接触了 JavaScript 与 React，打开了新世界的大门。",
    sort: 30,
  },
  {
    date: "",
    title: "与编程结缘",
    description: "因为好奇一行代码如何变成网页，从此走上程序员之路。",
    sort: 40,
  },
];

export const defaultSocials: Omit<Social, "id">[] = [
  {
    label: "GitHub",
    href: "https://github.com/ciraos",
    icon: "github",
    external: true,
    sort: 10,
  },
  {
    label: "邮箱",
    href: "mailto:ciraos@yeah.net",
    icon: "mail",
    external: false,
    sort: 20,
  },
  {
    label: "RSS",
    href: "https://blog.ciraos.top/rss.xml",
    icon: "rss",
    external: true,
    sort: 30,
  },
];
