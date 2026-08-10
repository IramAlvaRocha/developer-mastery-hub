import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth/AuthContext";
import type { ExpectedAnswer } from "@/lib/answers";
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

// ──────────────────────────────────────────────────────────────────────────
// useAdmin — Fase 7 (Panel admin).
// Capa de datos de administración: los mismos módulos/ejercicios que ve el
// catálogo, pero SIN filtro de `is_published` (el admin ve todo) y con las
// mutaciones CRUD + orden + publicar/despublicar.
//
// • Modo Supabase: RLS `is_admin()` protege SELECT (ve todo) y todas las
//   escrituras. Caché en localStorage `dmh-admin-<uid>` como fallback rápido.
// • Modo demo (sin Supabase): no toca la BD — `isDemoNotice=true` y lista
//   vacía. La UI del panel muestra el aviso.
// • Las mutaciones devuelven `string | null`: null = éxito, string = mensaje
//   de error listo para toast. Nunca se lanza sin capturar y sin console.*.
// ──────────────────────────────────────────────────────────────────────────

const CACHE_PREFIX = "dmh-admin-";

/** Módulo admin: `Module` + flags de publicación y orden. */
export interface AdminModule extends Module {
  isPublished: boolean;
  position: number;
}

/** Ejercicio admin: `Exercise` + flags de publicación y orden. */
export interface AdminExercise extends Exercise {
  isPublished: boolean;
  position: number;
}

/** Payload de creación/edición de un módulo. `key` es PK (solo creación). */
export interface ModuleInput {
  key: string;
  name: string;
  icon: string;
  badge: string;
  color: string;
  group: string;
  description: string;
  topics: string[];
  isPublished: boolean;
}

export type ModulePatch = Partial<Omit<ModuleInput, "key">>;

/** Payload de creación/edición de un ejercicio (columnas ya mapeadas). */
export interface ExerciseInput {
  title: string;
  stars: number;
  category: string;
  step: number | null;
  description: string;
  objective: string;
  tags: string[];
  fileName: string;
  instruction: string | null;
  theory: string | null;
  explanationText: string;
  codeSnippet: string;
  inputs: Record<string, ExpectedAnswer>;
  completeCode: string;
  format: ExerciseFormat | null;
  formatPayload: Record<string, unknown> | null;
  isPublished: boolean;
}

export type ExercisePatch = Partial<ExerciseInput>;

interface CachedAdminState {
  savedAt: number;
  modules: AdminModule[];
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
  is_published: boolean;
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
  is_published: boolean;
}

function readCache(uid: string | null): AdminModule[] | null {
  if (!uid || typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + uid);
    const parsed = raw ? (JSON.parse(raw) as CachedAdminState) : null;
    if (!parsed || !Array.isArray(parsed.modules)) return null;
    return parsed.modules;
  } catch {
    return null;
  }
}

