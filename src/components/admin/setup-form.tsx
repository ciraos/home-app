"use client";

import { useActionState } from "react";

import { setupAction } from "@/app/setup/actions";
import { Field, Input } from "@/components/admin/ui";
import type { ActionState } from "@/lib/action-state";

const initial: ActionState = {};

export function SetupForm() {
  const [state, action, pending] = useActionState(setupAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="管理员用户名" hint="2–32 个字符，之后用它登录">
        <Input name="username" autoComplete="username" required minLength={2} maxLength={32} />
      </Field>
      <Field label="密码" hint="至少 8 位，建议用密码管理器生成">
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </Field>
      <Field label="确认密码">
        <Input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </Field>

      {state.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "正在创建…" : "创建管理员并进入后台"}
      </button>
    </form>
  );
}
