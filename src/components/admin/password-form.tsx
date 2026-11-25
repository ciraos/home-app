"use client";

import { useActionState } from "react";

import { changePasswordAction } from "@/app/admin/actions";
import { Field, Input } from "@/components/admin/ui";
import type { ActionState } from "@/lib/action-state";

const initial: ActionState = {};

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="当前密码">
        <Input name="currentPassword" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="新密码" hint="至少 8 位">
        <Input name="newPassword" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      <Field label="确认新密码">
        <Input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} />
      </Field>

      {state.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          {state.ok}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "保存中…" : "更新密码"}
      </button>
    </form>
  );
}