function writeCache(uid: string | null, modules: AdminModule[]) {
  if (!uid || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_PREFIX + uid,
      JSON.stringify({ savedAt: Date.now(), modules }),
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

function exerciseFromRow(row: ExerciseRow): AdminExercise {
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
  return {
    ...deserializeFormat(exercise, row),
    isPublished: row.is_published,
    position: row.position,
  };
}

function moduleFromRow(
  row: ModuleRow,
  exercisesByModule: Map<string, AdminExercise[]>,
): AdminModule {
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
    isPublished: row.is_published,
    position: row.position,
  };
}

export function useAdmin() {
  const { user, isDemoMode } = useAuth();
  const uid = user?.id ?? null;

  const [modules, setModules] = useState<AdminModule[]>([]);
  const [loading, setLoading] = useState<boolean>(() => !isDemoMode);
  const [error, setError] = useState<string | null>(null);
  const [isDemoNotice, setIsDemoNotice] = useState<boolean>(() => isDemoMode);

  const modulesRef = useRef<AdminModule[]>(modules);
  useEffect(() => {
    modulesRef.current = modules;
  }, [modules]);

  const reload = useCallback(async () => {
    if (isDemoMode) {
      setIsDemoNotice(true);
      setModules([]);
      setLoading(false);
      setError(null);
      return;
    }
    const supabase = getSupabase();
    if (!supabase) return;
    setError(null);
    setLoading(true);
    try {
      // El admin ve TODOS los módulos (publicados y no) ordenados por position.
      const { data: moduleRows, error: moduleErr } = await supabase
        .from("modules")
        .select(
          "key,name,icon,badge,color,group,description,topics,position,is_published",
        )
        .order("position");
      if (moduleErr) throw new Error(moduleErr.message);
      const rows = (moduleRows ?? []) as ModuleRow[];
      const keys = rows.map((r) => r.key);

      const exercisesByModule = new Map<string, AdminExercise[]>();
      if (keys.length > 0) {
        const { data: exerciseRows, error: exerciseErr } = await supabase
          .from("exercises")
          .select("*")
          .in("module_key", keys)
          .order("module_key")
          .order("position");
        if (exerciseErr) throw new Error(exerciseErr.message);
        for (const row of (exerciseRows ?? []) as ExerciseRow[]) {
          const list = exercisesByModule.get(row.module_key) ?? [];
          list.push(exerciseFromRow(row));
          exercisesByModule.set(row.module_key, list);
        }
      }

      const next = rows.map((r) => moduleFromRow(r, exercisesByModule));
      setModules(next);
      writeCache(uid, next);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      if (modulesRef.current.length === 0) {
        const cached = readCache(uid);
        if (cached) setModules(cached);
      }
    } finally {
      setLoading(false);
    }
  }, [isDemoMode, uid]);

  useEffect(() => {
    if (isDemoMode) {
      setIsDemoNotice(true);
      setModules([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    const cached = readCache(uid);
    if (cached) setModules(cached);
    void reload();
  }, [isDemoMode, uid, reload]);

  // ──────────────────────────────────────────────────────────────────────
  // Mutaciones de módulos
  // ──────────────────────────────────────────────────────────────────────

  const createModule = useCallback(
    async (input: ModuleInput): Promise<string | null> => {
      if (isDemoMode) return "El panel admin requiere la conexión a Supabase.";
      const supabase = getSupabase();
      if (!supabase) return "Supabase no está configurado.";
      const position =
        modulesRef.current.reduce((max, m) => Math.max(max, m.position), -1) + 1;
      const { error } = await supabase.from("modules").insert({
        key: input.key.trim(),
        name: input.name.trim(),
        icon: input.icon.trim(),
        badge: input.badge.trim(),
        color: input.color,
        group: input.group.trim(),
        description: input.description.trim(),
        topics: input.topics,
        position,
        is_published: input.isPublished,
      });
      if (error) return error.message;
      await reload();
      return null;
    },
    [isDemoMode, reload],
  );

  const updateModule = useCallback(
    async (key: string, patch: ModulePatch): Promise<string | null> => {
      if (isDemoMode) return "El panel admin requiere la conexión a Supabase.";
      const supabase = getSupabase();
      if (!supabase) return "Supabase no está configurado.";
      const data: Record<string, unknown> = {};
      if (patch.name !== undefined) data.name = patch.name.trim();
      if (patch.icon !== undefined) data.icon = patch.icon.trim();
      if (patch.badge !== undefined) data.badge = patch.badge.trim();
      if (patch.color !== undefined) data.color = patch.color;
      if (patch.group !== undefined) data.group = patch.group.trim();
      if (patch.description !== undefined)
        data.description = patch.description.trim();
      if (patch.topics !== undefined) data.topics = patch.topics;
      if (patch.isPublished !== undefined) data.is_published = patch.isPublished;
      const { error } = await supabase
        .from("modules")
        .update(data)
        .eq("key", key);
      if (error) return error.message;
      await reload();
      return null;
    },
    [isDemoMode, reload],
  );

  const deleteModule = useCallback(
    async (key: string): Promise<string | null> => {
      if (isDemoMode) return "El panel admin requiere la conexión a Supabase.";
      const supabase = getSupabase();
      if (!supabase) return "Supabase no está configurado.";
      const { error } = await supabase
        .from("modules")
        .delete()
        .eq("key", key);
      if (error) return error.message;
      await reload();
      return null;
    },
    [isDemoMode, reload],
  );

  const toggleModulePublish = useCallback(
    async (key: string): Promise<string | null> => {
      const module = modulesRef.current.find((m) => m.key === key);
      if (!module) return "Módulo no encontrado.";
      return updateModule(key, { isPublished: !module.isPublished });
    },
    [updateModule],
  );

  const moveModule = useCallback(
    async (key: string, dir: -1 | 1): Promise<string | null> => {
      if (isDemoMode) return "El panel admin requiere la conexión a Supabase.";
      const supabase = getSupabase();
      if (!supabase) return "Supabase no está configurado.";
      const list = [...modulesRef.current].sort(
        (a, b) => a.position - b.position,
      );
      const i = list.findIndex((m) => m.key === key);
      if (i < 0) return "Módulo no encontrado.";
      const j = i + dir;
      if (j < 0 || j >= list.length) return null;
      const a = list[i];
      const b = list[j];
      const { error: errA } = await supabase
        .from("modules")
        .update({ position: b.position })
        .eq("key", a.key);
      if (errA) return errA.message;
      const { error: errB } = await supabase
        .from("modules")
        .update({ position: a.position })
        .eq("key", b.key);
      if (errB) return errB.message;
      await reload();
      return null;
    },
    [isDemoMode, reload],
  );

  // ──────────────────────────────────────────────────────────────────────
  // Mutaciones de ejercicios
  // ──────────────────────────────────────────────────────────────────────

  const createExercise = useCallback(
    async (moduleKey: string, input: ExerciseInput): Promise<string | null> => {
      if (isDemoMode) return "El panel admin requiere la conexión a Supabase.";
      const supabase = getSupabase();
      if (!supabase) return "Supabase no está configurado.";
      const module = modulesRef.current.find((m) => m.key === moduleKey);
      if (!module) return "Módulo no encontrado.";
      const exerciseRef =
        module.exercises.reduce((max, ex) => Math.max(max, ex.id), 0) + 1;
      const position =
        module.exercises.reduce((max, ex) => Math.max(max, ex.position), -1) + 1;
      const { error } = await supabase.from("exercises").insert({
        module_key: moduleKey,
        exercise_ref: exerciseRef,
        title: input.title.trim(),
        stars: input.stars,
        category: input.category.trim(),
        step: input.step,
        description: input.description.trim(),
        objective: input.objective.trim(),
        tags: input.tags,
        file_name: input.fileName.trim(),
        instruction: input.instruction?.trim() || null,
        theory: input.theory?.trim() || null,
        explanation_text: input.explanationText.trim(),
        code_snippet: input.codeSnippet,
        inputs: input.inputs,
        complete_code: input.completeCode.trim(),
        format: input.format,
        format_payload: input.formatPayload,
        position,
        is_published: input.isPublished,
      });
      if (error) return error.message;
      await reload();
      return null;
    },
    [isDemoMode, reload],
  );

  const updateExercise = useCallback(
    async (
      moduleKey: string,
      exerciseRef: number,
      patch: ExercisePatch,
    ): Promise<string | null> => {
      if (isDemoMode) return "El panel admin requiere la conexión a Supabase.";
      const supabase = getSupabase();
      if (!supabase) return "Supabase no está configurado.";
      const data: Record<string, unknown> = {};
      if (patch.title !== undefined) data.title = patch.title.trim();
      if (patch.stars !== undefined) data.stars = patch.stars;
      if (patch.category !== undefined) data.category = patch.category.trim();
      if (patch.step !== undefined) data.step = patch.step;
      if (patch.description !== undefined)
        data.description = patch.description.trim();
      if (patch.objective !== undefined)
        data.objective = patch.objective.trim();
      if (patch.tags !== undefined) data.tags = patch.tags;
      if (patch.fileName !== undefined) data.file_name = patch.fileName.trim();
      if (patch.instruction !== undefined)
        data.instruction = patch.instruction?.trim() || null;
      if (patch.theory !== undefined) data.theory = patch.theory?.trim() || null;
      if (patch.explanationText !== undefined)
        data.explanation_text = patch.explanationText.trim();
      if (patch.codeSnippet !== undefined) data.code_snippet = patch.codeSnippet;
      if (patch.inputs !== undefined) data.inputs = patch.inputs;
      if (patch.completeCode !== undefined)
        data.complete_code = patch.completeCode.trim();
      if (patch.format !== undefined) data.format = patch.format;
      if (patch.formatPayload !== undefined)
        data.format_payload = patch.formatPayload;
      if (patch.isPublished !== undefined) data.is_published = patch.isPublished;
      const { error } = await supabase
        .from("exercises")
        .update(data)
        .eq("module_key", moduleKey)
        .eq("exercise_ref", exerciseRef);
      if (error) return error.message;
      await reload();
      return null;
    },
    [isDemoMode, reload],
  );

  const deleteExercise = useCallback(
    async (moduleKey: string, exerciseRef: number): Promise<string | null> => {
      if (isDemoMode) return "El panel admin requiere la conexión a Supabase.";
      const supabase = getSupabase();
      if (!supabase) return "Supabase no está configurado.";
      const { error } = await supabase
        .from("exercises")
        .delete()
        .eq("module_key", moduleKey)
        .eq("exercise_ref", exerciseRef);
      if (error) return error.message;
      await reload();
      return null;
    },
    [isDemoMode, reload],
  );

  const toggleExercisePublish = useCallback(
    async (
      moduleKey: string,
      exerciseRef: number,
    ): Promise<string | null> => {
      const module = modulesRef.current.find((m) => m.key === moduleKey);
      const exercise = module?.exercises.find((ex) => ex.id === exerciseRef);
      if (!exercise) return "Ejercicio no encontrado.";
      return updateExercise(moduleKey, exerciseRef, {
        isPublished: !exercise.isPublished,
      });
    },
    [updateExercise],
  );

  const moveExercise = useCallback(
    async (
      moduleKey: string,
      exerciseRef: number,
      dir: -1 | 1,
    ): Promise<string | null> => {
      if (isDemoMode) return "El panel admin requiere la conexión a Supabase.";
      const supabase = getSupabase();
      if (!supabase) return "Supabase no está configurado.";
      const module = modulesRef.current.find((m) => m.key === moduleKey);
      if (!module) return "Módulo no encontrado.";
      const list = [...module.exercises].sort(
        (a, b) => a.position - b.position,
      );
      const i = list.findIndex((ex) => ex.id === exerciseRef);
      if (i < 0) return "Ejercicio no encontrado.";
      const j = i + dir;
      if (j < 0 || j >= list.length) return null;
      const a = list[i];
      const b = list[j];
      const { error: errA } = await supabase
        .from("exercises")
        .update({ position: b.position })
        .eq("module_key", moduleKey)
        .eq("exercise_ref", a.id);
      if (errA) return errA.message;
      const { error: errB } = await supabase
        .from("exercises")
        .update({ position: a.position })
        .eq("module_key", moduleKey)
        .eq("exercise_ref", b.id);
      if (errB) return errB.message;
      await reload();
      return null;
    },
    [isDemoMode, reload],
  );

  return {
    modules,
    loading,
    error,
    isDemoNotice,
    reload,
    createModule,
    updateModule,
    deleteModule,
    toggleModulePublish,
    moveModule,
    createExercise,
    updateExercise,
    deleteExercise,
    toggleExercisePublish,
    moveExercise,
  };
}
