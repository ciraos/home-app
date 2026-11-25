import Link from "next/link";

import { Seal } from "@/components/seal";

export default function Footer({
  name,
  icp,
  icpUrl,
}: {
  name: string;
  icp: string;
  icpUrl: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <Seal label="米" className="size-5 text-[10px]" />
          <span>
            © {year} {name}
          </span>
        </p>
        <div className="flex items-center gap-5">
          <a
            href={icpUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="transition-colors duration-150 hover:text-foreground"
          >
            {icp}
          </a>
          <Link href="/admin" className="transition-colors duration-150 hover:text-foreground">
            后台
          </Link>
        </div>
      </div>
    </footer>
  );
}
