"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Pencil } from "lucide-react";
import ConfirmDeleteButton from "@/components/ui/ConfirmDeleteButton";
import { apiRequest } from "@/lib/api-client";
import type { NoteRendered } from "@/lib/types";

export default function NoteCard({ note }: { note: NoteRendered }) {
  const router = useRouter();

  async function handleDelete() {
    try {
      await apiRequest(`/api/notes/${note.id}`, { method: "DELETE" });
      router.refresh();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  const date = new Date(note.createdAt);

  return (
    <div className="border border-line bg-surface/60 p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-ink">{note.title}</h3>
        <span className="flex shrink-0 items-center gap-1.5">
          <Link
            href={`/notes/${note.id}/edit`}
            aria-label="Редагувати замітку"
            className="border border-line p-1.5 text-muted transition-colors hover:border-term-600 hover:text-term-400"
          >
            <Pencil size={13} />
          </Link>
          <ConfirmDeleteButton onConfirm={handleDelete} label="Видалити замітку" />
        </span>
      </div>
      <div className="prose-term mb-3 text-sm" dangerouslySetInnerHTML={{ __html: note.contentHtml }} />
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted">
        <span className="flex items-center gap-1">
          <Clock size={12} /> {date.toLocaleDateString("uk-UA")}
        </span>
        {note.tags?.map((t) => (
          <span key={t}>#{t}</span>
        ))}
      </div>
    </div>
  );
}
