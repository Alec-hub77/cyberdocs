interface ApiRequestOptions {
  method?: string;
  token?: string;
  body?: unknown;
}

export async function apiRequest<T = any>(url: string, { method = "GET", token, body }: ApiRequestOptions = {}): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-admin-token": token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Сталася помилка.");
  }
  return data as T;
}
