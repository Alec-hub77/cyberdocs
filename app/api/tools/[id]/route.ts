import { NextResponse } from "next/server";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { updateTool, deleteCustomTool } from "@/lib/tools";
import type { ToolInput } from "@/lib/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Потрібен вхід." }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = (await request.json()) as ToolInput;
    const supabase = await createClient();
    const tool = await updateTool(supabase, id, body);
    return NextResponse.json(tool);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Не вдалося оновити інструмент." }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Потрібен вхід." }, { status: 401 });
  }
  try {
    const { id } = await params;
    const supabase = await createClient();
    await deleteCustomTool(supabase, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Не вдалося видалити інструмент." }, { status: 400 });
  }
}
