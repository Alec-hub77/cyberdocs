import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getEditableNote } from "@/lib/notes";
import NoteForm from "@/components/forms/NoteForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Редагувати замітку — cyberdocs" };

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const note = await getEditableNote(supabase, id);
  if (!note) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/notes" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
        <ArrowLeft size={14} /> назад до заміток
      </Link>
      <h1 className="mb-1 text-xl font-bold text-ink">Редагувати замітку</h1>
      <p className="mb-6 text-sm text-muted">{note.title}</p>
      <NoteForm initialData={note} mode="edit" />
    </div>
  );
}
