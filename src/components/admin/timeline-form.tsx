import { saveTimelineAction } from "@/app/admin/actions";
import { Card, Field, Input, Textarea } from "@/components/admin/ui";
import type { TimelineItem } from "@/lib/types";

export function TimelineForm({ item }: { item?: TimelineItem }) {
  return (
    <form action={saveTimelineAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={item?.id ?? 0} />

      <Card className="grid gap-4 sm:grid-cols-2">
        <Field label="标题">
          <Input name="title" defaultValue={item?.title ?? ""} required />
        </Field>
        <Field label="时间" hint="可留空；支持「2024」「2023 夏」这类自由文本">
          <Input name="date" defaultValue={item?.date ?? ""} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="描述">
            <Textarea name="description" defaultValue={item?.description ?? ""} rows={3} />
          </Field>
        </div>
        <Field label="排序" hint="数字越小越靠前">
          <Input name="sort" type="number" defaultValue={item?.sort ?? 100} />
        </Field>
      </Card>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
        >
          {item ? "保存修改" : "添加条目"}
        </button>
      </div>
    </form>
  );
}
