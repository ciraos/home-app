"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "#about", label: "关于" },
  { href: "#skills", label: "技术栈" },
  { href: "#posts", label: "文章" },
  { href: "#projects", label: "项目" },
  { href: "#timeline", label: "足迹" },
  { href: "#contact", label: "联系" },
];

export default function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="shrink-0 font-serif text-lg tracking-wide text-foreground"
          onClick={() => setOpen(false)}
        >
          {name}
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-150 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <ModeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            className="size-9 text-muted-foreground hover:text-foreground sm:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border px-6 py-3 sm:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
