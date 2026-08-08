// ──────────────────────────────────────────────────────────────────────────
// AdminPanel — Fase 7 (Panel admin).
// UI principal del panel: header + toolbar + lista de módulos (expandibles)
// con ejercicios, CRUD, orden y publicar/despublicar. En modo demo muestra
// el aviso de que el panel requiere Supabase + cuenta admin.
// ──────────────────────────────────────────────────────────────────────────

import { useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { moduleColorStyle } from "@/lib/moduleColors";
import { FORMAT_LABELS } from "@/lib/formatMeta";
import { useAdmin, type AdminExercise, type AdminModule } from "@/lib/useAdmin";
import { useToasts } from "@/lib/useToasts";
import UserMenu from "@/components/auth/UserMenu";
import Toasts from "@/components/Toasts";
import ModuleEditor from "./ModuleEditor";
import ExerciseEditor from "./ExerciseEditor";
import ConfirmDialog from "./ConfirmDialog";
import PublishSwitch from "./PublishSwitch";

interface ConfirmState {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export default function AdminPanel() {
  const { isDemoMode } = useAuth();
  const admin = useAdmin();
  const { toasts, showToast, dismissToast } = useToasts();

  const [editingModule, setEditingModule] = useState<AdminModule | null>(null);
  const [moduleEditorOpen, setModuleEditorOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<AdminExercise | null>(
    null,
  );
  const [exerciseModuleKey, setExerciseModuleKey] = useState<string>("");
  const [exerciseEditorOpen, setExerciseEditorOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const pendingRef = useRef<Set<string>>(new Set());
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());

  const totalExercises = useMemo(
    () => admin.modules.reduce((n, m) => n + m.exercises.length, 0),
    [admin.modules],
  );

  /** Marca la fila como en curso y ejecuta la operación (evita doble clic). */
  function runPending(key: string, task: () => Promise<void>) {
    if (pendingRef.current.has(key)) return;
    pendingRef.current.add(key);
    setPendingKeys(new Set(pendingRef.current));
    void task().finally(() => {
      pendingRef.current.delete(key);
      setPendingKeys(new Set(pendingRef.current));
    });
  }

  const modBusy = (m: AdminModule) =>
    pendingKeys.has(`mod-pub:${m.key}`) || pendingKeys.has(`mod-move:${m.key}`);
  const exBusy = (moduleKey: string, ex: AdminExercise) =>
    pendingKeys.has(`ex-pub:${moduleKey}:${ex.id}`) ||
    pendingKeys.has(`ex-move:${moduleKey}:${ex.id}`);

  if (isDemoMode) return <DemoNotice />;

  function toggleExpanded(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function openCreateModule() {
    setEditingModule(null);
    setModuleEditorOpen(true);
  }

  function openEditModule(m: AdminModule) {
    setEditingModule(m);
    setModuleEditorOpen(true);
  }

  function openCreateExercise(moduleKey: string) {
    setEditingExercise(null);
    setExerciseModuleKey(moduleKey);
    setExerciseEditorOpen(true);
  }

  function openEditExercise(moduleKey: string, ex: AdminExercise) {
    setEditingExercise(ex);
    setExerciseModuleKey(moduleKey);
    setExerciseEditorOpen(true);
  }

  const saveModule = async (input: Parameters<typeof admin.createModule>[0]) => {
    if (editingModule) {
      return admin.updateModule(editingModule.key, input);
    }
    return admin.createModule(input);
  };

  const saveExercise = async (
    input: Parameters<typeof admin.createExercise>[1],
  ) => {
    if (editingExercise) {
      return admin.updateExercise(
        exerciseModuleKey,
        editingExercise.id,
        input,
      );
    }
    return admin.createExercise(exerciseModuleKey, input);
  };

  function confirmDeleteModule(m: AdminModule) {
    setConfirmState({
      title: `Borrar módulo «${m.name}»`,
      message:
        "Se eliminará en cascada: sus ejercicios, suscripciones y progreso asociado. Esta acción no se puede deshacer.",
      confirmLabel: "Borrar",
      onConfirm: () => {
        setConfirmState(null);
        void (async () => {
          const err = await admin.deleteModule(m.key);
          if (err) showToast("error", err);
          else showToast("success", `Módulo «${m.name}» eliminado.`);
        })();
      },
    });
  }

  function confirmDeleteExercise(moduleKey: string, ex: AdminExercise) {
    setConfirmState({
      title: `Borrar ejercicio #${ex.id}`,
      message: `Se eliminará «${ex.title}» del módulo. Esta acción no se puede deshacer.`,
      confirmLabel: "Borrar",
      onConfirm: () => {
        setConfirmState(null);
        void (async () => {
          const err = await admin.deleteExercise(moduleKey, ex.id);
          if (err) showToast("error", err);
          else showToast("success", "Ejercicio eliminado.");
        })();
      },
    });
  }

  function handleToggleModulePublish(m: AdminModule) {
    runPending(`mod-pub:${m.key}`, async () => {
      const err = await admin.toggleModulePublish(m.key);
      if (err) showToast("error", err);
      else
        showToast(
          "success",
          m.isPublished ? `«${m.name}» despublicado.` : `«${m.name}» publicado.`,
        );
    });
  }

  function handleToggleExercisePublish(
    moduleKey: string,
    ex: AdminExercise,
  ) {
    runPending(`ex-pub:${moduleKey}:${ex.id}`, async () => {
      const err = await admin.toggleExercisePublish(moduleKey, ex.id);
      if (err) showToast("error", err);
      else
        showToast(
          "success",
          ex.isPublished
            ? `«${ex.title}» despublicado.`
            : `«${ex.title}» publicado.`,
        );
    });
  }

  function handleMoveModule(m: AdminModule, dir: -1 | 1) {
    runPending(`mod-move:${m.key}`, async () => {
      const err = await admin.moveModule(m.key, dir);
      if (err) showToast("error", err);
      else showToast("success", "Orden de módulos actualizado.");
    });
  }

  function handleMoveExercise(
    moduleKey: string,
    ex: AdminExercise,
    dir: -1 | 1,
  ) {
    runPending(`ex-move:${moduleKey}:${ex.id}`, async () => {
      const err = await admin.moveExercise(moduleKey, ex.id, dir);
      if (err) showToast("error", err);
      else showToast("success", "Orden de ejercicios actualizado.");
    });
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b border-line/80 bg-canvas/90 px-4 py-3 backdrop-blur-md md:gap-4 md:px-6">
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
            <p className="hidden truncate text-[12px] font-medium text-muted sm:block">
              Panel de administración
            </p>
          </div>
        </a>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a href="/aprender" className="btn-secondary !min-h-10 !px-4 !text-sm">
            ← Aprender
          </a>
          <UserMenu />
        </div>
      </header>

      <main className="relative flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="section-eyebrow text-cream">{"{ Admin }"}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                Panel de administración
              </h2>
              <p className="mt-1 text-sm text-muted">
                Gestiona módulos y ejercicios. Los cambios se reflejan al
                instante en el catálogo.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={openCreateModule} className="btn-primary">
                + Nuevo módulo
              </button>
              <span className="pill-chip bg-elevated text-muted">
                {admin.modules.length} módulos · {totalExercises} ejercicios
              </span>
            </div>
          </div>

          {admin.error && (
            <div
              role="alert"
              className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-[20px] border border-danger/40 bg-danger/10 px-4 py-3"
            >
              <p className="text-sm text-danger">
                No se pudo cargar: {admin.error}
              </p>
              <button
                onClick={() => void admin.reload()}
                className="btn-secondary !min-h-9 !px-3 !text-xs"
              >
                Reintentar
              </button>
            </div>
          )}

          {admin.loading && admin.modules.length === 0 ? (
            <AdminListSkeleton />
          ) : admin.modules.length === 0 ? (
            <div className="ui-card flex flex-col items-center px-6 py-14 text-center">
              <span className="text-3xl" aria-hidden>
                🗂
              </span>
              <p className="section-eyebrow mt-4 text-cream">{"{ Vacío }"}</p>
              <h3 className="mt-1 text-lg font-semibold text-cream">
                No hay módulos todavía
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Crea el primer módulo para empezar a gestionar el catálogo desde
                aquí.
              </p>
              <button
                onClick={openCreateModule}
                className="btn-filled-soft mt-5 !min-h-11"
              >
                Crear primer módulo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {admin.modules.map((m) => {
                const modIndex = admin.modules.findIndex((x) => x.key === m.key);
                const expanded = expandedKeys.has(m.key);
                return (
                  <section
                    key={m.key}
                    className="ui-card animate-fade-in p-4 sm:p-5"
                    style={moduleColorStyle(m.color)}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(m.key)}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] text-left transition-colors hover:bg-cream/5"
                        aria-expanded={expanded}
                        aria-controls={`module-${m.key}-exercises`}
                        aria-label={
                          expanded
                            ? `Ocultar ejercicios de ${m.name}`
                            : `Mostrar ejercicios de ${m.name}`
                        }
                        title={expanded ? "Colapsar" : "Expandir"}
                      >
                        <span
                          aria-hidden
                          className="mod-icon-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line text-xl"
                        >
                          {m.icon || "◆"}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span
                              aria-hidden
                              className={`shrink-0 text-xs text-faint transition-transform duration-200 ${
                                expanded ? "rotate-90" : ""
                              }`}
                            >
                              ▸
                            </span>
                            <span className="truncate text-base font-semibold text-cream">
                              {m.name}
                            </span>
                            {m.badge && (
                              <span className="pill-chip mod-badge">
                                {m.badge}
                              </span>
                            )}
                            {!m.isPublished && (
                              <span className="pill-chip border border-danger/40 bg-danger/10 text-danger">
                                oculto
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block font-mono text-xs text-faint">
                            {m.key}
                          </span>
                          <span className="mt-1 block text-xs text-muted">
                            {m.exercises.length} ejercicio
                            {m.exercises.length === 1 ? "" : "s"} ·{" "}
                            {m.group || "Sin grupo"} · {m.topics.length} temas
                          </span>
                        </span>
                      </button>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <div
                          role="group"
                          aria-label={`Reordenar ${m.name}`}
                          className="flex items-center gap-0.5 rounded-full border border-line p-0.5"
                        >
                          <button
                            type="button"
                            onClick={() => handleMoveModule(m, -1)}
                            disabled={modIndex <= 0 || modBusy(m)}
                            className="icon-btn h-8 w-8 border-0 text-sm disabled:opacity-30"
                            aria-label={`Mover ${m.name} hacia arriba`}
                            title="Subir en el catálogo"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveModule(m, 1)}
                            disabled={
                              modIndex >= admin.modules.length - 1 || modBusy(m)
                            }
                            className="icon-btn h-8 w-8 border-0 text-sm disabled:opacity-30"
                            aria-label={`Mover ${m.name} hacia abajo`}
                            title="Bajar en el catálogo"
                          >
                            ↓
                          </button>
                        </div>
                        <PublishSwitch
                          checked={m.isPublished}
                          label={
                            m.isPublished
                              ? `Despublicar ${m.name}`
                              : `Publicar ${m.name}`
                          }
                          onChange={() => handleToggleModulePublish(m)}
                          disabled={modBusy(m)}
                        />
                        <button
                          type="button"
                          onClick={() => openEditModule(m)}
                          disabled={modBusy(m)}
                          className="btn-ghost disabled:opacity-40"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDeleteModule(m)}
                          disabled={modBusy(m)}
                          className="btn-ghost text-danger hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>

                    {expanded && (
                      <div
                        id={`module-${m.key}-exercises`}
                        className="mt-4 border-t border-line-soft pt-4"
                      >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-cream">
                            Ejercicios
                          </p>
                          <button
                            onClick={() => openCreateExercise(m.key)}
                            className="btn-secondary !min-h-9 !px-3 !text-xs"
                          >
                            + Nuevo ejercicio
                          </button>
                        </div>

                        {m.exercises.length === 0 ? (
                          <p className="rounded-[20px] border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
                            Sin ejercicios todavía. Crea el primero.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {m.exercises.map((ex) => (
                              <ExerciseRow
                                key={ex.id}
                                exercise={ex}
                                isPending={exBusy(m.key, ex)}
                                isFirst={
                                  ex.position === m.exercises[0].position
                                }
                                isLast={
                                  ex.position ===
                                  m.exercises[m.exercises.length - 1].position
                                }
                                onMoveUp={() =>
                                  handleMoveExercise(m.key, ex, -1)
                                }
                                onMoveDown={() =>
                                  handleMoveExercise(m.key, ex, 1)
                                }
                                onTogglePublish={() =>
                                  handleToggleExercisePublish(m.key, ex)
                                }
                                onEdit={() => openEditExercise(m.key, ex)}
                                onDelete={() =>
                                  confirmDeleteExercise(m.key, ex)
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {moduleEditorOpen && (
        <ModuleEditor
          module={editingModule}
          onClose={() => setModuleEditorOpen(false)}
          onSave={saveModule}
          onToast={showToast}
        />
      )}

      {exerciseEditorOpen && (
        <ExerciseEditor
          exercise={editingExercise}
          onClose={() => setExerciseEditorOpen(false)}
          onSave={saveExercise}
          onToast={showToast}
        />
      )}

      <ConfirmDialog
        open={confirmState !== null}
        title={confirmState?.title ?? ""}
        message={confirmState?.message ?? ""}
        confirmLabel={confirmState?.confirmLabel}
        onCancel={() => setConfirmState(null)}
        onConfirm={() => confirmState?.onConfirm()}
      />

      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Subcomponentes
// ──────────────────────────────────────────────────────────────────────────

function ExerciseRow({
  exercise: ex,
  isFirst,
  isLast,
  isPending,
  onMoveUp,
  onMoveDown,
  onTogglePublish,
  onEdit,
  onDelete,
}: {
  exercise: AdminExercise;
  isFirst: boolean;
  isLast: boolean;
  isPending: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onTogglePublish: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[20px] border border-line bg-surface-2 px-3 py-2.5">
      <span className="font-mono text-xs text-faint">#{ex.id}</span>
      <span
        className="shrink-0 text-xs text-butter"
        aria-label={`${ex.stars} estrellas`}
        title={`${ex.stars} estrellas`}
      >
        {"★".repeat(Math.min(5, Math.max(0, ex.stars)))}
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-cream">
        {ex.title}
      </p>
      {ex.category && (
        <span className="pill-chip bg-elevated text-muted">{ex.category}</span>
      )}
      {ex.format && (
        <span className="pill-chip bg-lilac/15 text-lilac">
          {FORMAT_LABELS[ex.format].icon} {FORMAT_LABELS[ex.format].label}
        </span>
      )}
      {!ex.isPublished && (
        <span className="pill-chip border border-danger/40 bg-danger/10 text-danger">
          oculto
        </span>
      )}
      <div className="flex items-center gap-1">
        <div
          role="group"
          aria-label={`Reordenar ejercicio #${ex.id}`}
          className="flex items-center gap-0.5 rounded-full border border-line p-0.5"
        >
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst || isPending}
            className="icon-btn h-7 w-7 border-0 text-xs disabled:opacity-30"
            aria-label={`Mover #${ex.id} hacia arriba`}
            title="Subir"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast || isPending}
            className="icon-btn h-7 w-7 border-0 text-xs disabled:opacity-30"
            aria-label={`Mover #${ex.id} hacia abajo`}
            title="Bajar"
          >
            ↓
          </button>
        </div>
        <PublishSwitch
          checked={ex.isPublished}
          label={
            ex.isPublished ? `Despublicar ${ex.title}` : `Publicar ${ex.title}`
          }
          onChange={onTogglePublish}
          disabled={isPending}
        />
        <button
          type="button"
          onClick={onEdit}
          disabled={isPending}
          className="btn-ghost !min-h-8 !px-3 !text-xs disabled:opacity-40"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isPending}
          className="btn-ghost !min-h-8 !px-3 !text-xs text-danger hover:bg-danger/10 hover:text-danger disabled:opacity-40"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}

/** Skeleton de la lista de módulos mientras carga por primera vez. */
function AdminListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando panel admin" className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="ui-card p-5">
          <div className="flex items-center gap-3">
            <div className="shimmer-loading h-12 w-12 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="shimmer-loading h-4 w-48 max-w-full rounded-full" />
              <div className="shimmer-loading h-3 w-28 rounded-full" />
            </div>
            <div className="shimmer-loading h-9 w-40 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Aviso de modo demo: el panel requiere Supabase + cuenta admin. */
function DemoNotice() {
  const { signOut } = useAuth();
  return (
    <main className="flex h-full items-center justify-center px-4 py-12">
      <div className="ui-card w-full max-w-md p-6 text-center shadow-float animate-fade-in sm:p-8">
        <p className="section-eyebrow text-cream">{"{ Admin }"}</p>
        <span
          aria-hidden
          className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-lilac/15 text-2xl text-lilac"
        >
          🛠
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-cream">
          Panel de administración
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          El panel admin requiere la conexión a Supabase y una cuenta con rol
          admin.
        </p>
        <div className="mt-6 flex gap-2">
          <a href="/aprender" className="btn-filled-soft flex-1 !min-h-11">
            Ir al catálogo
          </a>
          <button
            onClick={() => void signOut()}
            className="btn-secondary flex-1 !min-h-11"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  );
}
