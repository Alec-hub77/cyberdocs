import SignupForm from "@/components/forms/SignupForm";

export const metadata = { title: "Реєстрація — cyberdocs" };
export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-xl font-bold text-ink">Реєстрація</h1>
      <p className="mb-6 text-sm text-muted">
        Один акаунт — свої приватні замітки та інструменти, які більше ніхто не бачить.
      </p>
      <SignupForm />
    </div>
  );
}
