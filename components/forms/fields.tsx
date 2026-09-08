import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-muted">
      {children} {required && <span className="text-rose">*</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-line bg-void px-3 py-2 text-sm text-ink outline-none placeholder:text-muted/50 focus:border-term-600 ${
        props.className || ""
      }`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-y border border-line bg-void px-3 py-2 font-mono text-sm leading-relaxed text-ink outline-none placeholder:text-muted/50 focus:border-term-600 ${
        props.className || ""
      }`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full border border-line bg-void px-3 py-2 text-sm text-ink outline-none focus:border-term-600 ${
        props.className || ""
      }`}
    >
      {props.children}
    </select>
  );
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}
