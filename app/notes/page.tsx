import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { getNotesRendered } from "@/lib/notes";
import NoteCard from "@/components/notes/NoteCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Замітки — cyberdocs" };

export default async function NotesPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?next=/notes");

  const supabase = await createClient();
  const notes = await getNotesRendered(supabase);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-xl font-bold text-ink">Замітки</h1>
          <p className="text-sm text-muted">Приватні — бачите тільки ви.</p>
        </div>
        <Link
          href="/new?type=note"
          className="flex shrink-0 items-center gap-1.5 border border-line px-3 py-1.5 text-xs text-muted hover:border-term-600 hover:text-term-300"
        >
          <Plus size={13} /> нова замітка
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="border border-line bg-surface/60 p-8 text-center">
          <p className="mb-2 text-sm text-ink">Поки що немає заміток.</p>
          <Link href="/new?type=note" className="text-xs text-term-400 hover:text-term-300">
            додати першу →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}
