"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { FieldRow, Label, TextInput } from "@/components/forms/fields";
import type { CommandGroup, CommandGroupInput, CommandItem } from "@/lib/types";

export default function CommandForm({ initialData }: { initialData?: CommandGroup }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [tool, setTool] = useState(initialData?.tool || "");
  const [items, setItems] = useState<CommandItem[]>(initialData?.items.length ? initialData.items : [{ cmd: "", desc: "" }]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const updateItem = (index: number, field: keyof CommandItem, value: string) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const payload: CommandGroupInput = { title, tool, items };
      const group = initialData
        ? await apiRequest<CommandGroup>(`/api/commands/${initialData.id}`, { method: "PUT", body: payload })
        : await apiRequest<CommandGroup>("/api/commands", { method: "POST", body: payload });
      router.push(`/commands#${group.id}`);
      router.refresh();
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <FieldRow>
        <Label required>Назва групи</Label>
        <TextInput value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Наприклад, Linux: базові команди" />
      </FieldRow>
      <FieldRow>
        <Label>Інструмент / тема</Label>
        <TextInput value={tool} onChange={(event) => setTool(event.target.value)} placeholder="Наприклад, bash" />
      </FieldRow>

      <div className="mb-5">
        <Label>Команди</Label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="grid gap-2 border border-line p-3 sm:grid-cols-[1fr_1fr_auto]">
              <TextInput value={item.cmd} onChange={(event) => updateItem(index, "cmd", event.target.value)} placeholder="Команда" />
              <TextInput value={item.desc} onChange={(event) => updateItem(index, "desc", event.target.value)} placeholder="Опис" />
              <button
                type="button"
                onClick={() => setItems((current) => current.length > 1 ? current.filter((_, itemIndex) => itemIndex !== index) : [{ cmd: "", desc: "" }])}
                className="border border-line p-2 text-muted hover:border-rose/40 hover:text-rose"
                aria-label="Видалити команду"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((current) => [...current, { cmd: "", desc: "" }])}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-term-400 hover:text-term-300"
        >
          <Plus size={13} /> додати команду
        </button>
      </div>

      {error && <p className="mb-4 border border-rose/40 bg-rose/5 px-3 py-2 text-xs text-rose">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 border border-term-600 bg-term-900/30 px-4 py-2 text-sm text-term-300 hover:bg-term-900/50 disabled:opacity-50"
      >
        {pending && <Loader2 size={15} className="animate-spin" />}
        {initialData ? "зберегти зміни" : "додати групу"}
      </button>
    </form>
  );
}
