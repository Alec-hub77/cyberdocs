import { createClient } from "@/lib/supabase/server";
import { getAllCommandGroups } from "@/lib/commands";
import CommandGroup from "@/components/commands/CommandGroup";

export const metadata = { title: "Команди — cyberdocs" };
export const dynamic = "force-dynamic";

export default async function CommandsPage() {
  const supabase = await createClient();
  const groups = await getAllCommandGroups(supabase);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-xl font-bold text-ink">Команди</h1>
      <p className="mb-6 text-sm text-muted">
        Шпаргалка з командами. Клікніть на іконку, щоб скопіювати рядок у буфер обміну.
      </p>
      <div className="space-y-6">
        {groups.map((g) => (
          <CommandGroup key={g.id} group={g} />
        ))}
      </div>
    </div>
  );
}
