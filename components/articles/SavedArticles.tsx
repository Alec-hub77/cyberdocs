"use client";

import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { useApp } from "@/context/AppContext";
import type { ArticleMeta } from "@/lib/types";

export default function SavedArticles({ articles }: { articles: ArticleMeta[] }) {
  const { bookmarks } = useApp();
  const saved = articles.filter((a) => bookmarks.includes(a.slug));

  if (saved.length === 0) {
    return (
      <div className="border border-line bg-surface/60 p-8 text-center">
        <p className="mb-2 text-sm text-ink">Поки що порожньо.</p>
        <p className="text-xs text-muted">Натисніть на іконку закладки біля будь-якої статті, щоб додати її сюди.</p>
        <Link href="/articles" className="mt-4 inline-block text-xs text-term-400 hover:text-term-300">
          перейти до статей →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {saved.map((a) => (
        <ArticleCard key={a.slug} article={a} />
      ))}
    </div>
  );
}
