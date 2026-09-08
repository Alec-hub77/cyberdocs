import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateArticle, deleteCustomArticle } from "@/lib/articles";
import { isAuthorized } from "@/lib/authGuard";
import type { ArticleInput } from "@/lib/types";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Невірний токен редагування." }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const body = (await request.json()) as ArticleInput;
    const supabase = await createClient();
    const article = await updateArticle(supabase, slug, body);
    return NextResponse.json(article);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Не вдалося оновити статтю." }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Невірний токен редагування." }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const supabase = await createClient();
    await deleteCustomArticle(supabase, slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Не вдалося видалити статтю." }, { status: 400 });
  }
}
