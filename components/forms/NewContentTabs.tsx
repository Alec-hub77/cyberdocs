"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Wrench, StickyNote, LogIn } from "lucide-react";
import ArticleForm from "@/components/forms/ArticleForm";
import ToolForm from "@/components/forms/ToolForm";
import NoteForm from "@/components/forms/NoteForm";
import type { AuthUser } from "@/lib/types";

type TabId = "article" | "tool" | "note";

interface NewContentTabsProps {
  articleCategories: string[];
  toolCategories: string[];
  initialTab?: TabId;
  user: AuthUser | null;
}

const TABS: { id: TabId; label: string; icon: typeof FileText; needsAuth: boolean }[] = [
  { id: "article", label: "стаття", icon: FileText, needsAuth: false },
  { id: "tool", label: "інструмент", icon: Wrench, needsAuth: true },
  { id: "note", label: "замітка", icon: StickyNote, needsAuth: true },
];

export default function NewContentTabs({ articleCategories, toolCategories, initialTab = "article", user }: NewContentTabsProps) {
  const [active, setActive] = useState<TabId>(initialTab);

  return (
    <div>
      <div className="mb-6 flex border border-line">
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                isActive ? "bg-raised text-term-300" : "text-muted hover:text-ink"
              } ${idx !== 0 ? "border-l border-line" : ""}`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {active === "article" && <ArticleForm key="article" categories={articleCategories} />}

      {active === "tool" &&
        (user ? (
          <ToolForm key="tool" categories={toolCategories} />
        ) : (
          <LoginPrompt next="/new?type=tool" />
        ))}

      {active === "note" && (user ? <NoteForm key="note" /> : <LoginPrompt next="/new?type=note" />)}
    </div>
  );
}

function LoginPrompt({ next }: { next: string }) {
  return (
    <div className="flex items-start gap-3 border border-line bg-surface/60 p-5">
      <LogIn size={18} className="mt-0.5 shrink-0 text-term-500" />
      <div>
        <p className="mb-1 text-sm text-ink">Потрібен вхід</p>
        <p className="mb-3 text-xs text-muted">
          Інструменти й замітки приватні — бачите тільки ви. Увійдіть або зареєструйтесь, щоб додати свій.
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="inline-flex items-center gap-1.5 border border-term-600 bg-term-900/30 px-3 py-1.5 text-xs text-term-300 hover:bg-term-900/50"
        >
          Увійти
        </Link>
      </div>
    </div>
  );
}
