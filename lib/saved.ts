import type { SupabaseClient } from "@supabase/supabase-js";

export async function getSavedArticleSlugs(supabase: SupabaseClient): Promise<string[]> {
  const { data, error } = await supabase.from("saved_articles").select("article_slug");
  if (error) throw new Error(error.message);
  return (data || []).map((row) => row.article_slug as string);
}
