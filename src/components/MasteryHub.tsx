import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useModules } from "@/lib/useModules";
import { runViewTransition } from "@/lib/viewTransition";
import { useProgress } from "@/lib/useProgress";
import { useEnrollments } from "@/lib/useEnrollments";
import { useToasts } from "@/lib/useToasts";
import {
  buildSearch,
  buildShareUrl,
  readUrlLocation,
  type UrlLocation,
} from "@/lib/urlLocation";
import { courseKeyForModule } from "@/lib/courseCatalog";
import type { Module } from "@/lib/types";
import LearningDashboard from "./LearningDashboard";
import ModuleReader from "./ModuleReader";
import ExerciseSidebar from "./ExerciseSidebar";
import ExerciseWorkspace from "./ExerciseWorkspace";
import Toasts from "./Toasts";
import UserMenu from "./auth/UserMenu";
import BrandMark from "./brand/BrandMark";

const EXERCISE_SIDEBAR_KEY = "dmh-exercise-sidebar-collapsed";

export default function MasteryHub() {
  const {
    enrolledKeys,
    loading: enrollmentsLoading,
    lastOpenedAt,
    touchLastOpened,
  } = useEnrollments();
  const {
    modules,
    loading,
    loadModuleDetail,
    detailLoadedKeys,
    detailError,
  } = useModules(enrolledKeys);
  const moduleKeys = useMemo(
    () =>
      modules
        .filter(
          (module) =>
            enrolledKeys.includes(courseKeyForModule(module)) &&
            module.exercises.length > 0,
        )
        .map((module) => module.key),
    [modules, enrolledKeys],
  );

  const [currentSubject, setCurrentSubject] = useState<string>("menu");
  // null = ficha del módulo; un número = workspace en ese índice de ejercicios.
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(null);
  // Id a resaltar/enfocar en la ficha al volver del workspace.
  const [fichaFocusId, setFichaFocusId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
    isCompleted,
    markComplete,
    recordAttempt,
    getPercent,
    lastVisited,
    setLastVisited,
    lastPersistError,
  } = useProgress(moduleKeys);
  const { toasts, showToast, dismissToast } = useToasts();

  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = useCallback(() => {
    mobileMenuButtonRef.current?.focus();
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(EXERCISE_SIDEBAR_KEY);
      // Solo restaura el colapso cuando la sidebar deja de ser un drawer.
      if (saved === "1" && window.matchMedia("(min-width: 768px)").matches) {
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

  // Aviso "Suscríbete para guardar tu progreso": se muestra una vez por cada
  // bloqueo de RLS al persistir un ejercicio completado (Fase 5).
  const lastPersistErrorShownRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      lastPersistError &&
      lastPersistError !== lastPersistErrorShownRef.current
    ) {
      lastPersistErrorShownRef.current = lastPersistError;
      showToast("info", lastPersistError);
    } else if (!lastPersistError) {
      lastPersistErrorShownRef.current = null;
    }
  }, [lastPersistError, showToast]);

  const currentModule = useMemo(
    () => modules.find((m) => m.key === currentSubject),
    [modules, currentSubject],
  );

  const exercises = currentModule?.exercises ?? [];
  const filteredExercises = exercises;
  // Índice del workspace derivado del estado nuevo (clampado a la lista).
  const activeIndex = Math.min(
    Math.max(activeExerciseId ?? 0, 0),
    Math.max(filteredExercises.length - 1, 0),
  );
  const activeExercise = filteredExercises[activeIndex] ?? filteredExercises[0];
  const color = currentModule?.color ?? "blue";

  const completedCount = useMemo(
    () =>
      exercises.filter((ex) => isCompleted(currentSubject, ex.id)).length,
    [exercises, isCompleted, currentSubject],
  );

  // Recomendaciones de la ficha: mismo grupo → mismo curso → con progreso.
  const recommendedModules = useMemo(() => {
    if (!currentModule) return [];
    const currentCourseKey = courseKeyForModule(currentModule);
    const rank = (m: Module) => {
      if (m.group === currentModule.group) return 0;
      if (courseKeyForModule(m) === currentCourseKey) return 1;
      return 2;
    };
    return modules
      .filter(
        (m) =>
          m.key !== currentModule.key &&
          m.exercises.length > 0 &&
          enrolledKeys.includes(courseKeyForModule(m)) &&
          (m.group === currentModule.group ||
            courseKeyForModule(m) === currentCourseKey ||
            getPercent(m.key, m.exercises.length) > 0),
      )
      .sort((a, b) => rank(a) - rank(b))
      .slice(0, 3);
  }, [modules, enrolledKeys, currentModule, getPercent]);

  // Sin índice → ficha del módulo; con índice → workspace en ese ejercicio.
  function startSubject(key: string, index?: number) {
    const target = modules.find((module) => module.key === key);
    if (!target) return;
    const courseKey = courseKeyForModule(target);
    if (!enrolledKeys.includes(courseKey)) {
      window.location.assign(`/cursos/${courseKey}`);
      return;
    }
    runViewTransition(() => {
      setCurrentSubject(key);
      setActiveExerciseId(index ?? null);
      setFichaFocusId(null);
      setIsMobileMenuOpen(false);
    });
  }

  function goBackToMenu() {
    runViewTransition(() => {
      setCurrentSubject("menu");
      setActiveExerciseId(null);
      setFichaFocusId(null);
      setIsMobileMenuOpen(false);
    });
  }

  function goBackToFicha() {
    // Ya en la ficha: nada que navegar (evita resaltar el ejercicio derivado).
    if (activeExerciseId === null) return;
    const lastId = activeExercise?.id ?? null;
    runViewTransition(() => {
      setActiveExerciseId(null);
      setFichaFocusId(lastId);
      setIsMobileMenuOpen(false);
    });
  }

  function selectExercise(index: number) {
    setActiveExerciseId(index);
    setIsMobileMenuOpen(false);
  }

  const goNext = useCallback(() => {
    setActiveExerciseId((id) =>
      Math.min((id ?? 0) + 1, filteredExercises.length - 1),
    );
  }, [filteredExercises.length]);

  const goPrev = useCallback(() => {
    setActiveExerciseId((id) => Math.max((id ?? 0) - 1, 0));
  }, []);

  // Recalcula (clamp) el índice si la lista filtrada queda fuera de rango.
  useEffect(() => {
    setActiveExerciseId((prev) => {
      if (prev == null) return prev;
      if (prev < filteredExercises.length) return prev;
      return Math.max(0, filteredExercises.length - 1);
    });
  }, [filteredExercises.length]);

  const inModule = currentSubject !== "menu" && !!currentModule;
  const isWorkspace = inModule && activeExerciseId !== null;
  const isFicha = inModule && !isWorkspace;

  // Carga bajo demanda del detalle completo del módulo activo (Fase 2).
  // El catálogo ligero solo trae metadatos; el workspace necesita teoría,
  // código y formato, así que se fetchea al entrar al módulo.
  const detailReady = detailLoadedKeys.includes(currentSubject);

  useEffect(() => {
    if (currentSubject === "menu" || !currentModule) return;
    if (currentModule.exercises.length === 0) return;
    if (!detailLoadedKeys.includes(currentSubject)) {
      void loadModuleDetail(currentSubject);
    }
  }, [currentSubject, currentModule, detailLoadedKeys, loadModuleDetail]);

  useEffect(() => {
    if (currentSubject !== "menu" && currentModule) {
      // Marca el curso como reciente en "Mis Cursos" (solo si está suscrito).
      const courseKey = courseKeyForModule(currentModule);
      if (enrolledKeys.includes(courseKey)) {
        void touchLastOpened(courseKey);
      }
      // "Continuar donde lo dejaste" solo avanza mientras se practica
      // (workspace); abrir la ficha no debe pisar la posición guardada.
      if (activeExerciseId === null) return;
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
  }, [
    currentSubject,
    activeIndex,
    activeExerciseId,
    currentModule,
    filteredExercises,
    setLastVisited,
    enrolledKeys,
    touchLastOpened,
  ]);

  const applyUrlToState = useCallback(() => {
    const { module, exerciseId } = readUrlLocation();
    const mod = module ? modules.find((m) => m.key === module) : undefined;
    if (!mod) {
      setCurrentSubject("menu");
      setActiveExerciseId(null);
      setFichaFocusId(null);
      return;
    }
    const courseKey = courseKeyForModule(mod);
    if (!enrolledKeys.includes(courseKey)) {
      window.location.assign(`/cursos/${courseKey}`);
      return;
    }
    let index: number | null = null;
    if (exerciseId != null) {
      const found = mod.exercises.findIndex((ex) => ex.id === exerciseId);
      if (found >= 0) index = found;
    }
    setCurrentSubject(mod.key);
    setActiveExerciseId(index);
    setFichaFocusId(null);
  }, [modules, enrolledKeys]);

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
        : {
            module: currentSubject,
            exerciseId:
              activeExerciseId === null ? null : activeExercise?.id ?? null,
          };
    const nextSearch = buildSearch(loc);
    if (nextSearch !== window.location.search) {
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}${nextSearch}`,
      );
    }
  }, [currentSubject, activeExerciseId, activeExercise?.id]);

  const shareCurrent = useCallback(async () => {
    if (!currentModule) return;
    const url = buildShareUrl({
      module: currentModule.key,
      exerciseId:
        activeExerciseId === null ? null : activeExercise?.id ?? null,
    });
    try {
      await navigator.clipboard.writeText(url);
      showToast(
        "success",
        activeExerciseId === null
          ? "Enlace del módulo copiado"
          : "Enlace del ejercicio copiado",
      );
    } catch {
      showToast("info", url);
    }
  }, [currentModule, activeExercise, activeExerciseId, showToast]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b border-line/80 bg-canvas/90 px-4 py-3 md:gap-4 md:px-6">
        <a
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label="Ir a la landing"
        >
          <BrandMark className="h-11 w-11" />
          <div className="min-w-0 text-left">
            <span className="block truncate text-base font-semibold tracking-tight text-cream sm:text-lg">
              Mastery Hub
            </span>
            <p className="hidden truncate text-[12px] font-medium text-muted sm:block">
              {inModule
                ? currentModule.name
                : "Mis cursos · práctica guiada"}
            </p>
          </div>
        </a>

        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          {inModule ? (
            <nav
              aria-label="Ruta de navegación"
              className="flex max-w-full items-center gap-2 rounded-full border border-line bg-canvas/50 px-4 py-2 text-xs"
            >
              <button
                onClick={goBackToMenu}
                className="shrink-0 text-brand transition-colors hover:text-brand-strong"
              >
                Mis cursos
              </button>
              <span className="text-faint">/</span>
              <button
                onClick={goBackToFicha}
                className="shrink-0 text-muted transition-colors hover:text-cream"
              >
                {currentModule.group}
              </button>
              <span className="text-faint">/</span>
              {isFicha ? (
                <span className="truncate font-semibold text-cream">
                  {currentModule.name}
                </span>
              ) : (
                <button
                  onClick={goBackToFicha}
                  className="shrink-0 truncate font-semibold text-cream transition-colors hover:text-brand-strong"
                >
                  {currentModule.name}
                </button>
              )}
              {isWorkspace && (
                <>
                  <span className="text-faint">/</span>
                  <span className="shrink-0 font-semibold text-cream">
                    Ejercicio {activeIndex + 1}
                  </span>
                </>
              )}
            </nav>
          ) : (
            <p className="rounded-full border border-line bg-canvas/60 px-4 py-2 text-sm text-cream">
              {"{ Mi aprendizaje }"}
            </p>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {!inModule && (
            <a href="/cursos" className="btn-secondary !min-h-10 !px-4 !text-sm">
              Explorar
            </a>
          )}
          {inModule && (
            <button
              onClick={isWorkspace ? goBackToFicha : goBackToMenu}
              className="btn-secondary !min-h-10 !px-0 !text-sm max-sm:h-11 max-sm:w-11 sm:!px-5"
              aria-label={
                isWorkspace ? "Volver a la ficha del módulo" : "Volver al menú"
              }
              title={
                isWorkspace ? "Volver a la ficha del módulo" : "Volver al menú"
              }
            >
              ←
              <span className="hidden sm:inline">
                {isWorkspace ? " Ficha" : " Menú"}
              </span>
            </button>
          )}
          {isWorkspace && sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="icon-btn hidden border border-line md:inline-flex"
              aria-label="Mostrar lista de ejercicios"
              aria-expanded="false"
              title="Mostrar lista de ejercicios"
            >
              ☰
            </button>
          )}
          <UserMenu />
          {isWorkspace && (
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
          loading && modules.length === 0 ? (
            <ModuleMenuSkeleton />
          ) : (
            <LearningDashboard
              modules={modules}
              enrolledKeys={enrolledKeys}
              getPercent={getPercent}
              onResume={(key, index) => startSubject(key, index)}
              lastVisited={lastVisited}
              lastOpenedAt={lastOpenedAt}
              loading={loading || enrollmentsLoading}
            />
          )
        ) : isFicha ? (
          <ModuleReader
            key={currentModule.key}
            module={currentModule}
            progress={getPercent(currentModule.key, exercises.length)}
            completedCount={completedCount}
            isCompleted={(id) => isCompleted(currentModule.key, id)}
            activeExerciseId={fichaFocusId}
            lastVisitedIndex={
              lastVisited && lastVisited.key === currentModule.key
                ? lastVisited.index
                : null
            }
            recommended={recommendedModules}
            onSelectExercise={(index) => startSubject(currentModule.key, index)}
            onOpenModule={(key) => startSubject(key)}
            onBack={goBackToMenu}
            getPercent={getPercent}
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
              onCollapse={() => setSidebarCollapsed(true)}
            />

            <div
              inert={isMobileMenuOpen ? true : undefined}
              className="flex min-w-0 flex-1 flex-col"
            >
              {filteredExercises.length === 0 ? (
                <ExerciseFilterEmpty />
              ) : !detailReady ? (
                detailError && detailError.key === currentSubject ? (
                  <ModuleDetailError
                    message={detailError.message}
                    onRetry={() => void loadModuleDetail(currentSubject)}
                  />
                ) : (
                  <WorkspaceSkeleton />
                )
              ) : (
                <ExerciseWorkspace
                  key={`${currentModule.key}-${activeExercise.id}`}
                  exercise={activeExercise}
                  moduleKey={currentModule.key}
                  moduleName={currentModule.name}
                  color={color}
                  alreadyCompleted={isCompleted(
                    currentModule.key,
                    activeExercise.id,
                  )}
                  index={activeIndex}
                  total={filteredExercises.length}
                  onPrev={goPrev}
                  onNext={goNext}
                  onComplete={(id) => markComplete(currentModule.key, id)}
                  onAttempt={(id, correct, errorKeys) =>
                    recordAttempt(currentModule.key, id, correct, errorKeys)
                  }
                  onShare={shareCurrent}
                  onToast={showToast}
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

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

/** Skeleton del catálogo mientras la capa de datos carga por primera vez. */
function ModuleMenuSkeleton() {
  return (
    <main
      className="relative flex flex-1 flex-col overflow-y-auto"
      aria-busy="true"
      aria-label="Cargando catálogo"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="shimmer-loading h-4 w-28 rounded-full" />
        <div className="shimmer-loading mt-3 h-10 w-72 max-w-full rounded-2xl" />
        <div className="shimmer-loading mt-3 h-5 w-[480px] max-w-full rounded-full" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer-loading h-24 rounded-[24px]" />
          ))}
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="shimmer-loading h-9 w-32 shrink-0 rounded-full"
            />
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer-loading h-40 rounded-[28px]" />
          ))}
        </div>
      </div>
    </main>
  );
}

/** Defensa para módulos publicados sin ejercicios disponibles. */
function ExerciseFilterEmpty() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center rounded-[28px] border border-line bg-surface p-8 text-center sm:p-12">
        <span className="text-3xl" aria-hidden>
          🔍
        </span>
        <p className="section-eyebrow mt-4 text-cream">{"{ Sin ejercicios }"}</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-cream sm:text-2xl">
          Este módulo todavía no tiene ejercicios
        </h1>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
          Vuelve a tus cursos y elige otro módulo mientras se publica el contenido.
        </p>
        <a href="/aprender" className="btn-filled-soft mt-6 !min-h-11">
          Volver a mis cursos
        </a>
      </div>
    </div>
  );
}

/** Skeleton del workspace mientras llega el detalle completo del módulo. */
function WorkspaceSkeleton() {
  return (
    <main
      className="flex min-h-0 flex-1 flex-col overflow-y-auto"
      aria-busy="true"
      aria-label="Cargando ejercicio"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="shimmer-loading h-6 w-56 max-w-full rounded-full" />
          <div className="shimmer-loading h-9 w-28 rounded-full" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shimmer-loading h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="mt-4 flex-1 rounded-[28px] border border-line bg-surface p-4 sm:p-6">
          <div className="shimmer-loading h-4 w-44 rounded-full" />
          <div className="mt-4 space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="shimmer-loading h-4 rounded-full"
                style={{ width: `${100 - i * 9}%` }}
              />
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-elevated p-4">
            <div className="shimmer-loading h-3 w-24 rounded-full" />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="shimmer-loading h-3 rounded-full"
                  style={{ width: `${92 - i * 7}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/** Error de carga del detalle de un módulo, con reintento. */
function ModuleDetailError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center rounded-[28px] border border-line bg-surface p-8 text-center sm:p-12">
        <span className="text-3xl" aria-hidden>
          ⚠️
        </span>
        <p className="section-eyebrow mt-4 text-cream">{"{ Error de carga }"}</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-cream sm:text-2xl">
          No se pudo cargar este módulo
        </h1>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
          {message}
        </p>
        <button onClick={onRetry} className="btn-filled-soft mt-6 !min-h-11">
          Reintentar
        </button>
      </div>
    </div>
  );
}
