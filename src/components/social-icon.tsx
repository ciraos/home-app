import { Globe, Mail, Rss } from "lucide-react";

import { GithubIcon } from "@/components/icons";
import type { SocialIcon as SocialIconName } from "@/lib/types";

/** 把数据库里存的图标名映射成具体图标 */
export function SocialIcon({
  name,
  className,
}: {
  name: SocialIconName;
  className?: string;
}) {
  if (name === "github") return <GithubIcon className={className} />;
  if (name === "mail") return <Mail className={className} />;
  if (name === "rss") return <Rss className={className} />;
  return <Globe className={className} />;
}
