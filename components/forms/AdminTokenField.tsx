"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { KeyRound } from "lucide-react";

export function useAdminToken(): [string, (next: string | ((prev: string) => string)) => void] {
  const [token, setToken] = useLocalStorage<string>("cyberdocs:admin-token", "");
  return [token, setToken];
}

interface AdminTokenFieldProps {
  token: string;
  setToken: (next: string) => void;
}

export default function AdminTokenField({ token, setToken }: AdminTokenFieldProps) {
  return (
    <div className="mb-6 flex items-center gap-2 border border-line bg-surface/60 px-3 py-2">
      <KeyRound size={14} className="shrink-0 text-term-500" />
      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        type="password"
        placeholder="токен редагування (якщо налаштований ADMIN_TOKEN)"
        className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted/60"
      />
    </div>
  );
}
