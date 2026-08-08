// ──────────────────────────────────────────────────────────────────────────
// AuthContext — Fase 2.
// Doble modo:
//   • Supabase: login real (email/contraseña + Google OAuth), sesión
//     persistente vía onAuthStateChange y role desde `profiles`.
//   • Demo: fallback al stub local (`@/lib/authStub`) para que la UI de
//     login/gate se pueda probar sin credenciales.
// SSR-safe: nada de window/localStorage durante el render; todo ocurre en
// effects o handlers. Sin console.* (hook de seguridad del repo).
// ──────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import {
  clearAuthProfile,
  readAuthProfile,
  saveAuthProfile,
} from "@/lib/authStub";

export type AuthRole = "admin" | "student";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface AuthResult {
  error: string | null;
  message?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: AuthRole | null;
  loading: boolean;
  isDemoMode: boolean;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const SESSION_CACHE_KEY = "dmh-auth-session-cache";

function userFromSupabase(u: User): AuthUser {
  const meta = u.user_metadata as Record<string, unknown> | undefined;
  return {
    id: u.id,
    email: u.email ?? "",
    displayName:
      (typeof meta?.name === "string" ? meta.name : undefined) ??
      (typeof meta?.full_name === "string" ? meta.full_name : undefined) ??
      (u.email ? u.email.split("@")[0] : null),
    avatarUrl: typeof meta?.avatar_url === "string" ? meta.avatar_url : null,
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState<SupabaseClient | null>(() => getSupabase());
  // Fase 8 (M4): fail-closed — el demo solo está disponible en desarrollo.
  // En producción sin credenciales la app NO cae a modo demo (AuthGate
  // muestra "Servicio no configurado" en vez de saltarse el login).
  const isDemoMode = !supabase && !import.meta.env.PROD;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<AuthRole | null>(null);
  const [loading, setLoading] = useState<boolean>(() => !isDemoMode);
  const profileUserIdRef = useRef<string | null>(null);

  const loadProfile = useCallback(
    async (userId: string) => {
      if (!supabase) return;
      if (profileUserIdRef.current === userId) return;
      profileUserIdRef.current = userId;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      if (error) {
        // Fase 8 (M2): permite reintentar ante un fallo de red puntual en vez
        // de degradar al usuario a `student` de forma permanente.
        profileUserIdRef.current = null;
        setRole("student");
        return;
      }
      setRole(data?.role === "admin" ? "admin" : "student");
    },
    [supabase],
  );

  // Restaura la sesión al montar (modo Supabase).
  useEffect(() => {
    if (!supabase) {
      // Producción sin credenciales: sin cliente no hay sesión que restaurar.
      setLoading(false);
      return;
    }
    let active = true;

    const applyUser = (u: User | undefined) => {
      if (!active) return;
      if (u) {
        setUser(userFromSupabase(u));
        void loadProfile(u.id);
      } else {
        setUser(null);
        setRole(null);
        profileUserIdRef.current = null;
      }
    };

    try {
      const raw = localStorage.getItem(SESSION_CACHE_KEY);
      if (raw) {
        // Fase 8 (M1): la caché guarda SOLO { user } — el role nunca viene de
        // localStorage (se obtiene siempre vía loadProfile desde profiles).
        const parsed = JSON.parse(raw) as { user?: AuthUser };
        if (parsed.user?.id) {
          setUser(parsed.user);
        }
      }
    } catch {
      /* ignore */
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      applyUser(data.session?.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      applyUser(session?.user ?? undefined);
      if (event === "SIGNED_OUT") setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  // Restaura el perfil local del stub (solo en modo demo; Fase 8 M4: en
  // producción el stub nunca debe crear sesión).
  useEffect(() => {
    if (!isDemoMode) return;
    const stub = readAuthProfile();
    if (stub) {
      setUser({
        id: `demo:${stub.email}`,
        email: stub.email,
        displayName: stub.name,
        avatarUrl: stub.avatarDataUrl ?? null,
      });
      setRole("student");
    }
  }, [isDemoMode]);

  // Caché local del usuario para arranque rápido (solo Supabase). El role NO
  // se cachea (Fase 8 M1): siempre se resuelve vía loadProfile.
  useEffect(() => {
    if (!supabase) return;
    try {
      if (user) {
        localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({ user }));
      } else {
        localStorage.removeItem(SESSION_CACHE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [supabase, user]);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (isDemoMode) {
        const clean = email.trim();
        if (!clean) return { error: "Introduce un email." };
        const name = clean.split("@")[0] || "Demo";
        saveAuthProfile({ email: clean, name });
        setUser({
          id: `demo:${clean}`,
          email: clean,
          displayName: name,
          avatarUrl: readAuthProfile()?.avatarDataUrl ?? null,
        });
        setRole("student");
        return { error: null };
      }
      if (!supabase) {
        return { error: "Servicio no configurado: faltan las credenciales de Supabase." };
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return error ? { error: error.message } : { error: null };
    },
    [supabase, isDemoMode],
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    if (isDemoMode) {
      return signInWithEmail("demo@developer-mastery-hub.local", "demo");
    }
    if (!supabase) {
      return { error: "Servicio no configurado: faltan las credenciales de Supabase." };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/aprender` },
    });
    return error ? { error: error.message } : { error: null };
  }, [supabase, isDemoMode, signInWithEmail]);

  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (isDemoMode) return signInWithEmail(email, password);
      if (!supabase) {
        return { error: "Servicio no configurado: faltan las credenciales de Supabase." };
      }
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) return { error: error.message };
      if (!data.session) {
        return {
          error: null,
          message:
            "Cuenta creada. Revisa tu correo para confirmar antes de iniciar sesión.",
        };
      }
      return { error: null };
    },
    [supabase, isDemoMode, signInWithEmail],
  );

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      clearAuthProfile();
      setUser(null);
      setRole(null);
      return;
    }
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [supabase, isDemoMode]);

  const refreshProfile = useCallback(async () => {
    if (isDemoMode) {
      const stub = readAuthProfile();
      if (stub) {
        setUser({
          id: `demo:${stub.email}`,
          email: stub.email,
          displayName: stub.name,
          avatarUrl: stub.avatarDataUrl ?? null,
        });
        setRole("student");
      }
      return;
    }
    if (!supabase) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const uid = session?.user.id;
    if (uid) {
      setUser(userFromSupabase(session.user));
      await loadProfile(uid);
    }
  }, [supabase, isDemoMode, loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      isDemoMode,
      signInWithEmail,
      signInWithGoogle,
      signUp,
      signOut,
      refreshProfile,
    }),
    [
      user,
      role,
      loading,
      isDemoMode,
      signInWithEmail,
      signInWithGoogle,
      signUp,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
