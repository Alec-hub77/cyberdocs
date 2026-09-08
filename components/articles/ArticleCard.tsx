"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Pencil } from "lucide-react";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import BookmarkButton from "@/components/ui/BookmarkButton";
import ConfirmDeleteButton from "@/components/ui/ConfirmDeleteButton";
import { useAdminToken } from "@/components/forms/AdminTokenField";
import { apiRequest } from "@/lib/api-client";
import type { ArticleMeta } from "@/lib/types";

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const router = useRouter();
  const [token] = useAdminToken();

  async function handleDelete() {
    try {
      await apiRequest(`/api/articles/${article.slug}`, { method: "DELETE", token });
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div className="group relative border border-line bg-surface/60 p-4 transition-colors hover:border-line2">
      <Link href={`/articles/${article.slug}`} className="block pr-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-term-500">{article.category}</span>
          <span className="text-line2">/</span>
          <DifficultyBadge level={article.difficulty} />
          {article.source === "custom" && (
            <span className="border border-line2 px-1.5 py-0.5 text-[10px] text-muted">додано вручну</span>
          )}
        </div>
        <h3 className="mb-1.5 text-[15px] font-bold text-ink group-hover:text-term-300">{article.title}</h3>
        <p className="mb-3 text-sm leading-relaxed text-muted line-clamp-2">{article.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {article.readTime} хв читання
          </span>
          {article.tags?.slice(0, 3).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </Link>
      <div className="absolute right-4 top-4 flex flex-col items-end gap-1.5">
        <BookmarkButton slug={article.slug} />
        {article.source === "custom" && (
          <>
            <Link
              href={`/articles/${article.slug}/edit`}
              onClick={(e) => e.stopPropagation()}
              aria-label="Редагувати статтю"
              className="border border-line p-1.5 text-muted transition-colors hover:border-term-600 hover:text-term-400"
            >
              <Pencil size={14} />
            </Link>
            <ConfirmDeleteButton onConfirm={handleDelete} label="Видалити статтю" />
          </>
        )}
      </div>
    </div>
  );
}
