// ──────────────────────────────────────────────────────────────────────────
// AuthGateApp — Fase 2.
// Composición en un único árbol React: AuthProvider + AuthGate + MasteryHub.
// Astro renderiza los children de una isla como un root React separado, así
// que el provider debe envolver todo aquí dentro para que el Context fluya.
// ──────────────────────────────────────────────────────────────────────────

import { AuthProvider } from "@/lib/auth/AuthContext";
import AuthGate from "./AuthGate";
import MasteryHub from "@/components/MasteryHub";

interface AuthGateAppProps {
  requireAdmin?: boolean;
}

export default function AuthGateApp({ requireAdmin = false }: AuthGateAppProps) {
  return (
    <AuthProvider>
      <AuthGate requireAdmin={requireAdmin}>
        <div className="h-full">
          <MasteryHub />
        </div>
      </AuthGate>
    </AuthProvider>
  );
}
