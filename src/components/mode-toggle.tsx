"use client"

import * as React from "react"
import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { markThemeOverriddenToday } from "@/lib/theme-override"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    // 手动选过一次就记下来，当天不再被日出日落自动切换覆盖
    const choose = (next: "light" | "dark" | "system") => {
        markThemeOverriddenToday()
        setTheme(next)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="切换深浅色模式"
                    title="切换深浅色模式"
                    className="size-9 text-muted-foreground hover:text-foreground"
                >
                    <Sun className="size-[18px] scale-100 rotate-0 transition-transform duration-150 dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute size-[18px] scale-0 rotate-90 transition-transform duration-150 dark:scale-100 dark:rotate-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => choose("light")}>
                    <Sun className="size-4" />
                    浅色模式
                    {theme === "light" && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => choose("dark")}>
                    <Moon className="size-4" />
                    深色模式
                    {theme === "dark" && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => choose("system")}>
                    <Monitor className="size-4" />
                    跟随系统
                    {theme === "system" && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
