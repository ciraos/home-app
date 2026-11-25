import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/project-form";
import { getProject } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const project = isNew ? null : await getProject(Number(id));
  if (!isNew && !project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-primary">
          ← 返回个人网站
        </Link>
        <h1 className="mt-2 text-xl font-bold">{isNew ? "新建项目" : `编辑：${project?.name}`}</h1>
      </div>
      <ProjectForm project={project ?? undefined} />
    </div>
  );
}
