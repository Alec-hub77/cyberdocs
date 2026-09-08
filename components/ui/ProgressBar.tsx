interface ProgressBarProps {
  percent: number;
  label?: string;
}

export default function ProgressBar({ percent, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted">
          <span>{label}</span>
          <span className="text-term-400">{percent}%</span>
        </div>
      )}
      <div className="h-1.5 w-full border border-line bg-void">
        <div className="h-full bg-term-500 transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
