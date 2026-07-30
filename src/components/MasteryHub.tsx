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
import ModuleMenu from "./ModuleMenu";
import ExerciseSidebar from "./ExerciseSidebar";
import ExerciseWorkspace from "./ExerciseWorkspace";
import Toasts from "./Toasts";

const MODULE_KEYS = ALL_MODULES.map((m) => m.key);
const ROUTES_SIDEBAR_KEY = "dmh-routes-sidebar-open";

export default function MasteryHub() {
  const [currentSubject, setCurrentSubject] = useState<string>("menu");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [routesSidebarOpen, setRoutesSidebarOpen] = useState(false);

  const {
    isCompleted,
    markComplete,
    getPercent,
    lastVisited,
    setLastVisited,
  } = useProgress(MODULE_KEYS);
  const { toasts, showToast, dismissToast } = useToasts();

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

  const currentModule = useMemo(
    () => ALL_MODULES.find((m) => m.key === currentSubject),
    [currentSubject],
  );

  const exercises = currentModule?.exercises ?? [];
  const activeExercise = exercises[activeIndex] ?? exercises[0];
  const color = currentModule?.color ?? "blue";

  function startSubject(key: string, index = 0) {
    runViewTransition(() => {
      setCurrentSubject(key);
      setActiveIndex(index);
      setIsMobileMenuOpen(false);
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

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, exercises.length - 1));
  }, [exercises.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }, []);

  const inModule = currentSubject !== "menu" && currentModule && activeExercise;

  useEffect(() => {
    if (currentSubject !== "menu" && currentModule) {
      setLastVisited(currentModule.key, activeIndex);
    }
  }, [currentSubject, activeIndex, currentModule, setLastVisited]);

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
      <header className="flex shrink-0 items-center gap-3 border-b border-line bg-[#121412]/95 px-4 py-3.5 backdrop-blur md:gap-4 md:px-6">
        {!inModule && (
          <button
            type="button"
            onClick={() => setRoutesSidebarOpen((v) => !v)}
            className="icon-btn shrink-0 border border-line"
            aria-label={routesSidebarOpen ? "Ocultar rutas" : "Mostrar rutas"}
            aria-expanded={routesSidebarOpen}
            title={routesSidebarOpen ? "Ocultar menú de rutas" : "Abrir menú de rutas"}
          >
            ☰
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
            <h1 className="truncate text-base font-semibold tracking-tight text-cream sm:text-lg">
              Mastery Hub
            </h1>
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
              onClick={shareCurrent}
              className="icon-btn border border-line"
              aria-label="Compartir ejercicio"
              title="Compartir ejercicio"
            >
              🔗
            </button>
          )}
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
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="icon-btn border border-line md:hidden"
              aria-label="Abrir lista de ejercicios"
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
              exercises={exercises}
              activeIndex={activeIndex}
              progress={getPercent(currentModule.key, exercises.length)}
              isCompleted={(id) => isCompleted(currentModule.key, id)}
              isOpen={isMobileMenuOpen}
              onSelect={selectExercise}
              onClose={() => setIsMobileMenuOpen(false)}
            />

            {isMobileMenuOpen && (
              <div
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-30 bg-black/60 md:hidden"
              ></div>
            )}

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
              total={exercises.length}
              onPrev={goPrev}
              onNext={goNext}
              onComplete={(id) => markComplete(currentModule.key, id)}
              onToast={showToast}
            />
          </>
        )}
      </div>

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
