import Link from "next/link";

import { deleteProjectAction } from "@/app/admin/actions";
import { DangerButton, Notice } from "@/components/admin/ui";
import { getProjects } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, projects] = await Promise.all([searchParams, getProjects()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">个人网站</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            首页「个人网站」区块的卡片，顺序由排序值决定。
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-9 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + 新建项目
        </Link>
      </div>

      <Notice saved={saved === "1"} />

      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{project.name}</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  排序 {project.sort}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {project.tags.join(" · ") || "无标签"} ｜ {project.links.length} 个外链
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Link
                href={`/admin/projects/${project.id}`}
                className="rounded-lg px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
              >
                编辑
              </Link>
              <form action={deleteProjectAction}>
                <input type="hidden" name="id" value={project.id} />
                <DangerButton>删除</DangerButton>
              </form>
            </div>
          </div>
        ))}

        {projects.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            还没有项目，点右上角新建一个。
          </p>
        ) : null}
      </div>
    </div>
  );
}
