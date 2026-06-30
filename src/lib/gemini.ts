// ──────────────────────────────────────────────────────────────────────────
// Cliente de IA multi-proveedor con reintentos (backoff exponencial).
// Soporta Gemini (Google), Groq y OpenRouter. Cada usuario configura su
// proveedor y su API key; todo se guarda solo en localStorage.
// ──────────────────────────────────────────────────────────────────────────

export type AiProvider = "gemini" | "groq" | "openrouter";

interface ProviderConfig {
  /** Nombre legible para la UI. */
  label: string;
  /** Modelo por defecto. */
  defaultModel: string;
  /** Dónde conseguir la API key (gratis). */
  keyUrl: string;
  /** Pista del formato de la key para el placeholder. */
  keyPlaceholder: string;
}

export const PROVIDERS: Record<AiProvider, ProviderConfig> = {
  gemini: {
    label: "Google Gemini",
    defaultModel: "gemini-2.0-flash",
    keyUrl: "https://aistudio.google.com/apikey",
    keyPlaceholder: "AIzaSy...",
  },
  groq: {
    label: "Groq (gratis, rápido)",
    defaultModel: "llama-3.3-70b-versatile",
    keyUrl: "https://console.groq.com/keys",
    keyPlaceholder: "gsk_...",
  },
  openrouter: {
    label: "OpenRouter (multi-modelo)",
    defaultModel: "deepseek/deepseek-chat-v3-0324:free",
    keyUrl: "https://openrouter.ai/keys",
    keyPlaceholder: "sk-or-...",
  },
};

const PROVIDER_STORAGE = "mastery_hub_ai_provider";
const MODEL_STORAGE = "mastery_hub_ai_model";
const keyStorageFor = (provider: AiProvider) => `mastery_hub_key_${provider}`;
// Clave heredada de versiones anteriores (solo Gemini).
const LEGACY_GEMINI_KEY = "mastery_hub_gemini_key";

// ── Proveedor seleccionado ────────────────────────────────────────────────

export function getProvider(): AiProvider {
  if (typeof localStorage === "undefined") return "gemini";
  const stored = localStorage.getItem(PROVIDER_STORAGE) as AiProvider | null;
  return stored && stored in PROVIDERS ? stored : "gemini";
}

export function saveProvider(provider: AiProvider): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(PROVIDER_STORAGE, provider);
}

// ── Modelo (opcional; vacío = usa el modelo por defecto del proveedor) ─────

export function getModel(): string {
  if (typeof localStorage === "undefined") return "";
  return localStorage.getItem(MODEL_STORAGE) ?? "";
}

export function saveModel(model: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(MODEL_STORAGE, model);
}

function resolveModel(provider: AiProvider): string {
  return getModel().trim() || PROVIDERS[provider].defaultModel;
}

// ── API keys (una por proveedor) ──────────────────────────────────────────

export function getApiKey(provider: AiProvider = getProvider()): string {
  if (typeof localStorage === "undefined") return "";
  const key = localStorage.getItem(keyStorageFor(provider));
  if (key) return key;
  // Migración: si no hay key nueva pero existe la antigua de Gemini, úsala.
  if (provider === "gemini") {
    return localStorage.getItem(LEGACY_GEMINI_KEY) ?? "";
  }
  return "";
}

export function saveApiKey(key: string, provider: AiProvider = getProvider()): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(keyStorageFor(provider), key);
  if (provider === "gemini") localStorage.setItem(LEGACY_GEMINI_KEY, key);
}

export function getProviderLabel(provider: AiProvider = getProvider()): string {
  return PROVIDERS[provider].label;
}

// ── Llamada principal ──────────────────────────────────────────────────────

export async function callAi(
  prompt: string,
  systemInstruction?: string,
): Promise<string> {
  const provider = getProvider();
  const apiKey = getApiKey(provider);
  if (!apiKey) {
    throw new Error(
      `Configura tu API Key de ${PROVIDERS[provider].label} en ⚙️ Configuración (arriba a la derecha).`,
    );
  }

  let delay = 1000;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const text =
        provider === "gemini"
          ? await callGeminiApi(apiKey, prompt, systemInstruction)
          : await callOpenAiCompatible(provider, apiKey, prompt, systemInstruction);
      if (text) return text;
      throw new Error("Respuesta vacía del modelo.");
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error("No se pudo contactar al proveedor de IA.");
}

// Alias retrocompatible: el resto de la app puede seguir importando callGemini.
export const callGemini = callAi;

// ── Implementaciones por proveedor ─────────────────────────────────────────

async function callGeminiApi(
  apiKey: string,
  prompt: string,
  systemInstruction?: string,
): Promise<string | undefined> {
  const model = resolveModel("gemini");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

const OPENAI_ENDPOINTS: Record<Exclude<AiProvider, "gemini">, string> = {
  groq: "https://api.groq.com/openai/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
};

async function callOpenAiCompatible(
  provider: Exclude<AiProvider, "gemini">,
  apiKey: string,
  prompt: string,
  systemInstruction?: string,
): Promise<string | undefined> {
  const model = resolveModel(provider);
  const messages: { role: string; content: string }[] = [];
  if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
  messages.push({ role: "user", content: prompt });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  // OpenRouter recomienda estas cabeceras (opcionales) para identificar la app.
  if (provider === "openrouter" && typeof location !== "undefined") {
    headers["HTTP-Referer"] = location.origin;
    headers["X-Title"] = "Developer Mastery Hub";
  }

  const response = await fetch(OPENAI_ENDPOINTS[provider], {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return data?.choices?.[0]?.message?.content;
}
