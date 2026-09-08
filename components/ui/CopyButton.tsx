"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Копіювати команду"
      className={`shrink-0 border border-line p-1.5 text-muted transition-colors hover:border-term-600 hover:text-term-400 ${className}`}
    >
      {copied ? <Check size={14} className="text-term-400" /> : <Copy size={14} />}
    </button>
  );
}
