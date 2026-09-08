"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil } from "lucide-react";
import DifficultyBadge from "@/components/ui/DifficultyBadge";
import CopyButton from "@/components/ui/CopyButton";
import ConfirmDeleteButton from "@/components/ui/ConfirmDeleteButton";
import { apiRequest } from "@/lib/api-client";
import type { Tool } from "@/lib/types";

export default function ToolCard({ tool }: { tool: Tool }) {
  const router = useRouter();

  async function handleDelete() {
    try {
      await apiRequest(`/api/tools/${tool.id}`, { method: "DELETE" });
      router.refresh();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <div id={tool.id} className="scroll-mt-20 border border-line bg-surface/60 p-4 transition-colors hover:border-line2">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-term-500">{tool.category}</span>
        <span className="text-line2">/</span>
        <DifficultyBadge level={tool.difficulty} />
        {tool.source === "custom" && (
          <span className="border border-line2 px-1.5 py-0.5 text-[10px] text-muted">ваш, приватний</span>
        )}
        {tool.source === "custom" && (
          <span className="ml-auto flex items-center gap-1.5">
            <Link
              href={`/tools/${tool.id}/edit`}
              aria-label="Редагувати інструмент"
              className="border border-line p-1.5 text-muted transition-colors hover:border-term-600 hover:text-term-400"
            >
              <Pencil size={13} />
            </Link>
            <ConfirmDeleteButton onConfirm={handleDelete} label="Видалити інструмент" />
          </span>
        )}
      </div>
      <div className="mb-1.5 flex items-center gap-2">
        <h3 className="text-[15px] font-bold text-ink">{tool.name}</h3>
        {tool.site && (
          <a
            href={tool.site}
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-term-400"
            aria-label={`Офіційний сайт ${tool.name}`}
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>
      {tool.summary && <p className="mb-3 text-sm leading-relaxed text-muted">{tool.summary}</p>}
      {tool.useCase && <p className="border-l-2 border-term-800 pl-3 text-xs text-term-300">{tool.useCase}</p>}
      {tool.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
          {tool.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
      )}
      {tool.commands?.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="mb-2 text-[11px] text-term-500">$ команди</p>
          <ul className="space-y-2">
            {tool.commands.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <code className="block break-all text-xs text-term-300">{c.cmd}</code>
                  {c.desc && <p className="mt-0.5 text-[11px] text-muted">{c.desc}</p>}
                </div>
                <CopyButton text={c.cmd} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
