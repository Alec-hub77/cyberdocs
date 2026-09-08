"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, Plus, Trash2 } from "lucide-react";
import { Label, TextInput, Select, FieldRow } from "./fields";
import CategorySelect from "./CategorySelect";
import { apiRequest } from "@/lib/api-client";
import type { EditableTool, Difficulty, CommandItem, Tool } from "@/lib/types";

interface ToolFormState {
  name: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  site: string;
  tags: string | string[];
  useCase: string;
}

interface ToolFormProps {
  categories: string[];
  initialData?: EditableTool;
  mode?: "create" | "edit";
}

export default function ToolForm({ categories, initialData, mode = "create" }: ToolFormProps) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const [form, setForm] = useState<ToolFormState>(
    initialData
      ? {
          name: initialData.name,
          category: initialData.category,
          difficulty: initialData.difficulty,
          summary: initialData.summary,
          site: initialData.site,
          tags: initialData.tags,
          useCase: initialData.useCase,
        }
      : {
          name: "",
          category: categories[0] || "",
          difficulty: "beginner",
          summary: "",
          site: "",
          tags: "",
          useCase: "",
        }
  );
  const [commands, setCommands] = useState<CommandItem[]>(
    initialData?.commands?.length ? initialData.commands : [{ cmd: "", desc: "" }]
  );
  const [status, setStatus] = useState<{ loading: boolean; error: string }>({ loading: false, error: "" });

  function update<K extends keyof ToolFormState>(field: K, value: ToolFormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateCommand(idx: number, field: keyof CommandItem, value: string) {
    setCommands((list) => list.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  }

  function addCommand() {
    setCommands((list) => [...list, { cmd: "", desc: "" }]);
  }

  function removeCommand(idx: number) {
    setCommands((list) => list.filter((_, i) => i !== idx));
  }

  const tagsValue = Array.isArray(form.tags) ? form.tags.join(", ") : form.tags;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ loading: true, error: "" });
    try {
      const payload = {
        ...form,
        tags: tagsValue.split(",").map((t) => t.trim()).filter(Boolean),
        commands: commands.filter((c) => c.cmd.trim()),
      };
      const data = isEdit
        ? await apiRequest<Tool>(`/api/tools/${initialData!.id}`, { method: "PUT", body: payload })
        : await apiRequest<Tool>("/api/tools", { method: "POST", body: payload });
      router.push(`/tools#${data.id}`);
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
        <Label required>Назва інструмента</Label>
        <TextInput
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Напр. Gobuster"
        />
      </FieldRow>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <CategorySelect required value={form.category} onChange={(v) => update("category", v)} options={categories} />
        <div>
          <Label>Складність</Label>
          <Select value={form.difficulty} onChange={(e) => update("difficulty", e.target.value as Difficulty)}>
            <option value="beginner">початковий</option>
            <option value="intermediate">середній</option>
            <option value="advanced">просунутий</option>
          </Select>
        </div>
      </div>

      <FieldRow>
        <Label>Короткий опис</Label>
        <TextInput
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="Що робить інструмент, одним реченням"
        />
      </FieldRow>

      <FieldRow>
        <Label>Для чого використовувати</Label>
        <TextInput
          value={form.useCase}
          onChange={(e) => update("useCase", e.target.value)}
          placeholder="Конкретний сценарій застосування"
        />
      </FieldRow>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <Label>Офіційний сайт</Label>
          <TextInput value={form.site} onChange={(e) => update("site", e.target.value)} placeholder="https://…" />
        </div>
        <div>
          <Label>Теги (через кому)</Label>
          <TextInput value={tagsValue} onChange={(e) => update("tags", e.target.value)} placeholder="recon, web" />
        </div>
      </div>

      <div className="mb-6">
        <Label>Команди цього інструмента</Label>
        <div className="space-y-2">
          {commands.map((c, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={c.cmd}
                onChange={(e) => updateCommand(idx, "cmd", e.target.value)}
                placeholder="nmap -sV target"
                className="w-2/5 border border-line bg-void px-3 py-2 font-mono text-xs text-term-300 outline-none placeholder:text-muted/50 focus:border-term-600"
              />
              <input
                value={c.desc}
                onChange={(e) => updateCommand(idx, "desc", e.target.value)}
                placeholder="Що робить ця команда"
                className="flex-1 border border-line bg-void px-3 py-2 text-xs text-ink outline-none placeholder:text-muted/50 focus:border-term-600"
              />
              <button
                type="button"
                onClick={() => removeCommand(idx)}
                className="shrink-0 border border-line px-2 text-muted hover:border-rose/40 hover:text-rose"
                aria-label="Видалити рядок"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCommand}
          className="mt-2 flex items-center gap-1.5 text-xs text-term-400 hover:text-term-300"
        >
          <Plus size={13} /> додати команду
        </button>
      </div>

      {status.error && (
        <p className="mb-4 border border-rose/40 bg-rose/5 px-3 py-2 text-xs text-rose">{status.error}</p>
      )}

      <button
        type="submit"
        disabled={status.loading}
        className="flex items-center gap-2 border border-term-600 bg-term-900/30 px-4 py-2 text-sm text-term-300 transition-colors hover:bg-term-900/50 disabled:opacity-50"
      >
        {status.loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        {isEdit ? "Зберегти зміни" : "Додати інструмент"}
      </button>
    </form>
  );
}
