import CopyButton from "@/components/ui/CopyButton";
import type { CommandGroup as CommandGroupType } from "@/lib/types";

export default function CommandGroup({ group }: { group: CommandGroupType }) {
  return (
    <section id={group.id} className="scroll-mt-20 border border-line bg-surface/60">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="text-sm font-bold text-ink">{group.title}</h2>
        <span className="text-[11px] text-term-500">{group.tool}</span>
      </div>
      <ul className="divide-y divide-line">
        {group.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <code className="block break-all text-[13px] text-term-300">{item.cmd}</code>
              <p className="mt-1 text-xs text-muted">{item.desc}</p>
            </div>
            <CopyButton text={item.cmd} />
          </li>
        ))}
      </ul>
    </section>
  );
}
