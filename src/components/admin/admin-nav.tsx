"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "概览" },
  { href: "/admin/settings", label: "站点信息" },
  { href: "/admin/stats", label: "数据统计" },
  { href: "/admin/projects", label: "个人网站" },
  { href: "/admin/timeline", label: "成长足迹" },
  { href: "/admin/socials", label: "联系方式" },
  { href: "/admin/account", label: "账号" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm">
      {items.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-lg px-2.5 py-1.5 transition-colors",
              active
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
