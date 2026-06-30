import { useCallback, useEffect, useState } from "react";

// ──────────────────────────────────────────────────────────────────────────
// Progreso persistente en localStorage.
// Por modulo guardamos `mastery_hub_${key}` = JSON con los ids completados.
// ──────────────────────────────────────────────────────────────────────────

const PREFIX = "mastery_hub_";
const LAST_KEY = "mastery_hub_last";

type ProgressMap = Record<string, number[]>;

/** Último ejercicio abierto (para "Continuar donde lo dejaste"). */
export interface LastVisited {
  key: string;
  index: number;
  at: number;
}

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

function readLast(): LastVisited | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_KEY);
    return raw ? (JSON.parse(raw) as LastVisited) : null;
  } catch {
    return null;
  }
}

export function useProgress(moduleKeys: string[]) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [lastVisited, setLastVisitedState] = useState<LastVisited | null>(null);

  useEffect(() => {
    setProgress(readAll(moduleKeys));
    setLastVisited(readLast());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLastVisited = useCallback((key: string, index: number) => {
    setLastVisitedState((prev) => {
      if (prev && prev.key === key && prev.index === index) return prev;
      const next: LastVisited = { key, index, at: Date.now() };
      try {
        localStorage.setItem(LAST_KEY, JSON.stringify(next));
      } catch {
        /* storage no disponible */
      }
      return next;
    });
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

  return {
    progress,
    isCompleted,
    markComplete,
    getPercent,
    lastVisited,
    setLastVisited,
  };
}
