import Fuse from "fuse.js";
import type { ArticleMeta, Tool, CommandGroup, Note, SearchEntry } from "./types";

interface BuildSearchIndexArgs {
  articles: ArticleMeta[];
  tools: Tool[];
  commandGroups: CommandGroup[];
  notes?: Note[];
}

// Builds a single flat, searchable index across articles, tools, commands and notes.
export function buildSearchIndex({ articles, tools, commandGroups, notes = [] }: BuildSearchIndexArgs): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const a of articles) {
    entries.push({
      type: "article",
      id: a.slug,
      title: a.title,
      description: a.description,
      href: `/articles/${a.slug}`,
      tags: a.tags,
    });
  }

  for (const t of tools) {
    entries.push({
      type: "tool",
      id: t.id,
      title: t.name,
      description: t.summary,
      href: `/tools#${t.id}`,
      tags: t.tags,
    });
  }

  for (const g of commandGroups) {
    entries.push({
      type: "command",
      id: g.id,
      title: g.title,
      description: g.items.map((i) => i.cmd).join(" "),
      href: `/commands#${g.id}`,
      tags: [g.tool],
    });
  }

  for (const n of notes) {
    entries.push({
      type: "note",
      id: n.id,
      title: n.title,
      description: n.content.slice(0, 140),
      href: `/notes`,
      tags: n.tags,
    });
  }

  return entries;
}

export function createFuse(entries: SearchEntry[]): Fuse<SearchEntry> {
  return new Fuse(entries, {
    keys: [
      { name: "title", weight: 0.5 },
      { name: "description", weight: 0.3 },
      { name: "tags", weight: 0.2 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  });
}
