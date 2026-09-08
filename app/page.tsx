import Link from "next/link";
import { FileText, Wrench, SquareTerminal, Map, ArrowRight } from "lucide-react";
import BootSequence from "@/components/ui/BootSequence";
import ArticleCard from "@/components/articles/ArticleCard";
import ContinueRoadmap from "@/components/roadmap/ContinueRoadmap";
import { createClient } from "@/lib/supabase/server";
import { getAllArticlesMeta } from "@/lib/articles";
import { getAllTools } from "@/lib/tools";
import { getAllCommandGroups } from "@/lib/commands";
import { getRoadmap, getRoadmapItemCount } from "@/lib/roadmap";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const [articles, tools, commandGroups] = await Promise.all([
    getAllArticlesMeta(supabase),
    getAllTools(supabase),
    getAllCommandGroups(supabase),
  ]);
  const roadmap = getRoadmap();
  const totalCommands = commandGroups.reduce((s, g) => s + g.items.length, 0);

  const stats = [
    { label: "статей", value: articles.length, href: "/articles", icon: FileText },
    { label: "інструментів", value: tools.length, href: "/tools", icon: Wrench },
    { label: "команд", value: totalCommands, href: "/commands", icon: SquareTerminal },
    { label: "етапів roadmap", value: getRoadmapItemCount(roadmap), href: "/roadmap", icon: Map },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <section>
        <BootSequence />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="border border-line bg-surface/60 p-4 transition-colors hover:border-line2"
            >
              <Icon size={16} className="mb-3 text-term-500" />
              <p className="text-2xl font-bold text-ink">{s.value}</p>
              <p className="text-[11px] text-muted">{s.label}</p>
            </Link>
          );
        })}
      </section>

      <section>
        <SectionHeading title="продовжити навчання" />
        <ContinueRoadmap roadmap={roadmap} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading title="останні статті" noMargin />
          <Link href="/articles" className="flex items-center gap-1 text-xs text-term-400 hover:text-term-300">
            усі статті <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {articles.slice(0, 4).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ title, noMargin }: { title: string; noMargin?: boolean }) {
  return (
    <h2 className={`flex items-center gap-2 text-sm font-bold text-ink ${noMargin ? "" : "mb-3"}`}>
      <span className="text-term-500">#</span>
      {title}
    </h2>
  );
}
