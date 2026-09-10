import type { SupabaseClient } from "@supabase/supabase-js";
import { getUserTools } from "./tools";
import { uniqueSlug } from "./slugify";
import type { CommandGroup, CommandGroupInput, CommandItem, Tool } from "./types";

interface CommandGroupRow {
  id: string;
  title: string;
  tool: string;
  items: CommandGroup["items"];
}

function cleanItems(items: CommandItem[] | undefined): CommandItem[] {
  return Array.isArray(items)
    ? items.filter((item) => item?.cmd?.trim()).map((item) => ({ cmd: item.cmd.trim(), desc: (item.desc || "").trim() }))
    : [];
}

export async function getAllCommandGroups(supabase: SupabaseClient, knownTools?: Tool[]): Promise<CommandGroup[]> {
  const groupsRequest = supabase.from("command_groups").select("id, title, tool, items").order("created_at", { ascending: false });
  const [{ data, error }, userTools] = await Promise.all([
    groupsRequest,
    knownTools ? Promise.resolve(knownTools) : getUserTools(supabase),
  ]);
  if (error) throw new Error(error.message);

  const savedGroups: CommandGroup[] = ((data as CommandGroupRow[]) || []).map((group) => ({
    ...group,
    items: Array.isArray(group.items) ? group.items : [],
    source: "custom",
    editable: true,
  }));
  const toolGroups: CommandGroup[] = userTools
    .filter((t) => t.commands.length > 0)
    .map((t) => ({
      id: t.id,
      title: `${t.name}: команди`,
      tool: t.name,
      items: t.commands,
      source: "custom",
      editable: false,
    }));
  return [...savedGroups, ...toolGroups];
}

export async function getEditableCommandGroup(supabase: SupabaseClient, id: string): Promise<CommandGroup | null> {
  const { data, error } = await supabase.from("command_groups").select("id, title, tool, items").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const group = data as CommandGroupRow;
  return { ...group, items: Array.isArray(group.items) ? group.items : [], source: "custom", editable: true };
}

export async function createCommandGroup(
  supabase: SupabaseClient,
  userId: string,
  input: CommandGroupInput,
): Promise<CommandGroup> {
  if (!input.title?.trim()) throw new Error("Потрібна назва групи команд.");
  const existing = await getAllCommandGroups(supabase);
  const id = uniqueSlug(input.title, existing.filter((group) => group.editable).map((group) => group.id));
  const { data, error } = await supabase
    .from("command_groups")
    .insert({ id, user_id: userId, title: input.title.trim(), tool: input.tool.trim() || "Інше", items: cleanItems(input.items) })
    .select("id, title, tool, items")
    .single();
  if (error) throw new Error(error.message);
  const group = data as CommandGroupRow;
  return { ...group, items: Array.isArray(group.items) ? group.items : [], source: "custom", editable: true };
}

export async function updateCommandGroup(
  supabase: SupabaseClient,
  id: string,
  input: CommandGroupInput,
): Promise<CommandGroup> {
  if (!input.title?.trim()) throw new Error("Потрібна назва групи команд.");
  const { data, error } = await supabase
    .from("command_groups")
    .update({ title: input.title.trim(), tool: input.tool.trim() || "Інше", items: cleanItems(input.items), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, title, tool, items")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Групу команд не знайдено.");
  const group = data as CommandGroupRow;
  return { ...group, items: Array.isArray(group.items) ? group.items : [], source: "custom", editable: true };
}

export async function deleteCommandGroup(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("command_groups").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getCommandGroupById(supabase: SupabaseClient, id: string): Promise<CommandGroup | null> {
  const all = await getAllCommandGroups(supabase);
  return all.find((c) => c.id === id) || null;
}
