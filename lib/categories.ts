import type { SupabaseClient } from "@supabase/supabase-js";
import { getAllArticlesMeta } from "./articles";
import { getAllTools } from "./tools";

const DEFAULT_ARTICLE_CATEGORIES = [
  "Основи",
  "Мережі",
  "Linux",
  "Розвідка",
  "Веб-безпека",
  "Людський фактор",
  "Захисна сторона",
  "Нотатки",
];

const DEFAULT_TOOL_CATEGORIES = [
  "Дистрибутив",
  "Сканування мережі",
  "Аналіз трафіку",
  "Веб-безпека",
  "Фреймворк експлуатації",
  "OSINT",
  "Криптографія",
  "Blue team / SIEM",
  "Інше",
];

function mergeSorted(defaults: string[], existing: string[]): string[] {
  return Array.from(new Set([...defaults, ...existing])).sort((a, b) => a.localeCompare(b, "uk"));
}

export async function getArticleCategories(supabase: SupabaseClient): Promise<string[]> {
  const articles = await getAllArticlesMeta(supabase);
  const existing = articles.map((a) => a.category).filter(Boolean);
  return mergeSorted(DEFAULT_ARTICLE_CATEGORIES, existing);
}

export async function getToolCategories(supabase: SupabaseClient): Promise<string[]> {
  const tools = await getAllTools(supabase);
  const existing = tools.map((t) => t.category).filter(Boolean);
  return mergeSorted(DEFAULT_TOOL_CATEGORIES, existing);
}
