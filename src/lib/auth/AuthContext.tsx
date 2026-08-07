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
  const isDemoMode = !supabase;
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
        setRole("student");
        return;
      }
      setRole(data?.role === "admin" ? "admin" : "student");
    },
    [supabase],
  );

  // Restaura la sesión al montar (modo Supabase).
  useEffect(() => {
    if (!supabase) return;
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
        const parsed = JSON.parse(raw) as { user?: AuthUser; role?: AuthRole };
        if (parsed.user?.id) {
          setUser(parsed.user);
          setRole(parsed.role === "admin" ? "admin" : "student");
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

  // Restaura el perfil local del stub (modo demo).
  useEffect(() => {
    if (supabase) return;
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
  }, [supabase]);

  // Caché local de user/role para arranque rápido (solo Supabase).
  useEffect(() => {
    if (!supabase) return;
    try {
      if (user) {
        localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({ user, role }));
      } else {
        localStorage.removeItem(SESSION_CACHE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [supabase, user, role]);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) {
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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return error ? { error: error.message } : { error: null };
    },
    [supabase],
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) {
      return signInWithEmail("demo@developer-mastery-hub.local", "demo");
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/aprender` },
    });
    return error ? { error: error.message } : { error: null };
  }, [supabase, signInWithEmail]);

  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) return signInWithEmail(email, password);
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
    [supabase, signInWithEmail],
  );

  const signOut = useCallback(async () => {
    if (!supabase) {
      clearAuthProfile();
      setUser(null);
      setRole(null);
      return;
    }
    await supabase.auth.signOut();
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const uid = session?.user.id;
    if (uid) {
      setUser(userFromSupabase(session.user));
      await loadProfile(uid);
    }
  }, [supabase, loadProfile]);

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
