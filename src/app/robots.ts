import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** 生成 /robots.txt，并把 sitemap 地址交给爬虫 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
