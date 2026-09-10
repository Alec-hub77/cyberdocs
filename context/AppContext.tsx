"use client";

import { createContext, useContext, useEffect, useMemo, ReactNode, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { AuthUser, RoadmapStage } from "@/lib/types";

interface AppContextValue {
  user: AuthUser | null;
  bookmarks: string[];
  toggleBookmark: (slug: string) => Promise<void>;
  isBookmarked: (slug: string) => boolean;
  progress: Record<string, boolean>;
  toggleRoadmapItem: (itemId: string) => void;
  totalItems: number;
  doneCount: number;
  percentDone: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
  roadmap,
}: {
  children: ReactNode;
  roadmap: RoadmapStage[];
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [progress, setProgress] = useLocalStorage<Record<string, boolean>>("cyberdocs:roadmap-progress", {});

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/session", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Не вдалося завантажити сесію.");
        return (await response.json()) as { user: AuthUser | null; bookmarks: string[] };
      })
      .then((session) => {
        if (!cancelled) {
          setUser(session.user);
          setBookmarks(session.bookmarks);
        }
      })
      .catch(() => {
        // The shell remains usable when the optional session request fails.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleBookmark = async (slug: string) => {
    if (!user) throw new Error("Потрібен вхід, щоб зберігати статті.");

    const wasSaved = bookmarks.includes(slug);
    setBookmarks((prev) => (wasSaved ? prev.filter((item) => item !== slug) : [...prev, slug]));
    try {
      const response = await fetch(`/api/saved/${encodeURIComponent(slug)}`, { method: wasSaved ? "DELETE" : "POST" });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Не вдалося оновити закладки.");
      }
    } catch (error) {
      setBookmarks((prev) => (wasSaved ? [...prev, slug] : prev.filter((item) => item !== slug)));
      throw error;
    }
  };

  const isBookmarked = (slug: string) => bookmarks.includes(slug);

  const toggleRoadmapItem = (itemId: string) => {
    setProgress((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const totalItems = useMemo(
    () => (roadmap || []).reduce((sum, stage) => sum + stage.items.length, 0),
    [roadmap]
  );

  const doneCount = useMemo(() => Object.values(progress).filter(Boolean).length, [progress]);

  const percentDone = totalItems > 0 ? Math.round((doneCount / totalItems) * 100) : 0;

  const value: AppContextValue = {
    user,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    progress,
    toggleRoadmapItem,
    totalItems,
    doneCount,
    percentDone,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
