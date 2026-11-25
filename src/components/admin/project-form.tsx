import { saveProjectAction } from "@/app/admin/actions";
import { Card, Field, Input, Textarea } from "@/components/admin/ui";
import type { Project } from "@/lib/types";

const LINK_ROWS = 6;

export function ProjectForm({ project }: { project?: Project }) {
  const links = Array.from({ length: LINK_ROWS }, (_, index) => project?.links[index] ?? { label: "", href: "" });

  return (
    <form action={saveProjectAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={project?.id ?? 0} />

      <Card className="grid gap-4 sm:grid-cols-2">
        <Field label="名称">
          <Input name="name" defaultValue={project?.name ?? ""} required />
        </Field>
        <Field label="排序" hint="数字越小越靠前">
          <Input name="sort" type="number" defaultValue={project?.sort ?? 100} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="简介">
            <Textarea name="description" defaultValue={project?.description ?? ""} rows={3} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="标签" hint="用逗号分隔，例如：Next.js, TypeScript">
            <Input name="tags" defaultValue={(project?.tags ?? []).join(", ")} />
          </Field>
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 font-semibold">外链</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          最多 6 个，名称和地址都填了才会显示。留空表示这个项目不提供链接。
        </p>
        <div className="flex flex-col gap-3">
          {links.map((link, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-2">
              <Input name="linkLabel" defaultValue={link.label} placeholder={`链接名称 ${index + 1}`} />
              <Input name="linkHref" type="url" defaultValue={link.href} placeholder="https://" />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
        >
          {project ? "保存修改" : "创建项目"}
        </button>
      </div>
    </form>
  );
}
