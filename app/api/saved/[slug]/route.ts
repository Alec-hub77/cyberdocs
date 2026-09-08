import { NextResponse } from "next/server";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Потрібен вхід, щоб зберігати статті." }, { status: 401 });

  try {
    const { slug } = await params;
    const supabase = await createClient();
    const { error } = await supabase.from("saved_articles").upsert(
      { user_id: user.sub, article_slug: slug },
      { onConflict: "user_id,article_slug" },
    );
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Не вдалося зберегти статтю." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Потрібен вхід." }, { status: 401 });

  try {
    const { slug } = await params;
    const supabase = await createClient();
    const { error } = await supabase.from("saved_articles").delete().eq("article_slug", slug);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Не вдалося прибрати статтю." }, { status: 400 });
  }
}
