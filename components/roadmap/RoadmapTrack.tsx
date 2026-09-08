"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import ProgressBar from "@/components/ui/ProgressBar";
import type { RoadmapStage } from "@/lib/types";

export default function RoadmapTrack({ roadmap }: { roadmap: RoadmapStage[] }) {
  const { progress, toggleRoadmapItem, percentDone, doneCount, totalItems } = useApp();

  return (
    <div>
      <div className="mb-8 border border-line2 bg-surface p-4 shadow-glowSm">
        <ProgressBar percent={percentDone} label={`виконано ${doneCount} з ${totalItems} пунктів`} />
      </div>

      <div className="relative space-y-6 pl-6">
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-line" aria-hidden />
        {roadmap.map((stage, stageIdx) => {
          const stageDone = stage.items.filter((i) => progress[i.id]).length;
          const stageComplete = stageDone === stage.items.length;
          return (
            <section key={stage.id} className="relative">
              <span
                className={`absolute -left-6 top-1 flex h-4 w-4 items-center justify-center border text-[10px] ${
                  stageComplete ? "border-term-500 bg-term-500 text-void" : "border-line2 bg-void text-muted"
                }`}
              >
                {stageComplete ? <Check size={11} /> : stageIdx + 1}
              </span>

              <div className="border border-line bg-surface/60">
                <div className="border-b border-line px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-bold text-ink">{stage.title}</h2>
                    <span className="shrink-0 text-[11px] text-muted">
                      {stageDone}/{stage.items.length}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{stage.description}</p>
                </div>
                <ul className="divide-y divide-line">
                  {stage.items.map((item) => {
                    const checked = !!progress[item.id];
                    return (
                      <li key={item.id} className="flex items-start gap-3 px-4 py-3">
                        <button
                          onClick={() => toggleRoadmapItem(item.id)}
                          aria-pressed={checked}
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                            checked ? "border-term-500 bg-term-500 text-void" : "border-line2 text-transparent"
                          }`}
                        >
                          <Check size={11} />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm ${checked ? "text-muted line-through" : "text-ink"}`}>
                            {item.title}
                          </p>
                          {item.article && (
                            <Link
                              href={`/articles/${item.article}`}
                              className="mt-1 inline-block text-xs text-term-400 hover:text-term-300"
                            >
                              читати статтю →
                            </Link>
                          )}
                          {item.tool && (
                            <Link
                              href={`/tools#${item.tool}`}
                              className="mt-1 inline-block text-xs text-term-400 hover:text-term-300"
                            >
                              переглянути інструмент →
                            </Link>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
