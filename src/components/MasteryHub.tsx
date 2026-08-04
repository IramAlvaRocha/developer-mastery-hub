import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ALL_MODULES, MODULE_GROUPS } from "@/data";
import { runViewTransition } from "@/lib/viewTransition";
import { useProgress } from "@/lib/useProgress";
import { useToasts } from "@/lib/useToasts";
import {
  buildSearch,
  buildShareUrl,
  readUrlLocation,
  type UrlLocation,
} from "@/lib/urlLocation";
import { readAuthProfile, type AuthProfile } from "@/lib/authStub";
import { getModuleFormats } from "@/lib/formatMeta";
import type { ExerciseFormat } from "@/lib/types";
import ModuleMenu from "./ModuleMenu";
import ExerciseSidebar from "./ExerciseSidebar";
import ExerciseWorkspace from "./ExerciseWorkspace";
import SettingsModal from "./SettingsModal";
import Toasts from "./Toasts";

const MODULE_KEYS = ALL_MODULES.map((m) => m.key);
const ROUTES_SIDEBAR_KEY = "dmh-routes-sidebar-open";
const EXERCISE_SIDEBAR_KEY = "dmh-exercise-sidebar-collapsed";

export default function MasteryHub() {
  const [currentSubject, setCurrentSubject] = useState<string>("menu");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [routesSidebarOpen, setRoutesSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formatFilter, setFormatFilter] = useState<ExerciseFormat | null>(null);

  const {
    isCompleted,
    markComplete,
    getPercent,
    lastVisited,
    setLastVisited,
    exportProgress,
    importProgress,
  } = useProgress(MODULE_KEYS);
  const { toasts, showToast, dismissToast } = useToasts();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = useCallback(() => {
    mobileMenuButtonRef.current?.focus();
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    setProfile(readAuthProfile());
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROUTES_SIDEBAR_KEY);
      // Solo restaura si el usuario lo dejó abierto en desktop.
      if (saved === "1" && window.matchMedia("(min-width: 1024px)").matches) {
        setRoutesSidebarOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(ROUTES_SIDEBAR_KEY, routesSidebarOpen ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [routesSidebarOpen]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(EXERCISE_SIDEBAR_KEY);
      // Solo restaura el colapso en desktop.
      if (saved === "1" && window.matchMedia("(min-width: 1024px)").matches) {
        setSidebarCollapsed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(EXERCISE_SIDEBAR_KEY, sidebarCollapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed]);

  const currentModule = useMemo(
    () => ALL_MODULES.find((m) => m.key === currentSubject),
    [currentSubject],
  );

  const exercises = currentModule?.exercises ?? [];
  const formats = useMemo(
    () => (currentModule ? getModuleFormats(currentModule.exercises) : []),
    [currentModule],
  );
  const filteredExercises = useMemo(
    () =>
      formatFilter
        ? exercises.filter((ex) => ex.format === formatFilter)
        : exercises,
    [exercises, formatFilter],
  );
  const activeExercise = filteredExercises[activeIndex] ?? filteredExercises[0];
  const color = currentModule?.color ?? "blue";

  function startSubject(key: string, index = 0) {
    runViewTransition(() => {
      setCurrentSubject(key);
      setActiveIndex(index);
      setIsMobileMenuOpen(false);
      setFormatFilter(null);
    });
  }

  function goBackToMenu() {
    runViewTransition(() => {
      setCurrentSubject("menu");
      setIsMobileMenuOpen(false);
    });
  }

  function selectExercise(index: number) {
    setActiveIndex(index);
    setIsMobileMenuOpen(false);
  }

  function changeFormatFilter(next: ExerciseFormat | null) {
    const prevId = filteredExercises[activeIndex]?.id;
    setFormatFilter(next);
    if (prevId == null) return;
    const list = next
      ? exercises.filter((ex) => ex.format === next)
      : exercises;
    const pos = list.findIndex((ex) => ex.id === prevId);
    setActiveIndex(pos >= 0 ? pos : 0);
  }

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, filteredExercises.length - 1));
  }, [filteredExercises.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Recalcula (clamp) el índice si la lista filtrada queda fuera de rango.
  useEffect(() => {
    setActiveIndex((prev) => {
      if (prev < filteredExercises.length) return prev;
      return Math.max(0, filteredExercises.length - 1);
    });
  }, [filteredExercises.length]);

  const inModule = currentSubject !== "menu" && !!currentModule;

  useEffect(() => {
    if (currentSubject !== "menu" && currentModule) {
      const current = filteredExercises[activeIndex];
      if (!current) return;
      // Guarda la posición en el array COMPLETO del módulo (no el filtrado),
      // para que "Continuar donde lo dejaste" abra el ejercicio correcto.
      const realIndex = currentModule.exercises.findIndex(
        (ex) => ex.id === current.id,
      );
      setLastVisited(
        currentModule.key,
        realIndex >= 0 ? realIndex : activeIndex,
      );
    }
  }, [currentSubject, activeIndex, currentModule, filteredExercises, setLastVisited]);

  const applyUrlToState = useCallback(() => {
    const { module, exerciseId } = readUrlLocation();
    const mod = module ? ALL_MODULES.find((m) => m.key === module) : undefined;
    if (!mod) {
      setCurrentSubject("menu");
      setActiveIndex(0);
      return;
    }
    let index = 0;
    if (exerciseId != null) {
      const found = mod.exercises.findIndex((ex) => ex.id === exerciseId);
      if (found >= 0) index = found;
    }
    setCurrentSubject(mod.key);
    setActiveIndex(index);
    setFormatFilter(null);
  }, []);

  useEffect(() => {
    applyUrlToState();
    window.addEventListener("popstate", applyUrlToState);
    return () => window.removeEventListener("popstate", applyUrlToState);
  }, [applyUrlToState]);

  const skipFirstUrlWrite = useRef(true);
  useEffect(() => {
    if (skipFirstUrlWrite.current) {
      skipFirstUrlWrite.current = false;
      return;
    }
    const loc: UrlLocation =
      currentSubject === "menu"
        ? { module: null, exerciseId: null }
        : { module: currentSubject, exerciseId: activeExercise?.id ?? null };
    const nextSearch = buildSearch(loc);
    if (nextSearch !== window.location.search) {
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}${nextSearch}`,
      );
    }
  }, [currentSubject, activeExercise?.id]);

  const shareCurrent = useCallback(async () => {
    if (!currentModule || !activeExercise) return;
    const url = buildShareUrl({
      module: currentModule.key,
      exerciseId: activeExercise.id,
    });
    try {
      await navigator.clipboard.writeText(url);
      showToast("success", "Enlace del ejercicio copiado");
    } catch {
      showToast("info", url);
    }
  }, [currentModule, activeExercise, showToast]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b border-line/80 bg-canvas/90 px-4 py-3 backdrop-blur-md md:gap-4 md:px-6">
        {!inModule && (
          <button
            type="button"
            onClick={() => setRoutesSidebarOpen((v) => !v)}
            className="icon-btn shrink-0 border border-line"
            aria-label={routesSidebarOpen ? "Ocultar rutas" : "Mostrar rutas"}
            aria-expanded={routesSidebarOpen}
            title={routesSidebarOpen ? "Ocultar menú de rutas" : "Abrir menú de rutas"}
          >
            ☷
          </button>
        )}
        <a
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label="Ir a la landing"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-lg text-brand">
            ◆
          </span>
          <div className="min-w-0 text-left">
            <span className="block truncate text-base font-semibold tracking-tight text-cream sm:text-lg">
              Mastery Hub
            </span>
            <p className="truncate text-[12px] font-medium text-muted">
              {inModule
                ? currentModule.name
                : "Catálogo · práctica guiada"}
            </p>
          </div>
        </a>

        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          {inModule ? (
            <nav className="flex max-w-full items-center gap-2 rounded-full border border-line bg-canvas/50 px-4 py-2 text-xs">
              <button
                onClick={goBackToMenu}
                className="shrink-0 text-brand transition-colors hover:text-brand-strong"
              >
                Catálogo
              </button>
              <span className="text-faint">/</span>
              <span className="truncate text-muted">{currentModule.group}</span>
              <span className="text-faint">/</span>
              <span className="truncate font-semibold text-cream">
                {currentModule.name}
              </span>
            </nav>
          ) : (
            <p className="rounded-full border border-line bg-canvas/60 px-4 py-2 text-sm text-cream">
              {"{ Elige tu ruta }"}
            </p>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {!inModule && (
            <a href="/" className="btn-secondary !min-h-10 !px-4 !text-sm">
              Inicio
            </a>
          )}
          {inModule && (
            <button onClick={goBackToMenu} className="btn-secondary !min-h-10 !px-4 !text-sm">
              ← Menú
            </button>
          )}
          {inModule && (
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="icon-btn hidden border border-line md:inline-flex"
              aria-label="Mostrar/ocultar lista de ejercicios"
              aria-expanded={!sidebarCollapsed}
              title={
                sidebarCollapsed
                  ? "Mostrar lista de ejercicios"
                  : "Ocultar lista de ejercicios"
              }
            >
              {sidebarCollapsed ? "☰" : "▤"}
            </button>
          )}
          {inModule && (
            <button
              onClick={shareCurrent}
              className="icon-btn border border-line"
              aria-label="Compartir ejercicio"
              title="Compartir ejercicio"
            >
              🔗
            </button>
          )}
          <button
            onClick={() => setSettingsOpen(true)}
            className="icon-btn border border-line"
            aria-label="Configuración"
            title="Configuración"
          >
            ⚙
          </button>
          {profile && (
            <span
              className="hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line sm:inline-flex"
              title={profile.name}
            >
              {profile.avatarDataUrl ? (
                <img
                  src={profile.avatarDataUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-lilac">
                  {profile.name.slice(0, 1).toUpperCase()}
                </span>
              )}
            </span>
          )}
          {inModule && (
            <button
              ref={mobileMenuButtonRef}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="icon-btn border border-line md:hidden"
              aria-label="Abrir lista de ejercicios"
              aria-expanded={isMobileMenuOpen}
            >
              ☰
            </button>
          )}
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {!inModule ? (
          <ModuleMenu
            modules={ALL_MODULES}
            groups={MODULE_GROUPS}
            getPercent={getPercent}
            onStart={startSubject}
            onResume={(key, index) => startSubject(key, index)}
            lastVisited={lastVisited}
            onToast={showToast}
            sidebarOpen={routesSidebarOpen}
            onSidebarOpenChange={setRoutesSidebarOpen}
          />
        ) : (
          <>
            <ExerciseSidebar
              moduleName={currentModule.name}
              color={color}
              exercises={filteredExercises}
              activeIndex={activeIndex}
              progress={getPercent(currentModule.key, exercises.length)}
              isCompleted={(id) => isCompleted(currentModule.key, id)}
              isOpen={isMobileMenuOpen}
              collapsed={sidebarCollapsed}
              onSelect={selectExercise}
              onClose={closeMobileMenu}
            />

            <div
              inert={isMobileMenuOpen ? true : undefined}
              className="flex min-w-0 flex-1 flex-col"
            >
              {filteredExercises.length > 0 ? (
                <ExerciseWorkspace
                  key={`${currentModule.key}-${activeExercise.id}`}
                  exercise={activeExercise}
                  moduleName={currentModule.name}
                  color={color}
                  alreadyCompleted={isCompleted(
                    currentModule.key,
                    activeExercise.id,
                  )}
                  index={activeIndex}
                  total={filteredExercises.length}
                  formats={formats}
                  formatFilter={formatFilter}
                  onFormatFilterChange={changeFormatFilter}
                  onPrev={goPrev}
                  onNext={goNext}
                  onComplete={(id) => markComplete(currentModule.key, id)}
                  onToast={showToast}
                />
              ) : (
                <ExerciseFilterEmpty
                  onClear={() => changeFormatFilter(null)}
                />
              )}
            </div>

            {isMobileMenuOpen && (
              <div
                onClick={closeMobileMenu}
                className="fixed inset-0 z-30 bg-canvas/85 backdrop-blur-sm md:hidden"
              ></div>
            )}
          </>
        )}
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onToast={showToast}
        onExportProgress={exportProgress}
        onImportProgress={importProgress}
      />

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

/** Defensa: filtro de formato sin resultados dentro del módulo (no vuelve al catálogo). */
function ExerciseFilterEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center rounded-[28px] border border-line bg-surface p-8 text-center sm:p-12">
        <span className="text-3xl" aria-hidden>
          🔍
        </span>
        <p className="section-eyebrow mt-4 text-cream">{"{ Sin ejercicios }"}</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-cream sm:text-2xl">
          No hay ejercicios de este formato en este módulo
        </h1>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
          Quita el filtro de tipo de ejercicio para ver todos los desafíos del
          módulo.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="btn-filled-soft mt-6 !min-h-11"
        >
          Ver todos los ejercicios
        </button>
      </div>
    </div>
  );
}
