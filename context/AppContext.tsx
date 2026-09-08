"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { RoadmapStage } from "@/lib/types";

interface AppContextValue {
  bookmarks: string[];
  toggleBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  progress: Record<string, boolean>;
  toggleRoadmapItem: (itemId: string) => void;
  totalItems: number;
  doneCount: number;
  percentDone: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children, roadmap }: { children: ReactNode; roadmap: RoadmapStage[] }) {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>("cyberdocs:bookmarks", []);
  const [progress, setProgress] = useLocalStorage<Record<string, boolean>>("cyberdocs:roadmap-progress", {});

  const toggleBookmark = (slug: string) => {
    setBookmarks((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
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
