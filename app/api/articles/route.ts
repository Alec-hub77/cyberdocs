import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createArticle } from "@/lib/articles";
import { isAuthorized } from "@/lib/authGuard";
import type { ArticleInput } from "@/lib/types";

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Невірний токен редагування." }, { status: 401 });
  }
  try {
    const body = (await request.json()) as ArticleInput;
    const supabase = await createClient();
    const article = await createArticle(supabase, body);
    return NextResponse.json(article, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Не вдалося зберегти статтю." }, { status: 400 });
  }
}
