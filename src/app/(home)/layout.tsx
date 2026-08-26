import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FloatingActions } from "@/components/floating-actions";
import { AutoTheme } from "@/components/auto-theme";
import { DuJiTangResponse } from "@/type/dujitang";
import {
  ChevronDown
} from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_NSUUU_API_URL;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  icons: "https://s2.loli.net/2024/09/19/vlUkTg1ZEIVW7uN.jpg"
};

// 允许内容延伸到安全区（iPhone 刘海/底部横条），配合 env(safe-area-inset-*) 使用
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

async function getPoisonousChickenSoup() {
  try {
    const a = await fetch(`${baseUrl}/dujitang`, {
      cache: "no-cache",
      // next: { revalidate: 0 }
    });
    if (!a.ok) {
      throw new Error("请求毒鸡汤API失败!");
    }
    const data = await a.json();
    const res = await data as DuJiTangResponse;
    // console.log(res);
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("获取毒鸡汤数据错误:", error);
    return "今天的毒鸡汤加载失败了，换个心情吧～";
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const djt = await getPoisonousChickenSoup();

  return (
    <html
      data-theme="theme"
      lang="zh-CN"
      suppressHydrationWarning
    >
      <body
        className="bg-[#f4f4f4] dark:bg-background"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem
          enableColorScheme
        >
          {/* 根据日出日落自动切换深浅色 */}
          <AutoTheme />
          <div id="CIRAOS">

            <div className="top w-full min-h-screen flex flex-col items-center justify-between py-0">
              <Header />
              <div className="top-content w-full px-5 sm:px-16 lg:px-40 flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
                <div className="text-center lg:text-left">
                  <div className="top-content-title text-4xl sm:text-6xl lg:text-7xl font-bold">米葱苓SAMA的 <br /> <div className="text-2xl sm:text-3xl">主页</div></div>
                  <p className="djt mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400">{djt}</p>
                </div>
                <Image
                  src="/avatar.avif"
                  alt="avatar"
                  width={380}
                  height={380}
                  loading="eager"
                  className="top-content-ava w-40 h-40 sm:w-56 sm:h-56 lg:w-95 lg:h-95 rounded-full border-4 border-gray-200 dark:border-gray-600 shadow-lg"
                />
              </div>
              <a
                id="scroll-down"
                href="#about"
                aria-label="向下滚动查看内容"
                className="w-full py-1 flex items-center justify-center animate-bounce hover:cursor-pointer"
              >
                <ChevronDown />
              </a>
            </div>

            <div className="main m-0">{children}</div>

            <Footer />

            <FloatingActions />

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
