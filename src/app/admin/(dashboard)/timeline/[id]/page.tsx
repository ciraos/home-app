import Link from "next/link";
import { notFound } from "next/navigation";

import { TimelineForm } from "@/components/admin/timeline-form";
import { getTimelineItem } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function TimelineEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const item = isNew ? null : await getTimelineItem(Number(id));
  if (!isNew && !item) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/timeline" className="text-sm text-muted-foreground hover:text-primary">
          ← 返回成长足迹
        </Link>
        <h1 className="mt-2 text-xl font-bold">{isNew ? "新增条目" : `编辑：${item?.title}`}</h1>
      </div>
      <TimelineForm item={item ?? undefined} />
    </div>
  );
}
