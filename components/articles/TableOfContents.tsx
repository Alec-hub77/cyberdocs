"use client";

import type { Heading } from "@/lib/types";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  if (!headings || headings.length === 0) return null;

  return (
    <nav className="sticky top-20 hidden border border-line bg-surface/60 p-4 text-sm lg:block">
      <p className="mb-2 text-[11px] text-term-500">$ table_of_contents</p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a href={`#${h.id}`} className="block truncate text-xs text-muted transition-colors hover:text-term-300">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
