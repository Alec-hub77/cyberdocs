"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <AlertTriangle size={28} className="mx-auto mb-4 text-rose" />
      <p className="mb-2 text-term-500">$ curl status</p>
      <p className="mb-2 text-sm text-rose">Не вдалося завантажити дані.</p>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => reset()}
          className="flex items-center gap-1.5 border border-term-600 bg-term-900/30 px-4 py-2 text-sm text-term-300 hover:bg-term-900/50"
        >
          <RotateCw size={14} /> спробувати ще раз
        </button>
        <Link href="/" className="border border-line px-4 py-2 text-sm text-ink hover:border-term-600">
          cd ~
        </Link>
      </div>
    </div>
  );
}
