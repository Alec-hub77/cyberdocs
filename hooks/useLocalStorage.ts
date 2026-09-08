"use client";

import { useEffect, useState, useCallback, Dispatch, SetStateAction } from "react";

type Updater<T> = T | ((prev: T) => T);

/**
 * A useState-like hook that persists its value to localStorage.
 * Safe for SSR: reads from localStorage only after mount.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (next: Updater<T>) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw));
      }
    } catch {
      // Ignore malformed data, fall back to initialValue.
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: Updater<T>) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage may be unavailable (private mode, quota) — fail silently.
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, update, hydrated];
}
