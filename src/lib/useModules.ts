import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_MODULES, MODULE_GROUPS } from "@/data";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth/AuthContext";
import type {
  BugHuntExercise,
  ContextDropdownExercise,
  Exercise,
  ExerciseFormat,
  MatchingExercise,
  Module,
  OrderingExercise,
  PredictionExercise,
  ShellScenario,
  SnippetPickExercise,
  TrueFalseExercise,
} from "@/lib/types";
import type { ExpectedAnswer } from "@/lib/answers";

const CACHE_KEY = "dmh-modules-cache";

interface CachedModules {
  savedAt: number;
  modules: Module[];
  groups?: string[];
}

interface ModuleRow {
  key: string;
  name: string;
  icon: string;
  badge: string;
  color: string;
  group: string | null;
  description: string;
  topics: string[] | null;
  position: number;
}

interface ExerciseRow {
  module_key: string;
  exercise_ref: number;
  title: string;
  stars: number;
  category: string;
  step: number | null;
  description: string;
  objective: string;
  tags: string[] | null;
  file_name: string;
  instruction: string | null;
  theory: string | null;
  explanation_text: string;
  code_snippet: string;
  inputs: Record<string, unknown> | null;
  complete_code: string;
  simulation: unknown;
  format: ExerciseFormat | null;
  format_payload: unknown;
  position: number;
}

function deriveGroups(modules: Module[]): string[] {
  return Array.from(new Set(modules.map((m) => m.group || "Otros")));
}

function readCache(): CachedModules | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedModules;
    if (!parsed || !Array.isArray(parsed.modules)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(modules: Module[], groups: string[]) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), modules, groups }),
    );
  } catch {
    /* almacenamiento no disponible */
  }
}

function deserializeFormat(exercise: Exercise, row: ExerciseRow): Exercise {
  if (!row.format) return exercise;
  const payload = row.format_payload as Record<string, unknown> | null;
  if (!payload) return exercise;
  switch (row.format) {
    case "prediction":
      exercise.prediction = payload as unknown as PredictionExercise;
      break;
    case "ordering":
      exercise.ordering = payload as unknown as OrderingExercise;
      break;
    case "snippet-pick":
      exercise.snippetPick = payload as unknown as SnippetPickExercise;
      break;
    case "bug-hunt":
      exercise.bugHunt = payload as unknown as BugHuntExercise;
      break;
    case "matching":
      exercise.matching = payload as unknown as MatchingExercise;
      break;
    case "context-dropdown":
      exercise.contextDropdown = payload as unknown as ContextDropdownExercise;
      break;
    case "true-false":
      exercise.trueFalse = payload as unknown as TrueFalseExercise;
      break;
    default:
      break;
  }
  return exercise;
}

function exerciseFromRow(row: ExerciseRow): Exercise {
  const exercise: Exercise = {
    id: row.exercise_ref,
    title: row.title,
    stars: row.stars,
    category: row.category,
    description: row.description,
    objective: row.objective,
    tags: row.tags ?? [],
    fileName: row.file_name,
    instruction: row.instruction ?? undefined,
    theory: row.theory ?? undefined,
    explanationText: row.explanation_text,
    codeSnippet: row.code_snippet,
    inputs: (row.inputs ?? {}) as Record<string, ExpectedAnswer>,
    completeCode: row.complete_code,
    simulation: (row.simulation as ShellScenario | null) ?? undefined,
    format: row.format ?? undefined,
  };
  if (row.step != null) exercise.step = row.step;
  return deserializeFormat(exercise, row);
}

function moduleFromRow(
  row: ModuleRow,
  exercisesByModule: Map<string, Exercise[]>,
): Module {
  return {
    key: row.key,
    name: row.name,
    icon: row.icon,
    badge: row.badge,
    color: row.color,
    group: row.group ?? "",
    desc: row.description,
    topics: row.topics ?? [],
    exercises: exercisesByModule.get(row.key) ?? [],
  };
}

export function useModules() {
  const { user } = useAuth();
  const supabaseReady = isSupabaseConfigured && !!user;

  const [modules, setModules] = useState<Module[]>(() =>
    isSupabaseConfigured ? [] : ALL_MODULES,
  );
  const [groups, setGroups] = useState<string[]>(() =>
    isSupabaseConfigured ? [] : MODULE_GROUPS,
  );
  const [loading, setLoading] = useState<boolean>(() => isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const modulesRef = useRef(modules);
  useEffect(() => {
    modulesRef.current = modules;
  }, [modules]);

  const load = useCallback(async () => {
    if (!supabaseReady) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setError(null);
    try {
      const { data: moduleRows, error: moduleErr } = await supabase
        .from("modules")
        .select("key,name,icon,badge,color,group,description,topics,position")
        .eq("is_published", true)
        .order("position");

      if (moduleErr) throw new Error(moduleErr.message);
      const rows = (moduleRows ?? []) as ModuleRow[];
      const keys = rows.map((r) => r.key);

      const exercisesByModule = new Map<string, Exercise[]>();
      if (keys.length > 0) {
        const { data: exerciseRows, error: exerciseErr } = await supabase
          .from("exercises")
          .select("*")
          .in("module_key", keys)
          .eq("is_published", true)
          .order("module_key")
          .order("position");

        if (exerciseErr) throw new Error(exerciseErr.message);
        for (const row of (exerciseRows ?? []) as ExerciseRow[]) {
          const list = exercisesByModule.get(row.module_key) ?? [];
          list.push(exerciseFromRow(row));
          exercisesByModule.set(row.module_key, list);
        }
      }

      const next: Module[] = rows.map((r) => moduleFromRow(r, exercisesByModule));
      const nextGroups = deriveGroups(next);
      setModules(next);
      setGroups(nextGroups);
      writeCache(next, nextGroups);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      if (modulesRef.current.length === 0) {
        const cached = readCache();
        if (cached) {
          setModules(cached.modules);
          setGroups(
            cached.groups && cached.groups.length
              ? cached.groups
              : deriveGroups(cached.modules),
          );
        }
      }
    } finally {
      setLoading(false);
    }
  }, [supabaseReady]);

  useEffect(() => {
    if (!supabaseReady) {
      setModules(ALL_MODULES);
      setGroups(MODULE_GROUPS);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    const cached = readCache();
    if (cached) {
      setModules(cached.modules);
      setGroups(
        cached.groups && cached.groups.length
          ? cached.groups
          : deriveGroups(cached.modules),
      );
    }
    void load();
  }, [supabaseReady, load]);

  return { modules, groups, loading, error, reload: load };
}
