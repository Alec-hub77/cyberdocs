import ArticleList from "@/components/articles/ArticleList";
import { createClient } from "@/lib/supabase/server";
import { getAllArticlesMeta } from "@/lib/articles";

export const metadata = { title: "Статті — cyberdocs" };
export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const supabase = await createClient();
  const articles = await getAllArticlesMeta(supabase);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-xl font-bold text-ink">Статті</h1>
      <p className="mb-6 text-sm text-muted">
        Конспекти тем із тегами та рівнем складності. {articles.length} матеріалів. Публічні — доступні всім,
        без входу.
      </p>
      <ArticleList articles={articles} />
    </div>
  );
}
