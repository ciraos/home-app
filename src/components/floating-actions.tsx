"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { markThemeOverriddenToday } from "@/lib/theme-override";

/** 下滑超过该距离后显示回到顶部按钮 */
const SCROLL_THRESHOLD = 150;

/** 回到顶部按钮显示时，主题按钮需要上移的高度：bottom-6 + 按钮高 + 间距 */
const STACKED_BOTTOM = "bottom-[calc(5.25rem_+_env(safe-area-inset-bottom))]";

/** 悬浮按钮距底部距离：常规 1.5rem + iPhone 底部安全区 */
const BASE_BOTTOM = "bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))]";

function subscribe(onStoreChange: () => void) {
  const onScroll = () => onStoreChange();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

function getScrollY() {
  return window.scrollY;
}

function getServerScrollY() {
  return 0;
}

/** 右下角悬浮按钮组：回到顶部（下滑 150px 后显示）+ 深浅色切换 */
export function FloatingActions() {
  const scrollY = useSyncExternalStore(subscribe, getScrollY, getServerScrollY);
  const { resolvedTheme, setTheme } = useTheme();

  const showBackToTop = scrollY > SCROLL_THRESHOLD;
  const isDark = resolvedTheme === "dark";
  // 主题在客户端按日出日落动态确定（服务端无法预知），为避免服务端/客户端渲染不一致的
  // hydration 告警，这里使用主题无关的通用文案；实际切换逻辑仍由 isDark 正确驱动。
  const themeLabel = "切换深浅色模式";

  return (
    <>
      {/* 回到顶部：位于主题按钮下方，下滑超过 150px 才显示 */}
      <Button
        type="button"
        variant="secondary"
        size="icon-lg"
        aria-label="回到顶部"
        title="回到顶部"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed right-6 z-50 size-12 rounded-full shadow-lg transition-all duration-300 ${BASE_BOTTOM} ${
          showBackToTop
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-75 opacity-0"
        }`}
      >
        <ArrowUp className="size-5" />
      </Button>

      {/* 深浅色切换：回到顶部按钮显示时上移让位，隐藏时滑回角落 */}
      <Button
        type="button"
        variant="default"
        size="icon-lg"
        aria-label={themeLabel}
        title={themeLabel}
        onClick={() => {
          markThemeOverriddenToday();
          setTheme(isDark ? "light" : "dark");
        }}
        className={`fixed right-6 z-50 size-12 rounded-full shadow-lg transition-all duration-300 ${
          showBackToTop ? STACKED_BOTTOM : BASE_BOTTOM
        }`}
      >
        <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute size-5 scale-0 -rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
    </>
  );
}
