"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { RoadmapStage } from "@/lib/types";

export default function ContinueRoadmap({ roadmap }: { roadmap: RoadmapStage[] }) {
  const { progress } = useApp();

  const nextStage = roadmap.find((stage) => stage.items.some((item) => !progress[item.id]));

  if (!nextStage) {
    return (
      <div className="border border-term-800 bg-term-900/20 p-5">
        <p className="text-sm text-term-300">
          Усі етапи roadmap позначені виконаними. Час повторити практику або додати власні статті.
        </p>
      </div>
    );
  }

  const nextItem = nextStage.items.find((item) => !progress[item.id])!;
  const doneInStage = nextStage.items.filter((item) => progress[item.id]).length;

  return (
    <Link
      href="/roadmap"
      className="group block border border-line2 bg-surface p-5 shadow-glowSm transition-colors hover:border-term-600"
    >
      <p className="mb-1 text-[11px] text-muted">
        етап {doneInStage}/{nextStage.items.length} · продовжити
      </p>
      <h3 className="mb-1.5 text-base font-bold text-ink">{nextStage.title}</h3>
      <p className="mb-3 flex items-center gap-2 text-sm text-term-300">
        {nextItem.title}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </p>
      <p className="text-xs text-muted">{nextStage.description}</p>
    </Link>
  );
}
