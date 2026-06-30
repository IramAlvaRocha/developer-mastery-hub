import { useCallback, useEffect, useRef, useState } from "react";
import type { ShellScenario } from "@/lib/types";
import { createInitialState, welcomeForPreset } from "@/lib/shell/presets";
import { executeCommand, promptFor } from "@/lib/shell/simulator";
import type { ShellState } from "@/lib/shell/types";

interface TerminalLine {
  type: "prompt" | "input" | "output" | "system";
  text: string;
}

interface Props {
  scenario: ShellScenario;
  /** Reinicia al cambiar de ejercicio. */
  resetKey: string;
}

export default function SimulatedTerminal({ scenario, resetKey }: Props) {
  const [state, setState] = useState<ShellState>(() =>
    createInitialState(scenario.preset, scenario.cwd ?? "/home/dev"),
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const [lines, setLines] = useState<TerminalLine[]>(() => initialLines(scenario));
  const [draft, setDraft] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fresh = createInitialState(scenario.preset, scenario.cwd ?? "/home/dev");
    setState(fresh);
    stateRef.current = fresh;
    setLines(initialLines(scenario));
    setDraft("");
    setHistory([]);
    setHistIdx(-1);
  }, [resetKey, scenario.preset, scenario.cwd, scenario.welcome]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const before = stateRef.current;
      const prompt = promptFor(before);

      if (!trimmed) {
        setLines((prev) => [...prev, { type: "prompt", text: prompt }]);
        return;
      }

      const result = executeCommand(before, raw);
      setState(result.state);
      stateRef.current = result.state;

      if (result.clear) {
        setLines([
          ...initialLines(scenario, false),
          { type: "input", text: `${prompt}${raw}` },
          ...result.output
            .filter((t) => t !== "")
            .map((t) => ({ type: "output" as const, text: t })),
          { type: "prompt", text: promptFor(result.state) },
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          { type: "input", text: `${prompt}${raw}` },
          ...result.output
            .filter((t) => t !== "")
            .map((t) => ({ type: "output" as const, text: t })),
          { type: "prompt", text: promptFor(result.state) },
        ]);
      }

      setHistory((h) => [...h, trimmed]);
      setHistIdx(-1);
    },
    [scenario],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    runCommand(draft);
    setDraft("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setDraft(history[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(-1);
        setDraft("");
      } else {
        setHistIdx(next);
        setDraft(history[next] ?? "");
      }
    }
  }

  return (
    <div className="ui-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-2.5">
        <span className="font-mono text-[11px] text-muted">🖥️ Terminal simulada</span>
        <button
          type="button"
          className="btn-ghost py-1 text-[11px]"
          onClick={() => {
            const fresh = createInitialState(scenario.preset, scenario.cwd ?? "/home/dev");
            setState(fresh);
            stateRef.current = fresh;
            setLines(initialLines(scenario));
            setDraft("");
            setHistory([]);
          }}
        >
          Reiniciar
        </button>
      </div>
      <div
        ref={scrollRef}
        className="max-h-96 min-h-[280px] overflow-y-auto bg-[#0a0a0b] p-3 font-mono text-[11px] leading-relaxed md:text-xs"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "system"
                ? "mb-2 text-emerald-400/90"
                : line.type === "input"
                  ? "text-[#d4d4d4]"
                  : line.type === "prompt" && i === lines.length - 1
                    ? "hidden"
                    : line.type === "output"
                      ? "whitespace-pre-wrap text-[#9cdcfe]"
                      : "text-[#6a9955]"
            }
          >
            {line.text}
          </div>
        ))}
        <form onSubmit={onSubmit} className="flex items-center gap-0">
          <span className="shrink-0 text-[#6a9955]">{promptFor(state)}</span>
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 border-0 bg-transparent font-mono text-[11px] text-[#d4d4d4] caret-brand outline-none md:text-xs"
            spellCheck={false}
            autoComplete="off"
            aria-label="Comando de terminal"
          />
        </form>
      </div>
      <p className="border-t border-line bg-surface-2 px-4 py-2 text-[10px] text-faint">
        ↑↓ historial · Enter ejecutar · Prueba los comandos del desafío antes de rellenar los huecos
      </p>
    </div>
  );
}

function initialLines(scenario: ShellScenario, withWelcome = true): TerminalLine[] {
  const welcome = scenario.welcome ?? welcomeForPreset(scenario.preset);
  return withWelcome ? [{ type: "system", text: welcome }] : [];
}
