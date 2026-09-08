"use client";

import { useMemo, useState } from "react";
import ArticleCard from "./ArticleCard";
import Tag from "@/components/ui/Tag";
import type { ArticleMeta, Difficulty } from "@/lib/types";

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: "beginner", label: "початковий" },
  { id: "intermediate", label: "середній" },
  { id: "advanced", label: "просунутий" },
];

export default function ArticleList({ articles }: { articles: ArticleMeta[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | null>(null);
  const [query, setQuery] = useState("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [articles]);

  const filtered = articles.filter((a) => {
    if (activeTag && !a.tags?.includes(activeTag)) return false;
    if (activeDifficulty && a.difficulty !== activeDifficulty) return false;
    if (query && !`${a.title} ${a.description}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-5 space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="фільтрувати за назвою…"
          className="w-full border border-line bg-surface px-3 py-2 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-term-600"
        />
        <div className="flex flex-wrap gap-1.5">
          {DIFFICULTIES.map((d) => (
            <Tag
              key={d.id}
              active={activeDifficulty === d.id}
              onClick={() => setActiveDifficulty(activeDifficulty === d.id ? null : d.id)}
            >
              {d.label}
            </Tag>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <Tag key={tag} active={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}>
              #{tag}
            </Tag>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="border border-line bg-surface/60 p-6 text-center text-sm text-muted">
          Немає статей за цим фільтром.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
