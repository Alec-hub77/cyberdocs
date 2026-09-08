"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { Label, TextInput, TextArea, FieldRow } from "./fields";
import { apiRequest } from "@/lib/api-client";
import type { EditableNote, Note } from "@/lib/types";

interface NoteFormState {
  title: string;
  content: string;
  tags: string | string[];
}

interface NoteFormProps {
  initialData?: EditableNote;
  mode?: "create" | "edit";
}

export default function NoteForm({ initialData, mode = "create" }: NoteFormProps) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const [form, setForm] = useState<NoteFormState>(initialData || { title: "", content: "", tags: "" });
  const [status, setStatus] = useState<{ loading: boolean; error: string }>({ loading: false, error: "" });

  function update<K extends keyof NoteFormState>(field: K, value: NoteFormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const tagsValue = Array.isArray(form.tags) ? form.tags.join(", ") : form.tags;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ loading: true, error: "" });
    try {
      const payload = { ...form, tags: tagsValue.split(",").map((t) => t.trim()).filter(Boolean) };
      isEdit
        ? await apiRequest<Note>(`/api/notes/${initialData!.id}`, { method: "PUT", body: payload })
        : await apiRequest<Note>("/api/notes", { method: "POST", body: payload });
      router.push("/notes");
      router.refresh();
    } catch (err) {
      setStatus({ loading: false, error: (err as Error).message });
      return;
    }
    setStatus({ loading: false, error: "" });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldRow>
        <Label>Назва (необов&apos;язково)</Label>
        <TextInput
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Швидка думка, посилання, нагадування…"
        />
      </FieldRow>

      <FieldRow>
        <Label required>Текст</Label>
        <TextArea
          required
          rows={8}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          placeholder="Будь-який текст або Markdown — без формальної структури статті."
        />
      </FieldRow>

      <FieldRow>
        <Label>Теги (через кому)</Label>
        <TextInput value={tagsValue} onChange={(e) => update("tags", e.target.value)} placeholder="ідея, посилання" />
      </FieldRow>

      {status.error && (
        <p className="mb-4 border border-rose/40 bg-rose/5 px-3 py-2 text-xs text-rose">{status.error}</p>
      )}

      <button
        type="submit"
        disabled={status.loading}
        className="flex items-center gap-2 border border-term-600 bg-term-900/30 px-4 py-2 text-sm text-term-300 transition-colors hover:bg-term-900/50 disabled:opacity-50"
      >
        {status.loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        {isEdit ? "Зберегти зміни" : "Зберегти замітку"}
      </button>
    </form>
  );
}
