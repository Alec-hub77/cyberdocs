import type { Difficulty } from "@/lib/types";

const LABELS: Record<Difficulty, { text: string; color: string }> = {
  beginner: { text: "початковий", color: "text-term-400 border-term-800" },
  intermediate: { text: "середній", color: "text-amber border-amber/40" },
  advanced: { text: "просунутий", color: "text-rose border-rose/40" },
};

export default function DifficultyBadge({ level }: { level: Difficulty }) {
  const meta = LABELS[level] || LABELS.beginner;
  return <span className={`border px-2 py-0.5 text-[11px] ${meta.color}`}>{meta.text}</span>;
}
