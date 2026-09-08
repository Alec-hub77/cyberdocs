"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function BookmarkButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { isBookmarked, toggleBookmark } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const active = isBookmarked(slug);

  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          await toggleBookmark(slug);
        } catch (error) {
          if ((error as Error).message.startsWith("Потрібен вхід")) {
            router.push(`/login?next=${encodeURIComponent(pathname)}`);
            return;
          }
          alert((error as Error).message);
        }
      }}
      aria-pressed={active}
      aria-label={active ? "Прибрати з закладок" : "Додати в закладки"}
      className={`shrink-0 border p-1.5 transition-colors ${
        active ? "border-term-500 text-term-400" : "border-line text-muted hover:border-line2 hover:text-ink"
      } ${className}`}
    >
      {active ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
    </button>
  );
}
