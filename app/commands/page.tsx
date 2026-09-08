import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { getAllCommandGroups } from "@/lib/commands";
import CommandGroup from "@/components/commands/CommandGroup";
import AuthRequired from "@/components/auth/AuthRequired";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Команди — cyberdocs" };
export const dynamic = "force-dynamic";

export default async function CommandsPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return <AuthRequired title="Команди" description="Команди ваших інструментів доступні лише після входу." next="/commands" />;
  }

  const supabase = await createClient();
  const groups = await getAllCommandGroups(supabase);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-xl font-bold text-ink">Команди</h1>
          <p className="text-sm text-muted">Ваші особисті групи команд. Клікніть на іконку, щоб скопіювати рядок у буфер обміну.</p>
        </div>
        <Link href="/commands/new" className="flex shrink-0 items-center gap-1.5 border border-term-600 px-3 py-1.5 text-xs text-term-300 hover:bg-term-900/30">
          <Plus size={13} /> додати
        </Link>
      </div>
      <div className="space-y-6">
        {groups.length === 0 && <p className="text-sm text-muted">Додайте команди до інструмента, щоб вони з’явилися тут.</p>}
        {groups.map((g) => (
          <CommandGroup key={g.id} group={g} />
        ))}
      </div>
    </div>
  );
}
