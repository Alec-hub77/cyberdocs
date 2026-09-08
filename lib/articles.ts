import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { SupabaseClient } from "@supabase/supabase-js";
import { estimateReadTime, renderMarkdown } from "./markdown";
import type { ArticleMeta, ArticleFull, ArticleInput, EditableArticle, Difficulty } from "./types";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

interface ArticleRow {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  article_date: string;
  content: string;
  created_at: string;
  updated_at: string | null;
}

function normalizeDifficulty(value: unknown): Difficulty {
  return DIFFICULTIES.includes(value as Difficulty) ? (value as Difficulty) : "beginner";
}

function readStaticSlugs(): string[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function readStaticArticleRaw(slug: string) {
  const fullPath = path.join(ARTICLES_DIR, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return { data, content };
}

function staticMeta(slug: string): ArticleMeta {
  const { data, content } = readStaticArticleRaw(slug);
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    category: data.category || "Загальне",
    difficulty: normalizeDifficulty(data.difficulty),
    tags: data.tags || [],
    date: data.date || "",
    relatedTools: data.relatedTools || [],
    relatedCommands: data.relatedCommands || [],
    readTime: estimateReadTime(content),
    source: "static",
  };
}

function rowToMeta(row: ArticleRow): ArticleMeta {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description || "",
    category: row.category || "Загальне",
    difficulty: normalizeDifficulty(row.difficulty),
    tags: row.tags || [],
    date: row.article_date || "",
    relatedTools: [],
    relatedCommands: [],
    readTime: estimateReadTime(row.content || ""),
    source: "custom",
  };
}

export function getArticleSlugs(): string[] {
  return readStaticSlugs();
}

export async function getAllArticlesMeta(supabase: SupabaseClient): Promise<ArticleMeta[]> {
  const staticList = readStaticSlugs().map(staticMeta);
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const customList = ((data as ArticleRow[]) || []).map(rowToMeta);
  return [...customList, ...staticList].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticleBySlug(supabase: SupabaseClient, slug: string): Promise<ArticleFull> {
  if (readStaticSlugs().includes(slug)) {
    const { content } = readStaticArticleRaw(slug);
    const { contentHtml, headings } = await renderMarkdown(content);
    return { ...staticMeta(slug), contentHtml, headings };
  }

  const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Article not found");

  const row = data as ArticleRow;
  const { contentHtml, headings } = await renderMarkdown(row.content);
  return { ...rowToMeta(row), contentHtml, headings };
}

export async function getEditableArticle(supabase: SupabaseClient, slug: string): Promise<EditableArticle | null> {
  const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as ArticleRow;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description || "",
    category: row.category || "",
    difficulty: normalizeDifficulty(row.difficulty),
    tags: row.tags || [],
    content: row.content || "",
  };
}

function slugify(title: string): string {
  const translit: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie",
    ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l",
    м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "",
    ю: "iu", я: "ia", "'": "", "’": "",
  };
  const base = title
    .toLowerCase()
    .split("")
    .map((ch) => (ch in translit ? translit[ch] : ch))
    .join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return base || "article";
}

export async function createArticle(supabase: SupabaseClient, input: ArticleInput): Promise<ArticleMeta> {
  const { title, description, category, difficulty, tags, content } = input;
  if (!title || !title.trim()) throw new Error("Потрібна назва статті.");
  if (!content || !content.trim()) throw new Error("Потрібен текст статті.");

  const staticSlugs = readStaticSlugs();
  let slug = slugify(title);
  if (staticSlugs.includes(slug)) slug = `${slug}-2`;

  // Resolve collisions against the DB, retrying with -2, -3, ...
  let attempt = 0;
  let finalSlug = slug;
  while (attempt < 20) {
    const { data: existing } = await supabase.from("articles").select("slug").eq("slug", finalSlug).maybeSingle();
    if (!existing) break;
    attempt += 1;
    finalSlug = `${slug}-${attempt + 1}`;
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({
      slug: finalSlug,
      title: title.trim(),
      description: (description || "").trim(),
      category: (category || "Нотатки").trim(),
      difficulty: normalizeDifficulty(difficulty),
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      content,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message || "Не вдалося зберегти статтю.");
  return rowToMeta(data as ArticleRow);
}

export async function updateArticle(supabase: SupabaseClient, slug: string, input: ArticleInput): Promise<ArticleMeta> {
  const { title, description, category, difficulty, tags, content } = input;
  if (!title || !title.trim()) throw new Error("Потрібна назва статті.");
  if (!content || !content.trim()) throw new Error("Потрібен текст статті.");

  const { data, error } = await supabase
    .from("articles")
    .update({
      title: title.trim(),
      description: (description || "").trim(),
      category: (category || "Нотатки").trim(),
      difficulty: normalizeDifficulty(difficulty),
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Статтю не знайдено.");
  return rowToMeta(data as ArticleRow);
}

export async function deleteCustomArticle(supabase: SupabaseClient, slug: string): Promise<void> {
  const { error } = await supabase.from("articles").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}
