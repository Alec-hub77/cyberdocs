import { NextResponse } from "next/server";
import { getAllArticlesMeta } from "@/lib/articles";
import { getAllCommandGroups } from "@/lib/commands";
import { getAllNotes } from "@/lib/notes";
import { buildSearchIndex } from "@/lib/search";
import { getAuthenticatedUser, createClient } from "@/lib/supabase/server";
import { getAllTools } from "@/lib/tools";

/** Loads the full index only after the visitor opens the search dialog. */
export async function GET() {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUser();
    const articles = await getAllArticlesMeta(supabase);

    if (!user) return NextResponse.json({ entries: buildSearchIndex({ articles, tools: [], commandGroups: [] }) });

    const [tools, commandGroups, notes] = await Promise.all([
      getAllTools(supabase),
      getAllCommandGroups(supabase),
      getAllNotes(supabase),
    ]);
    return NextResponse.json({ entries: buildSearchIndex({ articles, tools, commandGroups, notes }) });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}
