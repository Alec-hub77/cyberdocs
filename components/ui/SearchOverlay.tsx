"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Wrench, Terminal as TerminalIcon, StickyNote, CornerDownLeft } from "lucide-react";
import { createFuse } from "@/lib/search";
import type { SearchEntry, SearchEntryType } from "@/lib/types";

const TYPE_META: Record<SearchEntryType, { label: string; icon: typeof FileText }> = {
  article: { label: "стаття", icon: FileText },
  tool: { label: "інструмент", icon: Wrench },
  command: { label: "команди", icon: TerminalIcon },
  note: { label: "замітка", icon: StickyNote },
};

export default function SearchOverlay({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = useMemo(() => createFuse(entries), [entries]);

  const results = useMemo(() => {
    if (!query.trim()) return entries.slice(0, 8);
    return fuse.search(query, { limit: 8 }).map((r) => r.item);
  }, [query, fuse, entries]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) go(results[activeIndex].href);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-2 border border-line bg-surface px-3 py-2 text-left text-sm text-muted transition-colors hover:border-line2 hover:text-ink"
      >
        <Search size={15} className="shrink-0 text-term-500" />
        <span className="hidden sm:inline">пошук по сайту…</span>
        <span className="sm:hidden">пошук…</span>
        <kbd className="ml-auto hidden shrink-0 border border-line bg-void px-1.5 py-0.5 text-[10px] text-muted sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-void/80 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl border border-line2 bg-surface shadow-glow animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="text-term-500">$</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="grep -r 'nmap' ./content"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
              />
            </div>
            <ul className="max-h-[50vh] overflow-y-auto py-1">
              {results.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-muted">
                  Нічого не знайдено. Спробуйте інший запит.
                </li>
              )}
              {results.map((r, idx) => {
                const meta = TYPE_META[r.type];
                const Icon = meta.icon;
                return (
                  <li key={`${r.type}-${r.id}`}>
                    <button
                      onClick={() => go(r.href)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm ${
                        idx === activeIndex ? "bg-raised" : ""
                      }`}
                    >
                      <Icon size={15} className="mt-0.5 shrink-0 text-term-500" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-ink">{r.title}</span>
                        <span className="block truncate text-xs text-muted">{r.description}</span>
                      </span>
                      <span className="shrink-0 text-[10px] uppercase text-muted">{meta.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[11px] text-muted">
              <span className="flex items-center gap-1">
                <CornerDownLeft size={12} /> відкрити
              </span>
              <span>↑↓ навігація</span>
              <span className="ml-auto">esc закрити</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
