import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { getAllArticlesMeta } from "@/lib/articles";
import { getAllTools } from "@/lib/tools";
import { getAllCommandGroups } from "@/lib/commands";
import { getAllNotes } from "@/lib/notes";
import { getSavedArticleSlugs } from "@/lib/saved";
import { getRoadmap } from "@/lib/roadmap";
import { buildSearchIndex } from "@/lib/search";
import type { ArticleMeta, Tool, CommandGroup, Note } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "cyberdocs — база знань з кібербезпеки",
  description:
    "Особиста база знань з кібербезпеки: статті, інструменти, команди та roadmap для навчання.",
};

/**
 * The nav shell (search index) is a nice-to-have, not a hard dependency —
 * if Supabase is unreachable or misconfigured, the whole site (including
 * pages that don't need the database, like /roadmap or /login) should still
 * render instead of crashing behind a single failed fetch in the layout.
 */
async function loadShellData(supabase: Awaited<ReturnType<typeof createClient>>, isAuthenticated: boolean) {
  try {
    const articles = await getAllArticlesMeta(supabase);
    if (!isAuthenticated) {
      return { articles, tools: [] as Tool[], commandGroups: [] as CommandGroup[], notes: [] as Note[] };
    }
    const [tools, commandGroups, notes] = await Promise.all([getAllTools(supabase), getAllCommandGroups(supabase), getAllNotes(supabase)]);
    return { articles, tools, commandGroups, notes };
  } catch {
    return {
      articles: [] as ArticleMeta[],
      tools: [] as Tool[],
      commandGroups: [] as CommandGroup[],
      notes: [] as Note[],
    };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const user = await getAuthenticatedUser();
  const [{ articles, tools, commandGroups, notes }, initialBookmarks] = await Promise.all([
    loadShellData(supabase, Boolean(user)),
    user ? getSavedArticleSlugs(supabase).catch(() => []) : Promise.resolve([]),
  ]);

  const roadmap = getRoadmap();
  const searchEntries = buildSearchIndex({ articles, tools, commandGroups, notes });

  return (
    <html lang="uk">
      <body>
        <AppShell roadmap={roadmap} searchEntries={searchEntries} user={user} initialBookmarks={initialBookmarks}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
