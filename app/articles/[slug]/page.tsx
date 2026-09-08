import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getArticleBySlug } from "@/lib/articles";
import { getToolById } from "@/lib/tools";
import { getCommandGroupById } from "@/lib/commands";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import BookmarkButton from "@/components/ui/BookmarkButton";
import TableOfContents from "@/components/articles/TableOfContents";
import ArticleActions from "@/components/articles/ArticleActions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const article = await getArticleBySlug(supabase, slug);
    return { title: `${article.title} — cyberdocs`, description: article.description };
  } catch {
    return { title: "Статтю не знайдено — cyberdocs" };
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  let article;
  try {
    article = await getArticleBySlug(supabase, slug);
  } catch {
    notFound();
  }

  const relatedTools = (
    await Promise.all((article.relatedTools || []).map((id) => getToolById(supabase, id)))
  ).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const relatedCommands = (
    await Promise.all((article.relatedCommands || []).map((id) => getCommandGroupById(supabase, id)))
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_220px]">
      <article>
        <Link href="/articles" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
          <ArrowLeft size={14} /> усі статті
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-term-500">{article.category}</span>
          <span className="text-line2">/</span>
          <DifficultyBadge level={article.difficulty} />
          {article.source === "custom" && (
            <span className="border border-line2 px-1.5 py-0.5 text-[10px] text-muted">додано вручну</span>
          )}
          <span className="ml-auto flex items-center gap-2">
            {article.source === "custom" && <ArticleActions slug={article.slug} />}
            <BookmarkButton slug={article.slug} />
          </span>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-ink sm:text-3xl">{article.title}</h1>
        <p className="mb-4 text-sm text-muted">{article.description}</p>

        <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-line pb-6 text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {article.readTime} хв читання
          </span>
          {article.tags?.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>

        <div className="prose-term" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />

        {(relatedTools.length > 0 || relatedCommands.length > 0) && (
          <div className="mt-10 border-t border-line pt-6">
            <p className="mb-3 text-[11px] text-term-500">$ related</p>
            <div className="flex flex-wrap gap-2">
              {relatedTools.map((t) => (
                <Link
                  key={t.id}
                  href={`/tools#${t.id}`}
                  className="border border-line px-3 py-1.5 text-xs text-muted hover:border-term-600 hover:text-term-300"
                >
                  🛠 {t.name}
                </Link>
              ))}
              {relatedCommands.map((c) => (
                <Link
                  key={c.id}
                  href={`/commands#${c.id}`}
                  className="border border-line px-3 py-1.5 text-xs text-muted hover:border-term-600 hover:text-term-300"
                >
                  ⌘ {c.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <TableOfContents headings={article.headings} />
    </div>
  );
}
