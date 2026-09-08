import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getEditableTool } from "@/lib/tools";
import { getToolCategories } from "@/lib/categories";
import ToolForm from "@/components/forms/ToolForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Редагувати інструмент — cyberdocs" };

export default async function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [tool, categories] = await Promise.all([getEditableTool(supabase, id), getToolCategories(supabase)]);

  if (!tool) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/tools#${id}`} className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
        <ArrowLeft size={14} /> назад до інструментів
      </Link>
      <h1 className="mb-1 text-xl font-bold text-ink">Редагувати інструмент</h1>
      <p className="mb-6 text-sm text-muted">{tool.name}</p>
      <ToolForm categories={categories} initialData={tool} mode="edit" />
    </div>
  );
}
