import { useCallback, useEffect, useMemo, useState } from "react";
import { ALL_MODULES, MODULE_GROUPS } from "@/data";
import { runViewTransition } from "@/lib/viewTransition";
import { useProgress } from "@/lib/useProgress";
import { useToasts } from "@/lib/useToasts";
import ModuleMenu from "./ModuleMenu";
import ExerciseSidebar from "./ExerciseSidebar";
import ExerciseWorkspace from "./ExerciseWorkspace";
import AiChat from "./AiChat";
import Toasts from "./Toasts";
import SettingsModal from "./SettingsModal";

const MODULE_KEYS = ALL_MODULES.map((m) => m.key);

export default function MasteryHub() {
  const [currentSubject, setCurrentSubject] = useState<string>("menu");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { isCompleted, markComplete, getPercent, lastVisited, setLastVisited } =
    useProgress(MODULE_KEYS);
  const { toasts, showToast, dismissToast } = useToasts();

  const currentModule = useMemo(
    () => ALL_MODULES.find((m) => m.key === currentSubject),
    [currentSubject],
  );

  const exercises = currentModule?.exercises ?? [];
  const activeExercise = exercises[activeIndex] ?? exercises[0];
  const color = currentModule?.color ?? "blue";

  const systemPrompt = useMemo(() => {
    if (!currentModule || !activeExercise) return "";
    return (
      `Eres un mentor experto de software senior. El alumno te consulta sobre el modulo "${currentModule.name}". ` +
      `Ejercicio activo: "${activeExercise.title}". ` +
      `Guialo con pistas valiosas, analogias y el "por que" tecnico. Si el ejercicio no esta completado, NO le des la respuesta directa. ` +
      `Conecta siempre con el ecosistema real de .NET/C# (Clean Architecture, CQRS, EF Core) y React 19 + TanStack Query cuando sea relevante.`
    );
  }, [currentModule, activeExercise]);

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

  // Recuerda el último ejercicio abierto para "Continuar donde lo dejaste".
  useEffect(() => {
    if (currentSubject !== "menu" && currentModule) {
      setLastVisited(currentModule.key, activeIndex);
    }
  }, [currentSubject, activeIndex, currentModule, setLastVisited]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-line bg-surface px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={goBackToMenu}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Ir al inicio"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand text-base shadow-glow-soft">
              🎓
            </span>
            <div className="hidden text-left sm:block">
              <h1 className="text-sm font-bold tracking-tight text-ink">
                Developer Mastery Hub
              </h1>
              <p className="text-[11px] font-medium text-muted">
                .NET + React · patrones, calidad y mentoría IA
              </p>
            </div>
          </button>

          {/* Breadcrumb */}
          {inModule && (
            <nav className="ml-1 hidden min-w-0 items-center gap-1.5 border-l border-line pl-3 text-xs md:flex">
              <button
                onClick={goBackToMenu}
                className="text-brand transition-colors hover:text-brand-strong"
              >
                Inicio
              </button>
              <span className="text-faint">/</span>
              <span className="truncate text-muted">{currentModule.group}</span>
              <span className="text-faint">/</span>
              <span className="truncate font-semibold text-ink">
                {currentModule.name}
              </span>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {inModule && (
            <button onClick={goBackToMenu} className="btn-secondary">
              ← Menú
            </button>
          )}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="icon-btn border border-line"
            aria-label="Configuración"
            title="Configuración"
          >
            ⚙️
          </button>
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
              systemPrompt={systemPrompt}
              alreadyCompleted={isCompleted(currentModule.key, activeExercise.id)}
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

      {inModule && <AiChat systemPrompt={systemPrompt} />}
      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onToast={showToast}
      />
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
