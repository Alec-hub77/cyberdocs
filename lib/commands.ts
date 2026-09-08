import fs from "fs";
import path from "path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getUserTools } from "./tools";
import type { CommandGroup } from "./types";

function readStaticGroups(): CommandGroup[] {
  const filePath = path.join(process.cwd(), "content", "commands", "commands.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as Omit<CommandGroup, "source">[];
  return parsed.map((g) => ({ ...g, source: "static" as const }));
}

export async function getAllCommandGroups(supabase: SupabaseClient): Promise<CommandGroup[]> {
  const staticGroups = readStaticGroups();
  const userTools = await getUserTools(supabase);
  const toolGroups: CommandGroup[] = userTools
    .filter((t) => t.commands.length > 0)
    .map((t) => ({
      id: t.id,
      title: `${t.name}: команди`,
      tool: t.name,
      items: t.commands,
      source: "custom",
    }));
  return [...toolGroups, ...staticGroups];
}

export async function getCommandGroupById(supabase: SupabaseClient, id: string): Promise<CommandGroup | null> {
  const all = await getAllCommandGroups(supabase);
  return all.find((c) => c.id === id) || null;
}
