// ──────────────────────────────────────────────────────────────────────────
// Cliente Supabase (Fase 1).
// Seguro sin credenciales: si faltan las env vars, `isSupabaseConfigured` es
// false y `getSupabase()` devuelve null — el build y la app no se rompen.
// Nunca exponer SUPABASE_SERVICE_ROLE_KEY aquí (esa es solo para scripts).
// ──────────────────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as
  | string
  | undefined;

/** true solo si las credenciales públicas están presentes (p. ej. en `.env`). */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && supabaseAnonKey,
);

let cachedClient: SupabaseClient | null = null;

/**
 * Devuelve el cliente Supabase (singleton) o `null` si no hay credenciales.
 * No crea el cliente en top-level: `createClient` con url undefined lanza.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl as string, supabaseAnonKey as string);
  }
  return cachedClient;
}
