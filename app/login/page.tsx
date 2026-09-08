import LoginForm from "@/components/forms/LoginForm";

export const metadata = { title: "Увійти — cyberdocs" };
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-xl font-bold text-ink">Увійти</h1>
      <p className="mb-6 text-sm text-muted">
        Потрібно для власних заміток та інструментів — статті доступні всім і без входу.
      </p>
      <LoginForm next={next || "/"} />
    </div>
  );
}
