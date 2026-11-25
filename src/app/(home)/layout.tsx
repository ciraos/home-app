import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowDown } from "lucide-react";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { FloatingActions } from "@/components/floating-actions";
import { LiveRefresh } from "@/components/live-refresh";
import { Seal } from "@/components/seal";
import { isSetupRequired } from "@/lib/auth";
import { loadSettings } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // 还没有管理员：第一次访问直接引导到初始化页
  if (await isSetupRequired()) redirect("/setup");

  const settings = await loadSettings();
  const year = new Date().getFullYear();

  return (
    <>
      <Header name={settings.name} />

      <section className="mx-auto grid min-h-[calc(100dvh-3.5rem)] w-full max-w-5xl items-center gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:py-20">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
            个人主页 · {year}
          </p>

          <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.06] tracking-[-0.01em] text-foreground sm:text-6xl">
            {settings.heroTitle}
            <span className="mt-3 block text-2xl font-normal text-muted-foreground sm:text-[1.75rem]">
              {settings.heroSubtitle}
            </span>
          </h1>

          <p className="mt-8 max-w-[34rem] text-[15px] leading-7 text-muted-foreground">
            {settings.quote}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-foreground transition-colors duration-150 hover:text-primary"
            >
              继续向下
              <ArrowDown className="size-4" />
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              写信给我
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[340px] lg:justify-self-end">
          <div className="border border-border bg-[#fdfbf4] p-2.5">
            <Image
              src={settings.avatar}
              alt={settings.name}
              width={640}
              height={640}
              loading="eager"
              fetchPriority="high"
              unoptimized
              className="aspect-square w-full object-cover"
            />
          </div>
          <Seal
            label="米"
            className="absolute -right-4 -bottom-4 size-12 rotate-[-3deg] text-xl shadow-sm"
          />
        </div>
      </section>

      <div className="main">
        {children}
      </div>

      <Footer name={settings.name} icp={settings.icp} icpUrl={settings.icpUrl} />

      <FloatingActions />
      <LiveRefresh />
    </>
  );
}
