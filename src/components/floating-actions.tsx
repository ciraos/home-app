"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";

/** 下滑超过该距离后显示回到顶部按钮 */
const SCROLL_THRESHOLD = 320;

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

/** 右下角「回到顶部」：出现时才可聚焦，样式跟纸张色调一致 */
export function FloatingActions() {
  const scrollY = useSyncExternalStore(subscribe, getScrollY, getServerScrollY);
  const showBackToTop = scrollY > SCROLL_THRESHOLD;

  return (
    <button
      type="button"
      aria-label="回到顶部"
      title="回到顶部"
      tabIndex={showBackToTop ? 0 : -1}
      aria-hidden={!showBackToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-6 bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))] z-40 grid size-10 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-[color,opacity,transform] duration-200 hover:text-foreground ${
        showBackToTop
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
