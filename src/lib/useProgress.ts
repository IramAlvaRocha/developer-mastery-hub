import { useCallback, useEffect, useState } from "react";

// ──────────────────────────────────────────────────────────────────────────
// Progreso persistente en localStorage.
// Por modulo guardamos `mastery_hub_${key}` = JSON con los ids completados.
// ──────────────────────────────────────────────────────────────────────────

const PREFIX = "mastery_hub_";

type ProgressMap = Record<string, number[]>;

function readAll(keys: string[]): ProgressMap {
  const map: ProgressMap = {};
  if (typeof localStorage === "undefined") return map;
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      map[key] = raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      map[key] = [];
    }
  }
  return map;
}

export function useProgress(moduleKeys: string[]) {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(readAll(moduleKeys));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCompleted = useCallback(
    (moduleKey: string, exerciseId: number) =>
      progress[moduleKey]?.includes(exerciseId) ?? false,
    [progress],
  );

  const markComplete = useCallback((moduleKey: string, exerciseId: number) => {
    setProgress((prev) => {
      const current = prev[moduleKey] ?? [];
      if (current.includes(exerciseId)) return prev;
      const next = [...current, exerciseId];
      try {
        localStorage.setItem(PREFIX + moduleKey, JSON.stringify(next));
      } catch {
        /* storage no disponible */
      }
      return { ...prev, [moduleKey]: next };
    });
  }, []);

  const getPercent = useCallback(
    (moduleKey: string, total: number) => {
      if (!total) return 0;
      const done = progress[moduleKey]?.length ?? 0;
      return Math.round((done / total) * 100);
    },
    [progress],
  );

  return { progress, isCompleted, markComplete, getPercent };
}
