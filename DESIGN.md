# Design System Inspired by DesignMD

## 1. Visual Theme & Atmosphere

DesignMD's design system embodies a modern, tech-forward aesthetic built for productivity and clarity. The interface features a sophisticated dark theme with vibrant blue accents that draw focus to primary actions and interactive elements. The overall mood is professional yet approachable, combining deep neutral backgrounds with high-contrast typography and purposeful use of subtle elevation and micro-interactions. This design language prioritizes content hierarchy, accessibility, and the seamless flow of information—reflecting the product's core value of turning design extraction into an instant, effortless process.

**Key Characteristics**
- Dark-first design with high contrast for readability and reduced eye strain
- Strategic use of blue (#3B82F6) as the primary interaction color, appearing in CTAs, accents, and focus states
- Subtle depth through layered card styling and refined shadow treatments
- Clean, minimalist layout with generous whitespace between functional zones
- Typography-driven hierarchy using consistent spacing and weight variations
- Approachable, friendly tone balanced with technical precision

## 2. Color Palette & Roles

### Primary
- **Primary Action Blue** (`#3B82F6`): Primary buttons, CTAs, links, focus states, and interactive highlights; the system's signature accent
- **Primary Hover Blue** (`#2563EB`): Darker blue applied on hover states and active interactions for tactile feedback

### Accent Colors
- **Light Blue 1** (`#60A5FA`): Lighter blue tint for secondary accent states and subtle highlights
- **Light Blue 2** (`#93BBFD`): Even lighter blue used for background overlays and preview states
- **Light Blue 3** (`#BFDBFE`): Pale blue for very light backgrounds or disabled states
- **Dark Red** (`#7F1D1D`): Reserved for error, warning, or destructive actions (minimal usage)

### Interactive
- **Interactive Background Dark** (`#1C1C1C`): Dark background for input and interactive container states
- **Interactive Border Neutral** (`#333333`): Primary border color for inputs, cards, and container outlines
- **Interactive Border Light** (`#A3A3A3`): Secondary border for less prominent divisions

### Neutral Scale
- **Neutral Dark** (`#171717`): Darkest neutral, used sparingly for emphasis or deep backgrounds
- **Neutral Medium** (`#333333`): Primary text and border color on light backgrounds (most used)
- **Neutral Light** (`#A3A3A3`): Secondary text, labels, and disabled states
- **Neutral Lightest** (`#FAFAFA`): Light neutral used in text and subtle backgrounds

### Surface & Borders
- **Surface Black** (`#1C1C1C`): Primary dark surface and container background
- **Surface Charcoal** (`#1C1C1C`): Secondary dark surface overlay
- **Border Dark** (`#333333`): Standard border stroke for containers and components
- **Border Light** (`#E5E5E5`): Subtle borders on light backgrounds
- **Background Light** (`#F0F0F0`): Optional light background for secondary surfaces
- **White** (`#FFFFFF`): Pure white for maximum contrast or light mode surfaces

## 3. Typography Rules

### Font Family
- **Primary:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Secondary:** Inter (same as primary; no secondary typeface differentiation needed)
- **Monospace (if needed):** "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Menlo, Courier, monospace

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | Inter | 48px | 700 | 48px | 0px | Hero headings, page titles |
| Heading / H2 | Inter | 32px | 700 | 40px | 0px | Section headings (inferred) |
| Heading / H3 | Inter | 24px | 600 | 32px | 0px | Subsection headings (inferred) |
| Body Text | Inter | 16px | 400 | 26px | 0px | Primary body copy, descriptions |
| Body Emphasis | Inter | 18px | 600 | 28px | 0px | Emphasized text, strong copy |
| Button / CTA | Inter | 14px | 500 | 20px | 0px | Button labels and calls-to-action |
| Input Text | Inter | 14px | 400 | 20px | 0px | Form inputs and placeholder text |
| Small / Caption | Inter | 12px | 400 | 16px | 0px | Captions, labels, small text (inferred) |
| Link | Inter | 14px–16px | 400 | 20px–24px | 0px | Text links (size varies by context) |

### Principles
- **Single typeface philosophy:** Inter is used exclusively across all text roles, promoting visual consistency and reducing font loading overhead
- **Weight hierarchy:** Four weights used (400 regular, 500 medium, 600 semibold, 700 bold) to establish clear visual hierarchy without multiple typefaces
- **Line height consistency:** Generous line heights (1.2–1.6× of font size) ensure readability on dark backgrounds and improve scanability
- **Size progression:** Sizes follow a predictable scale (12, 14, 16, 18, 24, 32, 48px) for easy memorization and consistent spacing
- **Compact buttons:** Button text uses 14px weight 500 to maintain clarity in constrained spaces while preserving visual hierarchy

## 4. Component Stylings

### Buttons

#### Primary CTA Button
- **Background:** `#3B82F6`
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `600`
- **Padding:** `14px 32px`
- **Border Radius:** `14px`
- **Border:** None
- **Box Shadow:** `rgba(59, 130, 246, 0.3) 0px 0px 20px 0px`
- **Height:** `48px`
- **Line Height:** `20px`
- **Hover State:** Background changes to `#2563EB`, shadow intensifies
- **Active State:** Background becomes `#1D4ED8`, shadow reduces
- **Disabled State:** Background becomes `#60A5FA` with reduced opacity `0.6`

#### Secondary Button (Outlined)
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#FAFAFA`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Padding:** `16px 16px`
- **Border Radius:** `14px`
- **Border:** `1px solid #333333`
- **Box Shadow:** None
- **Height:** `48px` (adaptive)
- **Line Height:** `24px`
- **Hover State:** Border color changes to `#3B82F6`, text brightens slightly
- **Active State:** Background becomes `rgba(59, 130, 246, 0.1)`

#### Ghost Button
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#FAFAFA`
- **Font Size:** `14px`
- **Font Weight:** `600`
- **Padding:** `8px 12px`
- **Border Radius:** `8px`
- **Border:** None
- **Box Shadow:** None
- **Height:** `auto`
- **Hover State:** Background becomes `rgba(255, 255, 255, 0.1)`
- **Active State:** Background becomes `rgba(59, 130, 246, 0.2)`

#### Icon Button (Circular)
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Icon Color:** `#FAFAFA`
- **Width:** `36px`
- **Height:** `36px`
- **Border Radius:** `50px` (fully rounded)
- **Border:** None
- **Padding:** `0px`
- **Display:** Flex center alignment
- **Hover State:** Background becomes `rgba(255, 255, 255, 0.1)`

### Cards & Containers

#### Standard Card
- **Background:** `#1C1C1C`
- **Text Color:** `#FAFAFA`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Padding:** `24px`
- **Border Radius:** `14px`
- **Border:** `1px solid #333333`
- **Box Shadow:** None
- **Line Height:** `24px`
- **Hover State:** Border color lightens to `#555555`, subtle background shift

#### Input Container / Search Box
- **Background:** `rgba(26, 26, 26, 0.3)` (semi-transparent dark)
- **Text Color:** `#FAFAFA`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Padding:** `4px 10px 4px 40px` (left padding for icon)
- **Border Radius:** `10px`
- **Border:** `1px solid #333333`
- **Height:** `48px`
- **Line Height:** `20px`
- **Placeholder Text Color:** `#A3A3A3`
- **Focus State:** Border becomes `#3B82F6`, background lightens slightly, box shadow adds `0px 0px 20px rgba(59, 130, 246, 0.2)`

#### Badge / Tag
- **Background:** `#1C1C1C`
- **Text Color:** `#A3A3A3`
- **Font Size:** `12px`
- **Font Weight:** `500`
- **Padding:** `6px 14px`
- **Border Radius:** `50px` (fully rounded)
- **Border:** `1px solid rgba(26, 26, 26, 0.5)`
- **Height:** `30px`
- **Line Height:** `16px`

### Inputs & Forms

#### Text Input
- **Background:** `rgba(26, 26, 26, 0.3)`
- **Text Color:** `#FAFAFA`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Padding:** `4px 10px 4px 40px`
- **Border Radius:** `10px`
- **Border:** `1px solid #333333`
- **Height:** `48px`
- **Line Height:** `20px`
- **Focus State:** Border becomes `#3B82F6`, apply `0px 0px 20px rgba(59, 130, 246, 0.2)` shadow
- **Error State:** Border becomes `#7F1D1D`, background tints red at `0.05` opacity
- **Placeholder:** `#A3A3A3` color, same font properties

#### Label
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Color:** `#FAFAFA`
- **Margin Bottom:** `8px`
- **Line Height:** `20px`

### Navigation

#### Primary Navigation Link
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#FAFAFA`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Padding:** `0px` (no padding on text-only links)
- **Border Radius:** `0px`
- **Border:** None
- **Hover State:** Text color becomes `#3B82F6`, underline appears `1px solid #3B82F6`
- **Active State:** Text color is `#3B82F6`, underline persists

#### Secondary Navigation Link
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#A3A3A3`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Hover State:** Text color becomes `#FAFAFA`, optional underline `1px solid #FAFAFA`
- **Active State:** Text color becomes `#3B82F6`

#### Breadcrumb Link
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#3B82F6`
- **Font Size:** `12px`
- **Font Weight:** `400`
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Separator:** ` / ` in `#A3A3A3`
- **Hover State:** Text color becomes `#2563EB`, subtle underline optional

## 5. Layout Principles

### Spacing System
- **Base Unit:** `8px`
- **Scale:** `8px, 12px, 16px, 24px, 40px, 48px, 64px, 80px`
- **Usage Context:**
  - `8px`: Micro-spacing between inline elements, icon-text pairs
  - `12px`: Compact gaps between form elements, button groups
  - `16px`: Padding within cards, input fields, small containers
  - `24px`: Standard padding for medium cards and sections
  - `40px`: Margin between major content blocks
  - `48px`: Padding for larger sections, top/bottom of containers
  - `64px`: Page section margins, hero spacing
  - `80px`: Full-page top/bottom margins, hero padding

### Grid & Container
- **Max Width:** `1200px` (standard content container)
- **Sidebar Width:** Not defined in extracted tokens; infer `280px–320px` if needed
- **Column Strategy:** 12-column flexible grid; sections adapt from 1–4 columns depending on breakpoint
- **Section Pattern:** Centered content blocks with `40px–80px` vertical rhythm between sections
- **Horizontal Padding:** `24px` on medium/large screens, `16px` on small screens

### Whitespace Philosophy
- **Generous margins:** Space between content blocks prevents visual crowding and guides user focus
- **Breathing room around CTAs:** Primary buttons are surrounded by at least `24px` whitespace
- **Stacked vertical rhythm:** Consistent `40px` margins create predictable visual flow
- **Card isolation:** Cards maintain clear separation with `16px` gap between them
- **Dark background advantage:** The dark theme allows negative space to feel intentional rather than empty

### Border Radius Scale
- **Fully Rounded (Pill):** `50px` — badges, icon buttons, search pills
- **Large Radius:** `14px` — standard buttons, cards, input fields, most containers
- **Medium Radius:** `10px` — input boxes, smaller card variants
- **Small Radius:** `8px` — inferred for smaller UI components, micro-interactions
- **No Radius:** `0px` — links, lines, dividers, text-only elements

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base (0) | No shadow, flat | Text, labels, backgrounds |
| Hover (1) | `rgba(59, 130, 246, 0.2) 0px 0px 10px 0px` | On-hover interactive elements |
| Raised (2) | `rgba(59, 130, 246, 0.3) 0px 0px 20px 0px` | Primary CTAs, focused inputs |
| Floating (3) | `0px 10px 15px -3px rgba(0, 0, 0, 0.2), 0px 4px 6px -4px rgba(0, 0, 0, 0.2)` | Modals, dropdowns, floating panels |

**Shadow Philosophy:**
The design system employs a restrained shadow strategy aligned with the dark theme. Rather than heavy drop shadows, the system uses subtle blue-tinted shadows (`rgba(59, 130, 246, 0.2–0.3)`) for primary interactive elements, creating visual hierarchy while maintaining the sophisticated dark aesthetic. Dark modal shadows remain neutral (`rgba(0, 0, 0, 0.2)`) to avoid visual harshness. Depth is achieved primarily through layered container backgrounds and border treatment, with shadows serving as accent cues for interactive focus, not primary depth indicators.

## 7. Do's and Don'ts

### Do
- **Use `#3B82F6` for all primary CTAs and interactive focus states** to maintain a consistent, recognizable call-to-action language
- **Maintain `14px` font weight 500 for all button labels** for consistent visual weight and readability
- **Surround major sections with `40px–80px` vertical spacing** to create predictable information hierarchy and visual breathing room
- **Apply `#333333` borders to all cards and containers** unless a focus or hover state is active
- **Use `#A3A3A3` for secondary text, labels, and disabled states** to create clear visual separation without introducing new colors
- **Round buttons and cards to `14px`** for the system's signature modern, approachable feel
- **Nest input padding as `4px 10px 4px 40px`** to accommodate leading icons and prevent text overlap
- **Pair dark backgrounds (`#1C1C1C`) with light text (`#FAFAFA`)** for maximum contrast and accessibility
- **Include blue glow shadows on primary actions** to draw focus and reinforce interactivity

### Don't
- **Avoid using more than three distinct button styles on a single page** — stick to primary, secondary, and ghost variants
- **Don't apply custom colors outside the defined palette** — the 14-color system is intentionally comprehensive
- **Never use text lighter than `#A3A3A3` on dark backgrounds** — accessibility and readability will suffer
- **Avoid shadows heavier than `rgba(59, 130, 246, 0.3) 0px 0px 20px`** — the dark theme should remain sophisticated, not cluttered
- **Don't exceed `80px` padding within single containers** — maintain visual density and scan efficiency
- **Never round corners below `8px`** on interactive elements — the system's minimum is `8px`
- **Avoid mixing Inter with other typefaces** in the UI — single-typeface consistency is core to the design language
- **Don't add opacity layers below `0.3` on interactive backgrounds** — interactions must remain visually distinct
- **Never place text directly on colored backgrounds without sufficient contrast** — all text must maintain WCAG AA minimum 4.5:1 ratio

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | 320px–767px | Single-column layout, full-width cards, `16px` side padding, smaller buttons, stacked navigation |
| Tablet | 768px–1023px | Two-column layout, cards expand to fill space, `24px` side padding, optional multi-line navigation |
| Desktop | 1024px–1439px | Three-column grid, max-width containers, standard spacing, full navigation bar |
| Large Desktop | 1440px+ | Four-column grid, centered max-width `1200px`, generous margins, fixed sidebars if present |

### Touch Targets
- **Minimum height:** `44px` for all interactive elements (buttons, inputs, links)
- **Minimum width:** `44px` for icon buttons and touch-only interactions
- **Horizontal spacing between targets:** Minimum `12px` gap to prevent accidental adjacent taps
- **Padding within touch targets:** Minimum `8px` internal padding for comfortable tap zones

### Collapsing Strategy
- **Mobile (< 768px):**
  - Cards stack single-column; width becomes `100%` minus `16px` side margins
  - Multi-action groups collapse to single-column button stacks
  - Form inputs expand to full available width
  - Navigation collapses into hamburger menu; drawer slides from left or top
  - Large typography (H1) reduces from `48px` to `32px`
  - Section padding reduces from `80px` to `48px`
  - Horizontal spacing scale compresses by ~40%

- **Tablet (768px–1023px):**
  - Two-column layout for card grids; cards maintain proportional widths
  - Buttons remain full-width in forms but can pair horizontally in actions
  - Navigation becomes horizontal tab bar or compact menu
  - Typography remains at full scale; line heights may tighten slightly
  - Section padding remains at `64px`

- **Desktop (> 1024px):**
  - Cards display in flexible grid (2–4 columns based on content)
  - Buttons return to intrinsic sizing; multi-action groups display horizontally
  - Full horizontal navigation bar appears
  - All typography at full scale
  - Maximum container width enforced at `1200px`, centered
  - Full spacing scale applied

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Primary Action Blue (`#3B82F6`)
- **Primary Hover:** Primary Hover Blue (`#2563EB`)
- **Background (Dark):** Surface Black (`#1C1C1C`)
- **Heading Text:** Neutral Lightest (`#FAFAFA`)
- **Body Text:** Neutral Lightest (`#FAFAFA`)
- **Secondary Text:** Neutral Light (`#A3A3A3`)
- **Borders:** Interactive Border Neutral (`#333333`)
- **Input Background:** Interactive Background Dark (`#1C1C1C`) at `0.3` opacity
- **Links:** Primary Action Blue (`#3B82F6`)
- **Error/Warning:** Dark Red (`#7F1D1D`)

### Iteration Guide

1. **Font Foundation:** Use Inter exclusively across all text roles; no fallback typefaces. Weights are 400 (regular), 500 (medium), 600 (semibold), and 700 (bold). Button labels always use weight 500 at 14px.

2. **Button Semantics:** Primary buttons are solid blue (`#3B82F6`) with white text and `0px 0px 20px rgba(59, 130, 246, 0.3)` glow shadow. Secondary buttons are transparent with `1px solid #333333` borders. Hover states shift primary buttons to `#2563EB`; secondary buttons add a blue border on hover.

3. **Dark Theme Contrast:** All text on dark backgrounds must meet WCAG AA 4.5:1 contrast minimum. Use `#FAFAFA` for primary text, `#A3A3A3` for secondary. Never use text colors lighter than `#A3A3A3` on `#1C1C1C` backgrounds.

4. **Spacing Discipline:** Base unit is 8px. Apply consistent multiples: 8, 12, 16, 24, 40, 48, 64, 80. Section vertical margins are `40px` minimum; major content blocks use `64px–80px`. Padding within containers is `16px–24px`.

5. **Interactive States:** All interactive elements (buttons, inputs, links) must have distinct hover and active states. Inputs gain a blue focus shadow `0px 0px 20px rgba(59, 130, 246, 0.2)` and border color `#3B82F6` on focus. Buttons darken on hover and click.

6. **Border Radius Consistency:** Apply `14px` to all primary buttons, cards, and standard containers. Use `10px` for inputs and `50px` for fully rounded pills (badges, icon buttons). Smaller components can use `8px`.

7. **Card & Container Styling:** All cards have background `#1C1C1C`, border `1px solid #333333`, padding `24px`, and border radius `14px`. Cards do not use shadows; depth comes from layered backgrounds and borders.

8. **Form Inputs:** Input fields are `48px` tall, with padding `4px 10px 4px 40px` (left padding for icons). Background is `rgba(26, 26, 26, 0.3)`. Placeholder and label text is `#A3A3A3` at `14px` weight 400. Focus state adds blue border and glow shadow.

9. **Typography Hierarchy:** Use H1 at 48px/700 for page titles, body at 16px/400 for descriptions, and 14px/500 for button labels. Emphasized text (H2/H3) uses weight 600. Small captions are 12px/400. Line heights are generous (1.2–1.6×) for dark backgrounds.

10. **Responsive Strategy:** Mobile layouts stack single-column with 16px side padding. Tablet introduces two-column grids at 24px padding. Desktop uses flexible grids up to 4 columns with max-width 1200px and 80px section margins. Touch targets maintain 44px minimum; collapse navigation into hamburger below 768px.