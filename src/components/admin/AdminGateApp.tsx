// ──────────────────────────────────────────────────────────────────────────
// AdminGateApp — Fase 7 (Panel admin).
// Composición en un único árbol React: AuthProvider + AuthGate requireAdmin +
// AdminPanel. En modo demo AuthGate deja pasar y AdminPanel muestra el aviso.
// ──────────────────────────────────────────────────────────────────────────

import { AuthProvider } from "@/lib/auth/AuthContext";
import AuthGate from "@/components/auth/AuthGate";
import AdminPanel from "./AdminPanel";

export default function AdminGateApp() {
  return (
    <AuthProvider>
      <AuthGate requireAdmin>
        <div className="h-full">
          <AdminPanel />
        </div>
      </AuthGate>
    </AuthProvider>
  );
}
