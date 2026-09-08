import LoginForm from "@/components/forms/LoginForm";

interface AuthRequiredProps {
  title: string;
  description: string;
  next: string;
}

/** Keeps private routes in the normal app shell while offering sign-in in place. */
export default function AuthRequired({ title, description, next }: AuthRequiredProps) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 text-xl font-bold text-ink">{title}</h1>
      <p className="mb-6 text-sm text-muted">{description}</p>
      <div className="border border-line bg-surface/60 p-5">
        <p className="mb-4 text-sm text-term-300">Увійдіть, щоб відкрити цей приватний розділ.</p>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
