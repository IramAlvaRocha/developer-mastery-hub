// ──────────────────────────────────────────────────────────────────────────
// useFocusTrap — Fase 7 (Panel admin).
// Trampa de foco para diálogos: Tab/Shift+Tab ciclan dentro del contenedor
// mientras está activo. Cada diálogo conserva su propio Escape y foco inicial.
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;

    function onKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      const inside = activeEl ? root.contains(activeEl) : false;
      if (e.shiftKey) {
        if (!inside || activeEl === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ref, active]);
}
