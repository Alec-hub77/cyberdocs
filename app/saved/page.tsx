import { createClient } from "@/lib/supabase/server";
import { getAllArticlesMeta } from "@/lib/articles";
import SavedArticles from "@/components/articles/SavedArticles";

export const metadata = { title: "Збережене — cyberdocs" };
export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const supabase = await createClient();
  const articles = await getAllArticlesMeta(supabase);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-xl font-bold text-ink">Збережене</h1>
      <p className="mb-6 text-sm text-muted">
        Статті, додані в закладки. Зберігається локально, тільки у цьому браузері.
      </p>
      <SavedArticles articles={articles} />
    </div>
  );
}
