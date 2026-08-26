"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
    { href: "#about", label: "关于我" },
    { href: "#skills", label: "技术栈" },
    { href: "#posts", label: "文章" },
    { href: "#projects", label: "项目" },
    { href: "#timeline", label: "足迹" },
    { href: "#contact", label: "联系" },
];

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header id="header" className="header w-full max-w-4xl min-h-12 px-5 py-2.5 my-0 mx-auto bg-white flex flex-col justify-center gap-0 shadow-md hover:shadow-xl rounded-b-2xl dark:bg-card">
            <div className="flex items-center justify-between gap-3">
                <Link className="text-lg shrink-0 hover:underline dark:text-slate-300" href="/" onClick={() => setOpen(false)}>米葱苓</Link>

                {/* 桌面端导航 */}
                <nav className="no-scrollbar hidden min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto text-sm sm:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="shrink-0 text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex shrink-0 items-center gap-1.5">
                    <ModeToggle />
                    {/* 移动端菜单按钮 */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={open ? "关闭菜单" : "打开菜单"}
                        aria-expanded={open}
                        className="size-9 sm:hidden"
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </div>
            </div>

            {/* 移动端下拉菜单 */}
            {open && (
                <nav className="mt-2 flex flex-col gap-1 border-t border-border pt-2 sm:hidden">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-muted hover:text-primary dark:text-slate-300"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    )
}
