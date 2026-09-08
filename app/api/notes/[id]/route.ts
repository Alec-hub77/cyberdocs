import { NextResponse } from "next/server";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { updateNote, deleteNote } from "@/lib/notes";
import type { NoteInput } from "@/lib/types";

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
    const body = (await request.json()) as NoteInput;
    const supabase = await createClient();
    const note = await updateNote(supabase, id, body);
    return NextResponse.json(note);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Не вдалося оновити замітку." }, { status: 400 });
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
    await deleteNote(supabase, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Не вдалося видалити замітку." }, { status: 400 });
  }
}
