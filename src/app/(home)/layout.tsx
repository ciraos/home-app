import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FloatingActions } from "@/components/floating-actions";
import { getRenjianQuote } from "@/lib/dujitang";
import { ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const djt = await getRenjianQuote();

  return (
    <>
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
    </>
  );
}
