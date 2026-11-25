import Link from "next/link";

import { deleteTimelineAction } from "@/app/admin/actions";
import { DangerButton, Notice } from "@/components/admin/ui";
import { getTimeline } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, timeline] = await Promise.all([searchParams, getTimeline()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">成长足迹</h1>
          <p className="mt-1 text-sm text-muted-foreground">首页时间线条目，按排序值从小到大展示。</p>
        </div>
        <Link
          href="/admin/timeline/new"
          className="inline-flex h-9 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + 新增条目
        </Link>
      </div>

      <Notice saved={saved === "1"} />

      <ol className="relative flex flex-col gap-3 border-l border-border pl-5">
        {timeline.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-[26px] top-5 size-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
            <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{item.title}</h2>
                  {item.date ? (
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  ) : null}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    排序 {item.sort}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/timeline/${item.id}`}
                  className="rounded-lg px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
                >
                  编辑
                </Link>
                <form action={deleteTimelineAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <DangerButton>删除</DangerButton>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {timeline.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          还没有条目，点右上角新增。
        </p>
      ) : null}
    </div>
  );
}
