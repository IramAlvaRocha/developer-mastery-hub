import { CHOICE_STYLES, type ChoiceState, LETTERS } from "./FormatTypes";

interface Props {
  index: number;
  label: React.ReactNode;
  selected: boolean;
  /** True si esta opción es la correcta (se pinta en verde tras verificar). */
  correct: boolean;
  solved: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

/** Opción tipo radio con el look de la Fase A (pill, color del módulo). */
export default function ChoiceOption({
  index,
  label,
  selected,
  correct,
  solved,
  onSelect,
  disabled,
}: Props) {
  let state: ChoiceState = "idle";
  if (solved && correct) state = "correct";
  else if (solved && selected) state = "incorrect";
  else if (selected) state = "selected";

  const letter = LETTERS[index] ?? String(index + 1);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`Opción ${letter}`}
      disabled={disabled}
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-[20px] border px-4 py-3 text-left text-[14px] leading-relaxed transition-colors focus-visible:outline-2 ${
        CHOICE_STYLES[state]
      }`}
    >
      <span
        aria-hidden
        className={`mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-bold ${
          state === "correct"
            ? "border-brand/60 bg-brand/15 text-brand"
            : state === "incorrect"
              ? "border-danger/60 bg-danger/15 text-danger"
              : selected
                ? "mod-border border bg-transparent mod-text"
                : "border-line text-faint"
        }`}
      >
        {letter}
      </span>
      <span className="min-w-0 flex-1">{label}</span>
      {state === "correct" && (
        <span aria-hidden className="mt-0.5 shrink-0 text-brand">
          ✓
        </span>
      )}
      {state === "incorrect" && (
        <span aria-hidden className="mt-0.5 shrink-0 text-danger">
          ✗
        </span>
      )}
    </button>
  );
}
