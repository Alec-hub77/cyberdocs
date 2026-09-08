"use client";

import { useEffect, useState } from "react";

const LINES = [
  { prompt: "root@cyberdocs:~$", text: "whoami" },
  { prompt: "", text: "початківець у кібербезпеці, що будує власну базу знань" },
  { prompt: "root@cyberdocs:~$", text: "cat mission.txt" },
  { prompt: "", text: "статті · інструменти · команди · roadmap — в одному місці" },
];

export default function BootSequence() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setVisibleLines(LINES.length);
      return;
    }
    if (visibleLines >= LINES.length) return;
    const currentLine = LINES[visibleLines];
    const fullText = `${currentLine.prompt} ${currentLine.text}`.trim();

    if (charCount < fullText.length) {
      const t = setTimeout(() => setCharCount((c) => c + 1), 18);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setVisibleLines((v) => v + 1);
      setCharCount(0);
    }, 260);
    return () => clearTimeout(t);
  }, [charCount, visibleLines, reduced]);

  return (
    <div className="border border-line2 bg-surface/60 p-4 text-[13px] leading-relaxed shadow-glowSm sm:text-sm">
      {LINES.slice(0, reduced ? LINES.length : visibleLines).map((line, idx) => (
        <Line key={idx} prompt={line.prompt} text={line.text} />
      ))}
      {!reduced && visibleLines < LINES.length && (
        <Line
          prompt={LINES[visibleLines].prompt}
          text={`${LINES[visibleLines].prompt} ${LINES[visibleLines].text}`
            .trim()
            .slice(0, charCount)
            .replace(LINES[visibleLines].prompt, "")
            .trim()}
          caret
        />
      )}
      {(reduced || visibleLines >= LINES.length) && (
        <span className="inline-block h-4 w-2 translate-y-0.5 bg-term-400 animate-blink" />
      )}
    </div>
  );
}

function Line({ prompt, text, caret }: { prompt: string; text: string; caret?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompt && <span className="text-term-500">{prompt}</span>}
      <span className={prompt ? "text-ink" : "text-muted"}>
        {text}
        {caret && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-term-400 animate-blink" />}
      </span>
    </div>
  );
}
