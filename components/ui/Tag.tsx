import { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function Tag({ children, active = false, onClick }: TagProps) {
  const Component = onClick ? "button" : "span";
  return (
    <Component
      onClick={onClick}
      className={`border px-2 py-0.5 text-[11px] transition-colors ${
        active
          ? "border-term-500 bg-term-900/60 text-term-200"
          : "border-line text-muted hover:border-line2 hover:text-ink"
      }`}
    >
      {children}
    </Component>
  );
}
