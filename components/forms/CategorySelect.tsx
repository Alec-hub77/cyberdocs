"use client";

import { useState } from "react";
import { Label, TextInput, Select } from "./fields";

const CUSTOM_VALUE = "__custom__";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label?: string;
  required?: boolean;
}

export default function CategorySelect({ value, onChange, options, label = "Категорія", required }: CategorySelectProps) {
  const [customMode, setCustomMode] = useState(false);
  const knownOptions = value && !options.includes(value) ? [...options, value] : options;

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (v === CUSTOM_VALUE) {
      setCustomMode(true);
      onChange("");
    } else {
      onChange(v);
    }
  }

  return (
    <div>
      <Label required={required}>{label}</Label>
      {customMode ? (
        <div className="flex gap-2">
          <TextInput
            autoFocus
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Назва нової категорії"
          />
          <button
            type="button"
            onClick={() => setCustomMode(false)}
            className="shrink-0 border border-line px-2 text-xs text-muted hover:border-line2 hover:text-ink"
          >
            зі списку
          </button>
        </div>
      ) : (
        <Select value={value} onChange={handleSelectChange} required={required}>
          <option value="" disabled>
            — оберіть —
          </option>
          {knownOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value={CUSTOM_VALUE}>+ Додати нову категорію…</option>
        </Select>
      )}
    </div>
  );
}
