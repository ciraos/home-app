import { PasswordForm } from "@/components/admin/password-form";
import { Card } from "@/components/admin/ui";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">账号安全</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          当前账号：{user?.username}。站点只有一个管理员，没有注册入口。
        </p>
      </div>

      <Card>
        <PasswordForm />
      </Card>

      <div className="rounded-2xl border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">忘记密码怎么办？</p>
        <p className="mt-1">
          清空 users 表（
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">DELETE FROM users;</code>
          ）后重新访问站点，就会回到初始化流程；站点内容不受影响。
        </p>
      </div>
    </div>
  );
}
