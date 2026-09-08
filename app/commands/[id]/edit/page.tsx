import { notFound } from "next/navigation";
import CommandForm from "@/components/forms/CommandForm";
import { createClient } from "@/lib/supabase/server";
import { getEditableCommandGroup } from "@/lib/commands";

export const dynamic = "force-dynamic";
export const metadata = { title: "Редагувати команди — cyberdocs" };

export default async function EditCommandGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = await getEditableCommandGroup(await createClient(), id);
  if (!group) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-xl font-bold text-ink">Редагувати команди</h1>
      <p className="mb-6 text-sm text-muted">{group.title}</p>
      <CommandForm initialData={group} />
    </div>
  );
}
