import {
  createStatAction,
  deleteStatAction,
  updateStatAction,
} from "@/app/admin/actions";
import { Card, DangerButton, Field, Input, Notice, Select } from "@/components/admin/ui";
import { getStats } from "@/lib/repo";
import type { StatKind } from "@/lib/types";

export const dynamic = "force-dynamic";

const kindOptions: { value: StatKind; label: string; hint?: string }[] = [
  { value: "articles", label: "文章（实时）", hint: "取博客接口的文章总数" },
  { value: "sites", label: "网站（自动）", hint: "等于「个人网站」数量" },
  { value: "coding", label: "码龄（自动）", hint: "当前年份 − 开始年份" },
  { value: "coffee", label: "固定值", hint: "直接显示下面的值" },
  { value: "custom", label: "自定义", hint: "直接显示下面的值" },
];

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, stats] = await Promise.all([searchParams, getStats()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">数据统计</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          首页「关于我」下面的四个数字。文章 / 网站 / 码龄可以自动计算，也可以固定成任意文字。
        </p>
      </div>

      <Notice saved={saved === "1"} />

      <div className="flex flex-col gap-4">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <form action={updateStatAction} className="grid gap-3 sm:grid-cols-[1fr_10rem_8rem_5rem_auto] sm:items-end">
              <input type="hidden" name="id" value={stat.id} />
              <Field label="显示文案">
                <Input name="label" defaultValue={stat.label} required />
              </Field>
              <Field label="数值来源">
                <Select name="kind" defaultValue={stat.kind}>
                  {kindOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="固定值">
                <Input name="value" defaultValue={stat.value} placeholder="可留空" />
              </Field>
              <Field label="排序">
                <Input name="sort" type="number" defaultValue={stat.sort} />
              </Field>
              <button
                type="submit"
                className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                保存
              </button>
            </form>
            <form action={deleteStatAction} className="mt-2 flex justify-end">
              <input type="hidden" name="id" value={stat.id} />
              <DangerButton>删除这一项</DangerButton>
            </form>
          </Card>
        ))}

        {stats.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            还没有统计项，用下面的表单添加一个。
          </p>
        ) : null}
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">新增统计项</h2>
        <form action={createStatAction} className="grid gap-3 sm:grid-cols-[1fr_10rem_8rem_5rem_auto] sm:items-end">
          <Field label="显示文案">
            <Input name="label" placeholder="比如：访客" required />
          </Field>
          <Field label="数值来源">
            <Select name="kind" defaultValue="custom">
              {kindOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="固定值">
            <Input name="value" placeholder="比如：999" />
          </Field>
          <Field label="排序">
            <Input name="sort" type="number" defaultValue={100} />
          </Field>
          <button
            type="submit"
            className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            添加
          </button>
        </form>
      </Card>
    </div>
  );
}
