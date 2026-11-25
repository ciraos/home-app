"use client";

import { useActionState } from "react";

import { loginAction } from "@/app/admin/actions";
import { Field, Input } from "@/components/admin/ui";
import type { ActionState } from "@/lib/action-state";

const initial: ActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="用户名">
        <Input name="username" autoComplete="username" required autoFocus />
      </Field>
      <Field label="密码">
        <Input name="password" type="password" autoComplete="current-password" required />
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
        {pending ? "登录中…" : "登录"}
      </button>
    </form>
  );
}
