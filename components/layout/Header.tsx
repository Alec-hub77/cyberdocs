"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import SearchOverlay from "@/components/ui/SearchOverlay";
import type { SearchEntry } from "@/lib/types";

const TITLES: Record<string, string> = {
  "/": "dashboard",
  "/roadmap": "roadmap",
  "/articles": "articles",
  "/tools": "tools",
  "/commands": "commands",
  "/notes": "notes",
  "/saved": "saved",
  "/new": "new",
  "/login": "login",
  "/signup": "signup",
};

interface HeaderProps {
  onMenuClick: () => void;
  searchEntries: SearchEntry[];
}

export default function Header({ onMenuClick, searchEntries }: HeaderProps) {
  const pathname = usePathname();
  const base = "/" + (pathname.split("/")[1] || "");
  const title = TITLES[base] ?? TITLES[pathname] ?? "";

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-void/90 px-4 py-3 backdrop-blur sm:px-6">
      <button onClick={onMenuClick} className="text-muted lg:hidden">
        <Menu size={20} />
      </button>
      <p className="hidden shrink-0 text-xs text-muted sm:block">
        <span className="text-term-500">~</span>
        {title ? `/${title}` : ""}
      </p>
      <div className="ml-auto w-full max-w-xs">
        <SearchOverlay entries={searchEntries} />
      </div>
    </header>
  );
}
