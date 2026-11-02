import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AutoTheme } from "@/components/auto-theme";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}的主页`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: "https://github.com/ciraos" }],
  keywords: ["米葱苓", "个人主页", "前端开发", "Next.js", "博客"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: site.url,
    siteName: site.name,
    title: `${site.name}的主页`,
    description: site.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name}的主页`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}的主页`,
    description: site.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
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
