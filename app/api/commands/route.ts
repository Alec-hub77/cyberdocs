import { NextResponse } from "next/server";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { createCommandGroup } from "@/lib/commands";
import type { CommandGroupInput } from "@/lib/types";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Потрібен вхід." }, { status: 401 });
  try {
    const commandGroup = await createCommandGroup(await createClient(), user.sub, (await request.json()) as CommandGroupInput);
    return NextResponse.json(commandGroup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Не вдалося зберегти команди." }, { status: 400 });
  }
}
