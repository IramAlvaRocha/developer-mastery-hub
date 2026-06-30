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
    setLastVisitedState(readLast());
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

  // ── Backup: exportar / importar progreso (JSON) ─────────────────────────
  const exportProgress = useCallback((): string => {
    return JSON.stringify(
      {
        app: "developer-mastery-hub",
        version: 1,
        exportedAt: new Date().toISOString(),
        progress,
        lastVisited,
      },
      null,
      2,
    );
  }, [progress, lastVisited]);

  /**
   * Importa un backup. Fusiona (union) los ids completados por modulo para no
   * perder el progreso existente. Devuelve true si el archivo era valido.
   */
  const importProgress = useCallback((raw: string): boolean => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return false;
    }
    const incoming = (parsed as { progress?: unknown })?.progress;
    if (!incoming || typeof incoming !== "object") return false;

    setProgress((prev) => {
      const merged: ProgressMap = { ...prev };
      for (const [key, value] of Object.entries(incoming as ProgressMap)) {
        if (!Array.isArray(value)) continue;
        const ids = value.filter(
          (n): n is number => typeof n === "number" && Number.isFinite(n),
        );
        const union = Array.from(new Set([...(merged[key] ?? []), ...ids]));
        merged[key] = union;
        try {
          localStorage.setItem(PREFIX + key, JSON.stringify(union));
        } catch {
          /* storage no disponible */
        }
      }
      return merged;
    });

    const last = (parsed as { lastVisited?: LastVisited }).lastVisited;
    if (last && typeof last.key === "string" && typeof last.index === "number") {
      setLastVisitedState(last);
      try {
        localStorage.setItem(LAST_KEY, JSON.stringify(last));
      } catch {
        /* storage no disponible */
      }
    }
    return true;
  }, []);

  return {
    progress,
    isCompleted,
    markComplete,
    getPercent,
    lastVisited,
    setLastVisited,
    exportProgress,
    importProgress,
  };
}
