"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, UserPlus, MailCheck } from "lucide-react";
import { Label, TextInput, FieldRow } from "@/components/forms/fields";
import { signup, type AuthActionState } from "@/app/auth/actions";

const initialState: AuthActionState = {};

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  if (state?.success) {
    return (
      <div className="flex items-start gap-3 border border-term-800 bg-term-900/20 p-4">
        <MailCheck size={18} className="mt-0.5 shrink-0 text-term-400" />
        <p className="text-sm text-term-200">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <FieldRow>
        <Label required>Email</Label>
        <TextInput name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </FieldRow>

      <FieldRow>
        <Label required>Пароль</Label>
        <TextInput
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="щонайменше 6 символів"
        />
      </FieldRow>

      {state?.error && (
        <p className="mb-4 border border-rose/40 bg-rose/5 px-3 py-2 text-xs text-rose">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 border border-term-600 bg-term-900/30 px-4 py-2 text-sm text-term-300 transition-colors hover:bg-term-900/50 disabled:opacity-50"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
        Зареєструватися
      </button>

      <p className="mt-4 text-center text-xs text-muted">
        Вже є акаунт?{" "}
        <Link href="/login" className="text-term-400 hover:text-term-300">
          Увійти
        </Link>
      </p>
    </form>
  );
}
