import type { CSSProperties } from "react";

// ──────────────────────────────────────────────────────────────────────────
// Paleta de modulos: RGB equivalente a Tailwind 500/400 por color.
// Los componentes aplican `moduleColorStyle(color)` y usan clases `.mod-*`
// definidas en global.css (sin interpolacion dinamica ni safelist).
// ──────────────────────────────────────────────────────────────────────────

export type ModuleColorName =
  | "purple"
  | "cyan"
  | "emerald"
  | "yellow"
  | "green"
  | "teal"
  | "lime"
  | "blue"
  | "orange"
  | "slate"
  | "stone"
  | "sky"
  | "rose"
  | "amber"
  | "pink"
  | "violet"
  | "indigo";

export interface ModulePalette {
  /** Equivalente Tailwind *-500 */
  rgb: string;
  /** Equivalente Tailwind *-400 (texto/accentos) */
  rgbLight: string;
}

const DEFAULT: ModuleColorName = "blue";

const PALETTES: Record<ModuleColorName, ModulePalette> = {
  purple: { rgb: "168 85 247", rgbLight: "192 132 252" },
  cyan: { rgb: "6 182 212", rgbLight: "34 211 238" },
  emerald: { rgb: "16 185 129", rgbLight: "52 211 153" },
  yellow: { rgb: "234 179 8", rgbLight: "250 204 21" },
  green: { rgb: "34 197 94", rgbLight: "74 222 128" },
  teal: { rgb: "20 184 166", rgbLight: "45 212 191" },
  lime: { rgb: "132 204 22", rgbLight: "163 230 53" },
  blue: { rgb: "59 130 246", rgbLight: "96 165 250" },
  orange: { rgb: "249 115 22", rgbLight: "251 146 60" },
  slate: { rgb: "100 116 139", rgbLight: "148 163 184" },
  stone: { rgb: "120 113 108", rgbLight: "168 162 158" },
  sky: { rgb: "14 165 233", rgbLight: "56 189 248" },
  rose: { rgb: "244 63 94", rgbLight: "251 113 133" },
  amber: { rgb: "245 158 11", rgbLight: "251 191 36" },
  pink: { rgb: "236 72 153", rgbLight: "244 114 182" },
  violet: { rgb: "139 92 246", rgbLight: "167 139 250" },
  indigo: { rgb: "99 102 241", rgbLight: "129 140 248" },
};

export function getModulePalette(color: string): ModulePalette {
  return PALETTES[color as ModuleColorName] ?? PALETTES[DEFAULT];
}

/** Variables CSS `--module-rgb` / `--module-rgb-light` para clases `.mod-*`. */
export function moduleColorStyle(color: string): CSSProperties {
  const { rgb, rgbLight } = getModulePalette(color);
  return {
    "--module-rgb": rgb,
    "--module-rgb-light": rgbLight,
  } as CSSProperties;
}
