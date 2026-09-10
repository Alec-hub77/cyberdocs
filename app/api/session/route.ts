import { NextResponse } from "next/server";
import { createClient, getAuthenticatedUser } from "@/lib/supabase/server";
import { getSavedArticleSlugs } from "@/lib/saved";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ user: null, bookmarks: [] });

  const bookmarks = await getSavedArticleSlugs(await createClient()).catch(() => []);
  return NextResponse.json({ user, bookmarks });
}
