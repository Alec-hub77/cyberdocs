import fs from "fs";
import path from "path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { uniqueSlug } from "./slugify";
import type { Tool, EditableTool, ToolInput, CommandItem, Difficulty } from "./types";

const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];

interface ToolRow {
  id: string;
  user_id: string;
  name: string;
  category: string;
  difficulty: string;
  summary: string;
  site: string;
  tags: string[];
  use_case: string;
  commands: CommandItem[];
  created_at: string;
  updated_at: string | null;
}

function normalizeDifficulty(value: unknown): Difficulty {
  return DIFFICULTIES.includes(value as Difficulty) ? (value as Difficulty) : "beginner";
}

function rowToTool(row: ToolRow): Tool {
  return {
    id: row.id,
    name: row.name,
    category: row.category || "Інше",
    difficulty: normalizeDifficulty(row.difficulty),
    summary: row.summary || "",
    site: row.site || "",
    tags: row.tags || [],
    useCase: row.use_case || "",
    commands: row.commands || [],
    source: "custom",
    createdAt: row.created_at ? new Date(row.created_at).getTime() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : undefined,
  };
}

function readStaticTools(): Tool[] {
  const filePath = path.join(process.cwd(), "content", "tools", "tools.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as Omit<Tool, "source">[];
  return parsed.map((t) => ({ ...t, commands: t.commands || [], source: "static" as const }));
}

function cleanCommands(commands: CommandItem[] | undefined): CommandItem[] {
  return Array.isArray(commands)
    ? commands
        .filter((c) => c && c.cmd && c.cmd.trim())
        .map((c) => ({ cmd: c.cmd.trim(), desc: (c.desc || "").trim() }))
    : [];
}

/** The current user's own tools. Empty for anonymous visitors — RLS enforces this. */
export async function getUserTools(supabase: SupabaseClient): Promise<Tool[]> {
  const { data, error } = await supabase.from("tools").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data as ToolRow[]) || []).map(rowToTool);
}

/** Static reference tools (visible to everyone) plus the current user's own, if logged in. */
export async function getAllTools(supabase: SupabaseClient): Promise<Tool[]> {
  const staticList = readStaticTools();
  const customList = await getUserTools(supabase);
  return [...customList, ...staticList];
}

export async function getToolById(supabase: SupabaseClient, id: string): Promise<Tool | null> {
  const all = await getAllTools(supabase);
  return all.find((t) => t.id === id) || null;
}

export async function getEditableTool(supabase: SupabaseClient, id: string): Promise<EditableTool | null> {
  const { data, error } = await supabase.from("tools").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as ToolRow;
  return {
    id: row.id,
    name: row.name,
    category: row.category || "",
    difficulty: normalizeDifficulty(row.difficulty),
    summary: row.summary || "",
    site: row.site || "",
    tags: row.tags || [],
    useCase: row.use_case || "",
    commands: row.commands?.length ? row.commands : [{ cmd: "", desc: "" }],
  };
}

export async function createTool(supabase: SupabaseClient, userId: string, input: ToolInput): Promise<Tool> {
  const { name, category, difficulty, summary, site, tags, useCase, commands } = input;
  if (!name || !name.trim()) throw new Error("Потрібна назва інструмента.");

  const existing = await getUserTools(supabase);
  const id = uniqueSlug(name, existing.map((t) => t.id));

  const { data, error } = await supabase
    .from("tools")
    .insert({
      id,
      user_id: userId,
      name: name.trim(),
      category: (category || "Інше").trim(),
      difficulty: normalizeDifficulty(difficulty),
      summary: (summary || "").trim(),
      site: (site || "").trim(),
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      use_case: (useCase || "").trim(),
      commands: cleanCommands(commands),
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message || "Не вдалося зберегти інструмент.");
  return rowToTool(data as ToolRow);
}

export async function updateTool(supabase: SupabaseClient, id: string, input: ToolInput): Promise<Tool> {
  const { name, category, difficulty, summary, site, tags, useCase, commands } = input;
  if (!name || !name.trim()) throw new Error("Потрібна назва інструмента.");

  const { data, error } = await supabase
    .from("tools")
    .update({
      name: name.trim(),
      category: (category || "Інше").trim(),
      difficulty: normalizeDifficulty(difficulty),
      summary: (summary || "").trim(),
      site: (site || "").trim(),
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      use_case: (useCase || "").trim(),
      commands: cleanCommands(commands),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Інструмент не знайдено.");
  return rowToTool(data as ToolRow);
}

export async function deleteCustomTool(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
