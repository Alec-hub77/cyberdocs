"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { Label, TextInput, FieldRow } from "@/components/forms/fields";
import { login, type AuthActionState } from "@/app/auth/actions";

const initialState: AuthActionState = {};

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="next" value={next} />

      <FieldRow>
        <Label required>Email</Label>
        <TextInput name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </FieldRow>

      <FieldRow>
        <Label required>Пароль</Label>
        <TextInput name="password" type="password" required autoComplete="current-password" />
      </FieldRow>

      {state?.error && (
        <p className="mb-4 border border-rose/40 bg-rose/5 px-3 py-2 text-xs text-rose">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 border border-term-600 bg-term-900/30 px-4 py-2 text-sm text-term-300 transition-colors hover:bg-term-900/50 disabled:opacity-50"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
        Увійти
      </button>

      <p className="mt-4 text-center text-xs text-muted">
        Немає акаунта?{" "}
        <Link href="/signup" className="text-term-400 hover:text-term-300">
          Зареєструватися
        </Link>
      </p>
    </form>
  );
}
