# Developer Mastery Hub — Style Reference

> GSAP-inspired dark canvas + EduWave energy. Near-black stage, warm cream type, color-coded disciplines, soft filled chips, and high radii — never fully straight edges.

**Theme:** dark  
**Typography:** DM Sans (Mori substitute)  
**Motion:** GSAP letter stagger, tech marquee, scroll reveals (respect `prefers-reduced-motion`)

## Tokens — Colors

| Name | Value | Role |
|------|-------|------|
| Just Black | `#0e100f` | Page canvas |
| Surface Cream | `#fffce1` | Primary text, outlined borders |
| Surface 50 | `#7c7c6f` | Muted secondary text |
| Surface 25 | `#42433d` | Hairline borders |
| Off Black | `#191919` | Nested panels / cards |
| Shockingly Green | `#0ae448` | Brand accent, CTA gradient start |
| Light Green | `#abff84` | CTA gradient end |
| Orangey | `#ff8709` | Backend / SVG-style labels |
| Pink | `#fec5fb` | Scroll / soft accents |
| Lilac | `#9d95ff` | Text / TS accents |
| Blue | `#00bae2` | UI / cloud accents |
| Sage | `#a8e6a1` | Soft filled CTA (EduWave) |
| Peach | `#ffb7a1` | Soft chips |
| Butter | `#f5e6a3` | Soft chips / highlights |

## Shapes

- Cards: `28px` radius (never sharp rectangles)
- Inputs: `20px`
- Buttons / pills: `100px` / `9999px`
- No hard drop shadows — depth via gradients and surface steps

## Components

- **Ghost cream pill** — transparent + 1px cream border
- **Gradient-stroked CTA** — green→light-green border
- **Soft filled pill** — sage fill for primary marketing CTA
- **Curly-bracket eyebrow** — `{ Section name }`
- **Category color labels** — one hue per discipline

## Do

- Cream on near-black across the app
- High radii everywhere
- Responsive layouts (hamburger, fluid type, responsive grids)
- Static exercise solution panel (no AI mentor/chat)

## Don't

- Pure white `#fff` or pure black `#000`
- Fully rectangular cards/buttons
- Solid blue Material CTAs
- Inter / Roboto as primary UI font
