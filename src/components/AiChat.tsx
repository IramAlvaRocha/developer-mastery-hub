import { useEffect, useRef, useState } from "react";
import { callGemini } from "@/lib/gemini";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

interface Props {
  systemPrompt: string;
}

const PREDEFINED: Record<string, string> = {
  hint: "Dame una pista discreta para resolver este ejercicio.",
  concept: "Explica el concepto teorico detras de este patron.",
  dotnet: "Como se conecta este tema con C# / .NET / ASP.NET Core?",
};

export default function AiChat({ systemPrompt }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, sender: "user", text: trimmed },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await callGemini(trimmed, systemPrompt);
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now() + 1}`, sender: "ai", text: reply },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reintenta.";
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now() + 1}`, sender: "ai", text: `Error: ${message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-50 flex flex-col items-end md:bottom-24">
      {isOpen && (
        <div className="pointer-events-auto mb-3 flex h-[420px] w-80 flex-col overflow-hidden rounded-card border border-line bg-surface shadow-float md:w-96">
          <div className="flex shrink-0 items-center justify-between border-b border-line bg-surface-2 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand/15 text-base">
                🤖
              </span>
              <div>
                <h4 className="text-[13px] font-bold text-ink">
                  Mentor IA · Gemini
                </h4>
                <p className="text-[10px] text-muted">
                  Conceptos de desarrollo avanzado
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="icon-btn"
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="flex-grow space-y-3 overflow-y-auto bg-base p-3"
          >
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <span className="mb-2 text-2xl">🤖</span>
                <p className="text-[13px] font-semibold text-ink">
                  Soy tu Mentor de IA.
                </p>
                <p className="mt-1 max-w-[200px] text-[11px] text-muted">
                  Pregúntame sobre cualquier tema del módulo activo.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-[12px] p-2.5 text-xs ${
                    msg.sender === "user"
                      ? "bg-brand font-medium text-white"
                      : "border border-line bg-surface text-muted"
                  }`}
                >
                  <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wide opacity-70">
                    {msg.sender === "user" ? "Tú" : "Gemini"}
                  </span>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-[70%] space-y-2 rounded-[12px] border border-line bg-surface p-2.5">
                  <span className="block text-[9px] font-bold uppercase opacity-70">
                    Gemini
                  </span>
                  <div className="shimmer-loading h-2.5 w-3/4 rounded"></div>
                  <div className="shimmer-loading h-2.5 w-full rounded"></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 gap-1.5 overflow-x-auto border-t border-line bg-surface-2 p-2">
            {Object.entries(PREDEFINED).map(([key, label]) => (
              <button
                key={key}
                onClick={() => send(label)}
                disabled={isLoading}
                className="shrink-0 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-brand hover:text-ink disabled:opacity-50"
              >
                ✨{" "}
                {key === "hint" ? "Pista" : key === "concept" ? "Teoría" : ".NET"}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 gap-2 border-t border-line bg-surface-2 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(input);
              }}
              disabled={isLoading}
              type="text"
              placeholder="Pregunta técnica…"
              className="input-field !min-h-0 h-10 text-xs"
            />
            <button
              onClick={() => send(input)}
              disabled={isLoading || !input.trim()}
              className="btn-primary"
            >
              Ir
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-glow transition-transform hover:scale-105 active:scale-95"
      >
        <span>✨</span>
        <span>Mentor IA</span>
      </button>
    </div>
  );
}
