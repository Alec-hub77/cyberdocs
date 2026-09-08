import NewContentTabs from "@/components/forms/NewContentTabs";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { getArticleCategories, getToolCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";
export const metadata = { title: "Додати матеріал — cyberdocs" };

type TabId = "article" | "tool" | "note";
const VALID_TABS: TabId[] = ["article", "tool", "note"];

export default async function NewContentPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const supabase = await createClient();
  const [articleCategories, toolCategories, user] = await Promise.all([
    getArticleCategories(supabase),
    getToolCategories(supabase),
    getAuthenticatedUser(),
  ]);
  const initialTab: TabId = VALID_TABS.includes(type as TabId) ? (type as TabId) : "article";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-xl font-bold text-ink">Додати матеріал</h1>
      <p className="mb-6 text-sm text-muted">
        Статті — публічні й одразу видні всім. Інструменти та замітки — приватні, потребують входу.
      </p>
      <NewContentTabs
        articleCategories={articleCategories}
        toolCategories={toolCategories}
        initialTab={initialTab}
        user={user}
      />
    </div>
  );
}
