// ──────────────────────────────────────────────────────────────────────────
// Cliente de Gemini con reintentos (backoff exponencial).
// La API key se guarda en localStorage y solo se usa para llamadas directas.
// ──────────────────────────────────────────────────────────────────────────

const API_KEY_STORAGE = "mastery_hub_gemini_key";

export function getApiKey(): string {
  if (typeof localStorage === "undefined") return "";
  return localStorage.getItem(API_KEY_STORAGE) ?? "";
}

export function saveApiKey(key: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(API_KEY_STORAGE, key);
}

export async function callGemini(
  prompt: string,
  systemInstruction?: string,
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Configura tu API Key de Gemini en el menu principal.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  let delay = 1000;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const text: string | undefined =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
      throw new Error("Respuesta vacia de Gemini.");
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error("No se pudo contactar a Gemini.");
}
