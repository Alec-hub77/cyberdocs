import type { SupabaseClient } from "@supabase/supabase-js";
import { renderMarkdown } from "./markdown";
import type { Note, NoteRendered, EditableNote, NoteInput } from "./types";

interface NoteRow {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string | null;
}

function rowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    tags: row.tags || [],
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : undefined,
  };
}

export async function getAllNotes(supabase: SupabaseClient): Promise<Note[]> {
  const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data as NoteRow[]) || []).map(rowToNote);
}

export async function getNotesRendered(supabase: SupabaseClient): Promise<NoteRendered[]> {
  const notes = await getAllNotes(supabase);
  return Promise.all(
    notes.map(async (n) => {
      const { contentHtml } = await renderMarkdown(n.content);
      return { ...n, contentHtml };
    })
  );
}

export async function getEditableNote(supabase: SupabaseClient, id: string): Promise<EditableNote | null> {
  const { data, error } = await supabase.from("notes").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as NoteRow;
  return { id: row.id, title: row.title || "", content: row.content || "", tags: row.tags || [] };
}

export async function createNote(supabase: SupabaseClient, userId: string, input: NoteInput): Promise<Note> {
  const { title, content, tags } = input;
  if (!content || !content.trim()) throw new Error("Замітка не може бути порожньою.");

  const id = `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const { data, error } = await supabase
    .from("notes")
    .insert({
      id,
      user_id: userId,
      title: (title || "").trim() || "Без назви",
      content: content.trim(),
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message || "Не вдалося зберегти замітку.");
  return rowToNote(data as NoteRow);
}

export async function updateNote(supabase: SupabaseClient, id: string, input: NoteInput): Promise<Note> {
  const { title, content, tags } = input;
  if (!content || !content.trim()) throw new Error("Замітка не може бути порожньою.");

  const { data, error } = await supabase
    .from("notes")
    .update({
      title: (title || "").trim() || "Без назви",
      content: content.trim(),
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Замітку не знайдено.");
  return rowToNote(data as NoteRow);
}

export async function deleteNote(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
