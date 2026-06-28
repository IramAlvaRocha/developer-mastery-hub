import { useMemo, useState } from "react";
import type { Module } from "@/lib/types";
import { getApiKey, saveApiKey } from "@/lib/gemini";
import ModuleCard from "./ModuleCard";

interface Props {
  modules: Module[];
  groups: string[];
  getPercent: (key: string, total: number) => number;
  onStart: (key: string) => void;
  onToast: (type: "success" | "error" | "info", message: string) => void;
}

export default function ModuleMenu({
  modules,
  groups,
  getPercent,
  onStart,
  onToast,
}: Props) {
  const [apiKey, setApiKey] = useState(getApiKey());
  const [showKey, setShowKey] = useState(false);
  const [query, setQuery] = useState("");

  function handleSaveKey() {
    saveApiKey(apiKey);
    onToast("success", "Clave de API guardada en localStorage.");
  }

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return modules;
    return modules.filter((m) =>
      [m.name, m.desc, m.group, ...m.topics, ...m.exercises.map((e) => e.title)]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [modules, q]);

  const stats = useMemo(() => {
    const totalExercises = modules.reduce(
      (s, m) => s + m.exercises.length,
      0,
    );
    const weighted = modules.reduce(
      (s, m) => s + getPercent(m.key, m.exercises.length) * m.exercises.length,
      0,
    );
    const overall = totalExercises
      ? Math.round(weighted / totalExercises)
      : 0;
    return { totalModules: modules.length, totalExercises, overall };
  }, [modules, getPercent]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-y-auto px-4 py-8 md:px-8">
      {/* Hero */}
      <div className="animate-fade-in space-y-3 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand">
          Full Stack Senior · .NET + React
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Ruta de Especialización
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted">
          Buenas prácticas de .NET (backend) y React (frontend), más el catálogo
          completo de TypeScript, testing, seguridad, calidad y DevOps. Empieza
          por <span className="font-semibold text-ink">Buenas Prácticas</span>:
          primero el back, luego el front.
        </p>
      </div>

      {/* Stats */}
      <div className="mx-auto mt-6 grid w-full max-w-xl grid-cols-3 gap-3">
        <Stat value={stats.totalModules} label="Módulos" />
        <Stat value={stats.totalExercises} label="Ejercicios" />
        <Stat value={`${stats.overall}%`} label="Progreso" accent />
      </div>

      {/* Buscador + API key */}
      <div className="mx-auto mt-6 w-full max-w-3xl space-y-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Buscar módulo, tema o ejercicio…"
            className="input-field pl-11"
          />
        </div>

        <details className="ui-card group">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-semibold text-ink">
            <span className="flex items-center gap-2">
              <span>⚙️</span> Clave de API de Gemini (opcional)
            </span>
            <span className="text-muted transition-transform group-open:rotate-180">
              ⌄
            </span>
          </summary>
          <div className="space-y-2 border-t border-line px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-grow">
                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type={showKey ? "text" : "password"}
                  placeholder="Pega tu Gemini API Key (AIzaSy...)"
                  className="input-field pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
                >
                  {showKey ? "🙈" : "👁️"}
                </button>
              </div>
              <button onClick={handleSaveKey} className="btn-primary">
                Guardar
              </button>
            </div>
            <p className="text-[11px] text-faint">
              Se guarda en localStorage. Solo se usa para consultas directas a la
              API de Gemini.
            </p>
          </div>
        </details>
      </div>

      {/* Grupos */}
      <div className="mt-8 space-y-8">
        {groups.map((group) => {
          const groupModules = filtered.filter(
            (m) => (m.group || "Otros") === group,
          );
          if (groupModules.length === 0) return null;
          const count = groupModules.reduce(
            (sum, m) => sum + m.exercises.length,
            0,
          );
          return (
            <div key={group} className="w-full">
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted">
                  {group}
                </h3>
                <div className="h-px flex-1 bg-line"></div>
                <span className="text-[11px] font-semibold text-faint">
                  {count} ejercicios
                </span>
              </div>
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupModules.map((mod) => (
                  <ModuleCard
                    key={mod.key}
                    module={mod}
                    progress={getPercent(mod.key, mod.exercises.length)}
                    onStart={onStart}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted">
            No hay módulos que coincidan con{" "}
            <span className="font-semibold text-ink">“{query}”</span>.
          </div>
        )}
      </div>
      <div className="pb-10"></div>
    </main>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="ui-card flex flex-col items-center justify-center py-3">
      <span
        className={`text-xl font-bold ${accent ? "text-brand" : "text-ink"}`}
      >
        {value}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wide text-faint">
        {label}
      </span>
    </div>
  );
}
