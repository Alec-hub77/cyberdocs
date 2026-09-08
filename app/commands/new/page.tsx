import CommandForm from "@/components/forms/CommandForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Додати команди — cyberdocs" };

export default function NewCommandGroupPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-xl font-bold text-ink">Додати команди</h1>
      <p className="mb-6 text-sm text-muted">Ця група буде видна лише у вашому акаунті.</p>
      <CommandForm />
    </div>
  );
}
