import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AutoTheme } from "@/components/auto-theme";

export const metadata: Metadata = {
  icons: "https://s2.loli.net/2024/09/19/vlUkTg1ZEIVW7uN.jpg",
};

// 允许内容延伸到安全区（iPhone 刘海/底部横条），配合 env(safe-area-inset-*) 使用
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      data-theme="theme"
      lang="zh-CN"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="bg-[#f4f4f4] dark:bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem
          enableColorScheme
        >
          {/* 根据日出日落自动切换深浅色 */}
          <AutoTheme />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
