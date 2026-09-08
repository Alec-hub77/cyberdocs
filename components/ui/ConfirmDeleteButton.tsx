"use client";

import { useState, MouseEvent } from "react";
import { Trash2, Check, X, Loader2 } from "lucide-react";

interface ConfirmDeleteButtonProps {
  onConfirm: () => Promise<void> | void;
  label?: string;
  size?: number;
  className?: string;
}

export default function ConfirmDeleteButton({
  onConfirm,
  label = "Видалити",
  size = 13,
  className = "",
}: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleConfirm}
          disabled={pending}
          aria-label="Підтвердити видалення"
          className="border border-rose/50 p-1.5 text-rose transition-colors hover:bg-rose/10 disabled:opacity-50"
        >
          {pending ? <Loader2 size={size} className="animate-spin" /> : <Check size={size} />}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setConfirming(false);
          }}
          aria-label="Скасувати"
          className="border border-line p-1.5 text-muted transition-colors hover:text-ink"
        >
          <X size={size} />
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirming(true);
      }}
      aria-label={label}
      className={`border border-line p-1.5 text-muted transition-colors hover:border-rose/40 hover:text-rose ${className}`}
    >
      <Trash2 size={size} />
    </button>
  );
}
