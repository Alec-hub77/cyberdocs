import { NextResponse } from "next/server";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { createTool } from "@/lib/tools";
import type { ToolInput } from "@/lib/types";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Потрібен вхід, щоб додавати інструменти." }, { status: 401 });
  }
  try {
    const body = (await request.json()) as ToolInput;
    const supabase = await createClient();
    const tool = await createTool(supabase, user.sub, body);
    return NextResponse.json(tool, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Не вдалося зберегти інструмент." }, { status: 400 });
  }
}
