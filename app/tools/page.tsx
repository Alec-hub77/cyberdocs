import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { getAllTools } from "@/lib/tools";
import ToolCard from "@/components/tools/ToolCard";
import AuthRequired from "@/components/auth/AuthRequired";

export const metadata = { title: "Інструменти — cyberdocs" };
export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return <AuthRequired title="Інструменти" description="Ваші інструменти та команди доступні лише у вашому акаунті." next="/tools" />;
  }

  const supabase = await createClient();
  const tools = await getAllTools(supabase);
  const categories = Array.from(new Set(tools.map((t) => t.category)));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-xl font-bold text-ink">Інструменти</h1>
      <p className="mb-6 text-sm text-muted">Приватні — бачите та редагуєте лише ви.</p>

      <div className="space-y-8">
        {tools.length === 0 && <p className="text-sm text-muted">Поки що немає інструментів. Додайте перший через «додати матеріал».</p>}
        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <span className="text-term-500">#</span> {cat}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {tools
                .filter((t) => t.category === cat)
                .map((tool) => (
                  <ToolCard key={`${tool.source}-${tool.id}`} tool={tool} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
