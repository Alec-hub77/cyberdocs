/**
 * If ADMIN_TOKEN is set in the environment, POST/PUT/DELETE requests must
 * include a matching "x-admin-token" header. If it's not set, writes are
 * open — fine for local development, but set ADMIN_TOKEN before exposing
 * the site publicly.
 */
export function isAuthorized(request: Request): boolean {
  const required = process.env.ADMIN_TOKEN;
  if (!required) return true;
  const provided = request.headers.get("x-admin-token");
  return provided === required;
}

export function isProtectionEnabled(): boolean {
  return Boolean(process.env.ADMIN_TOKEN);
}
