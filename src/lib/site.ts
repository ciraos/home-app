// =============================================================
// 🌐 站点级常量：名字、域名、备案号只在这里维护一次。
// 组件与 metadata 统一从这里取值，避免同一个信息散落在多个文件。
// =============================================================

export const site = {
  /** 站点名（顶栏、hero、metadata 共用） */
  name: "米葱苓",
  /** 主站地址：用作 metadataBase、canonical、sitemap */
  url: "https://ciraos.top",
  /** 博客地址：文章列表与 RSS 都在这个域名下 */
  blogUrl: "https://blog.ciraos.top",
  /** SEO 描述 */
  description: "米葱苓的主页，记录了我的学习、生活和一些有趣的事情。",
  /** 备案号与工信部链接（页脚展示） */
  icp: "皖ICP备2023018992号-1",
  icpUrl: "https://beian.miit.gov.cn",
} as const;
