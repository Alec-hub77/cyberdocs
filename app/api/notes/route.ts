import { NextResponse } from "next/server";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { createNote } from "@/lib/notes";
import type { NoteInput } from "@/lib/types";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Потрібен вхід, щоб додавати замітки." }, { status: 401 });
  }
  try {
    const body = (await request.json()) as NoteInput;
    const supabase = await createClient();
    const note = await createNote(supabase, user.sub, body);
    return NextResponse.json(note, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "Не вдалося зберегти замітку." }, { status: 400 });
  }
}
