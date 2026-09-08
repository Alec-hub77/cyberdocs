import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a request-scoped Supabase client bound to the current cookies.
 * Must be called fresh on every request (Server Component, Server Action,
 * or Route Handler) — it cannot be reused as a module-level singleton.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component that can't set cookies — safe to
          // ignore as long as the proxy is refreshing the session.
        }
      },
    },
  });
}

/**
 * Returns the currently authenticated user, or null. Uses getClaims(), which
 * verifies the JWT locally without a round-trip to the Auth server — the
 * recommended way to gate pages and data per Supabase's SSR guidance.
 *
 * Never throws: if Supabase isn't configured or is unreachable, this
 * degrades to "not logged in" rather than crashing the page that called it.
 */
export async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    return data?.claims ?? null;
  } catch {
    return null;
  }
}
