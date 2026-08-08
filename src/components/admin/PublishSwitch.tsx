// ──────────────────────────────────────────────────────────────────────────
// PublishSwitch — Fase 7 (Panel admin).
// Switch de publicación accesible (role="switch" + aria-checked), compartido
// por AdminPanel, ModuleEditor y ExerciseEditor. El knob se posiciona con
// `left` para centrar mejor en ambos estados.
// ──────────────────────────────────────────────────────────────────────────

interface Props {
  checked: boolean;
  label: string;
  onChange: () => void;
  disabled?: boolean;
}

export default function PublishSwitch({
  checked,
  label,
  onChange,
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "border-brand/50 bg-brand/25" : "border-line bg-elevated"
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-[left] duration-150 ${
          checked ? "left-[calc(100%-20px)] bg-brand" : "left-1 bg-muted"
        }`}
      />
    </button>
  );
}
