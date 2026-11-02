import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** 生成 /sitemap.xml；目前只有一个首页 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
