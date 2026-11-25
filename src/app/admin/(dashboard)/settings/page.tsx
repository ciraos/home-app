import Image from "next/image";

import { saveSettingsAction } from "@/app/admin/actions";
import { Card, Field, Input, Notice, Textarea } from "@/components/admin/ui";
import { getSettings } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, settings] = await Promise.all([searchParams, getSettings()]);

  return (
    <form action={saveSettingsAction} className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">站点信息</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          首页头部、关于我、页脚与分享卡片都使用这里的内容。
        </p>
      </div>

      <Notice saved={saved === "1"} />

      <Card className="grid gap-4 sm:grid-cols-2">
        <Field label="名字">
          <Input name="name" defaultValue={settings.name} required />
        </Field>
        <Field label="身份 / 头衔">
          <Input name="role" defaultValue={settings.role} />
        </Field>
        <Field label="所在地">
          <Input name="location" defaultValue={settings.location} />
        </Field>
        <Field label="邮箱">
          <Input name="email" type="email" defaultValue={settings.email} />
        </Field>
        <Field label="GitHub 主页">
          <Input name="github" type="url" defaultValue={settings.github} />
        </Field>
        <Field label="开始编程的年份" hint="码龄 = 当前年份 − 这个值">
          <Input
            name="codingStartYear"
            type="number"
            min={1980}
            max={new Date().getFullYear()}
            defaultValue={settings.codingStartYear}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="个人简介" hint="显示在「关于我」卡片里">
            <Textarea name="bio" defaultValue={settings.bio} rows={4} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="SEO 描述" hint="出现在搜索结果与分享卡片里">
            <Textarea name="description" defaultValue={settings.description} rows={2} />
          </Field>
        </div>
      </Card>

      <Card className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 sm:col-span-2">
          <Image
            src={settings.avatar}
            alt={settings.name}
            width={64}
            height={64}
            className="size-16 rounded-full border border-border object-cover"
            unoptimized
          />
          <div className="flex-1">
            <Field label="头像" hint="可以填图片地址，也可以直接上传（≤4MB，PNG/JPEG/WebP/AVIF/GIF）">
              <Input name="avatar" defaultValue={settings.avatar} />
            </Field>
          </div>
        </div>
        <div className="sm:col-span-2">
          <Field label="上传新头像" hint="选择文件后会覆盖上面的地址，保存后生效">
            <input
              name="avatarFile"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
            />
          </Field>
        </div>
      </Card>

      <Card className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="首页大标题" hint="例如「米葱苓SAMA的」">
            <Input name="heroTitle" defaultValue={settings.heroTitle} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="首页一句话" hint="大标题下方那句毒鸡汤，留空则不显示">
            <Textarea name="quote" defaultValue={settings.quote} rows={2} />
          </Field>
        </div>
        <Field label="大标题下方小字">
          <Input name="heroSubtitle" defaultValue={settings.heroSubtitle} />
        </Field>
        <Field label="站点域名" hint="用于 canonical / sitemap，带 https://">
          <Input name="siteUrl" type="url" defaultValue={settings.siteUrl} />
        </Field>
        <Field label="博客地址" hint="「最近文章」的「查看全部」与 RSS 用">
          <Input name="blogUrl" type="url" defaultValue={settings.blogUrl} />
        </Field>
        <Field label="备案号">
          <Input name="icp" defaultValue={settings.icp} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="备案号链接">
            <Input name="icpUrl" type="url" defaultValue={settings.icpUrl} />
          </Field>
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          保存站点信息
        </button>
      </div>
    </form>
  );
}
