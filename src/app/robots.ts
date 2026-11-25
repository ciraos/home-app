import type { MetadataRoute } from "next";

import { loadSettings } from "@/lib/site-content";

export const dynamic = "force-dynamic";

/** 生成 /robots.txt，并把 sitemap 地址交给爬虫 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await loadSettings();

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/setup"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
