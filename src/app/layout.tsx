import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AutoTheme } from "@/components/auto-theme";
import { loadSettings } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await loadSettings();
  const title = `${settings.name}的主页`;

  return {
    metadataBase: new URL(settings.siteUrl || "https://ciraos.top"),
    title: {
      default: title,
      template: `%s | ${settings.name}`,
    },
    description: settings.description,
    applicationName: settings.name,
    authors: [{ name: settings.name, url: settings.github }],
    keywords: [settings.name, "个人主页", "前端开发", "Next.js", "博客"],
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: settings.siteUrl,
      siteName: settings.name,
      title,
      description: settings.description,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: settings.description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

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
    <html lang="zh-CN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-background text-foreground">
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
