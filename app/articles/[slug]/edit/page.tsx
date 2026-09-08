import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getEditableArticle } from "@/lib/articles";
import { getArticleCategories } from "@/lib/categories";
import ArticleForm from "@/components/forms/ArticleForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Редагувати статтю — cyberdocs" };

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const [article, categories] = await Promise.all([
    getEditableArticle(supabase, slug),
    getArticleCategories(supabase),
  ]);

  if (!article) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/articles/${slug}`} className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
        <ArrowLeft size={14} /> назад до статті
      </Link>
      <h1 className="mb-1 text-xl font-bold text-ink">Редагувати статтю</h1>
      <p className="mb-6 text-sm text-muted">{article.title}</p>
      <ArticleForm categories={categories} initialData={article} mode="edit" />
    </div>
  );
}
