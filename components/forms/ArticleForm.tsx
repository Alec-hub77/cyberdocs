"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { Label, TextInput, TextArea, Select, FieldRow } from "./fields";
import CategorySelect from "./CategorySelect";
import AdminTokenField, { useAdminToken } from "./AdminTokenField";
import { apiRequest } from "@/lib/api-client";
import type { EditableArticle, Difficulty, ArticleMeta } from "@/lib/types";

const PLACEHOLDER = `## Заголовок розділу

Текст статті у Markdown. Підтримуються списки, **жирний текст**, \`код\`,
таблиці та блоки коду.

- пункт списку
- ще один пункт
`;

interface ArticleFormState {
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  tags: string | string[];
  content: string;
}

interface ArticleFormProps {
  categories: string[];
  initialData?: EditableArticle;
  mode?: "create" | "edit";
}

export default function ArticleForm({ categories, initialData, mode = "create" }: ArticleFormProps) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const [token, setToken] = useAdminToken();
  const [form, setForm] = useState<ArticleFormState>(
    initialData || {
      title: "",
      description: "",
      category: categories[0] || "",
      difficulty: "beginner",
      tags: "",
      content: "",
    }
  );
  const [status, setStatus] = useState<{ loading: boolean; error: string }>({ loading: false, error: "" });

  function update<K extends keyof ArticleFormState>(field: K, value: ArticleFormState[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ loading: true, error: "" });
    try {
      const payload = {
        ...form,
        tags: Array.isArray(form.tags) ? form.tags : form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const data = isEdit
        ? await apiRequest<ArticleMeta>(`/api/articles/${initialData!.slug}`, { method: "PUT", token, body: payload })
        : await apiRequest<ArticleMeta>("/api/articles", { method: "POST", token, body: payload });
      router.push(`/articles/${data.slug}`);
      router.refresh();
    } catch (err) {
      setStatus({ loading: false, error: (err as Error).message });
      return;
    }
    setStatus({ loading: false, error: "" });
  }

  const tagsValue = Array.isArray(form.tags) ? form.tags.join(", ") : form.tags;

  return (
    <form onSubmit={handleSubmit}>
      <AdminTokenField token={token} setToken={setToken} />

      <FieldRow>
        <Label required>Назва</Label>
        <TextInput
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Напр. Основи SQL Injection"
        />
      </FieldRow>

      <FieldRow>
        <Label>Короткий опис</Label>
        <TextInput
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Одне речення для картки й пошуку"
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
        <Label>Теги (через кому)</Label>
        <TextInput value={tagsValue} onChange={(e) => update("tags", e.target.value)} placeholder="sql, injection, web" />
      </FieldRow>

      <FieldRow>
        <Label required>Текст статті (Markdown)</Label>
        <TextArea
          required
          rows={14}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          placeholder={PLACEHOLDER}
        />
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
        {isEdit ? "Зберегти зміни" : "Опублікувати статтю"}
      </button>
    </form>
  );
}
