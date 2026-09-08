import { NextResponse } from "next/server";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { deleteCommandGroup, updateCommandGroup } from "@/lib/commands";
import type { CommandGroupInput } from "@/lib/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Потрібен вхід." }, { status: 401 });
  try {
    const { id } = await params;
    const commandGroup = await updateCommandGroup(await createClient(), id, (await request.json()) as CommandGroupInput);
    return NextResponse.json(commandGroup);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Не вдалося оновити команди." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Потрібен вхід." }, { status: 401 });
  try {
    const { id } = await params;
    await deleteCommandGroup(await createClient(), id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Не вдалося видалити команди." }, { status: 400 });
  }
}
