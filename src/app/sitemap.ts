import type { MetadataRoute } from "next";

import { loadSettings } from "@/lib/site-content";

export const dynamic = "force-dynamic";

/** 生成 /sitemap.xml；目前只有首页 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = await loadSettings();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
