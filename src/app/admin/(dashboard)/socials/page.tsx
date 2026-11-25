import {
  createSocialAction,
  deleteSocialAction,
  updateSocialAction,
} from "@/app/admin/actions";
import { Card, DangerButton, Field, Input, Notice, Select } from "@/components/admin/ui";
import { getSocials } from "@/lib/repo";
import type { SocialIcon } from "@/lib/types";

export const dynamic = "force-dynamic";

const iconOptions: { value: SocialIcon; label: string }[] = [
  { value: "github", label: "GitHub" },
  { value: "mail", label: "邮箱" },
  { value: "rss", label: "RSS" },
  { value: "globe", label: "通用链接" },
];

export default async function SocialsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, socials] = await Promise.all([searchParams, getSocials()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">联系方式</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          首页「联系我」卡片里的按钮，比如 GitHub、邮箱、RSS。
        </p>
      </div>

      <Notice saved={saved === "1"} />

      <div className="flex flex-col gap-4">
        {socials.map((social) => (
          <Card key={social.id}>
            <form
              action={updateSocialAction}
              className="grid gap-3 sm:grid-cols-[1fr_1.6fr_8rem_auto_4.5rem_auto] sm:items-end"
            >
              <input type="hidden" name="id" value={social.id} />
              <Field label="显示文案">
                <Input name="label" defaultValue={social.label} required />
              </Field>
              <Field label="链接">
                <Input name="href" defaultValue={social.href} placeholder="https:// 或 mailto:" />
              </Field>
              <Field label="图标">
                <Select name="icon" defaultValue={social.icon}>
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <label className="flex h-9 items-center gap-2 text-sm">
                <input type="checkbox" name="external" defaultChecked={social.external} />
                新窗口
              </label>
              <Field label="排序">
                <Input name="sort" type="number" defaultValue={social.sort} />
              </Field>
              <button
                type="submit"
                className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                保存
              </button>
            </form>
            <form action={deleteSocialAction} className="mt-2 flex justify-end">
              <input type="hidden" name="id" value={social.id} />
              <DangerButton>删除这一项</DangerButton>
            </form>
          </Card>
        ))}

        {socials.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            还没有联系方式，用下面的表单添加。
          </p>
        ) : null}
      </div>

      <Card>
        <h2 className="mb-4 font-semibold">新增联系方式</h2>
        <form
          action={createSocialAction}
          className="grid gap-3 sm:grid-cols-[1fr_1.6fr_8rem_auto_4.5rem_auto] sm:items-end"
        >
          <Field label="显示文案">
            <Input name="label" placeholder="比如：微博" required />
          </Field>
          <Field label="链接">
            <Input name="href" placeholder="https://" />
          </Field>
          <Field label="图标">
            <Select name="icon" defaultValue="globe">
              {iconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <label className="flex h-9 items-center gap-2 text-sm">
            <input type="checkbox" name="external" defaultChecked />
            新窗口
          </label>
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
