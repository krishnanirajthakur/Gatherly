---
name: Warm Operational Directness
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#574237'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8a7265'
  outline-variant: '#dec1b2'
  surface-tint: '#9a4600'
  primary: '#9a4600'
  on-primary: '#ffffff'
  primary-container: '#e87524'
  on-primary-container: '#4f2000'
  inverse-primary: '#ffb68d'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e3e2e2'
  on-secondary-container: '#646464'
  tertiary: '#9e4300'
  on-tertiary: '#ffffff'
  tertiary-container: '#e8742e'
  on-tertiary-container: '#501e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc9'
  primary-fixed-dim: '#ffb68d'
  on-primary-fixed: '#321200'
  on-primary-fixed-variant: '#763300'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783100'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  section-title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  numeric-stat:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses a warm, dependable, and disciplined contemporary aesthetic tailored for operational intelligence and event logistics. The interface communicates capability without unnecessary ornamentation: confident, organized, human, and structured. 

The visual style is rooted in rigorous contemporary minimalism paired with tactile structural clarity. Every element is bound by purposeful borders, deliberate geometric proportion, and clear spatial hierarchy. There are strictly no gradients, no translucent blurs, and no glassmorphic treatments. All visual weights are conveyed via crisp solid fills, precise 1px dividing lines, and unadorned surfaces that prioritize rapid legibility, schedule comprehension, and trustworthy task execution.

## Colors

The color architecture is built exclusively on flat, solid tones engineered to meet WCAG 2.2 AA contrast standards across all touchpoints.

### Core Swatches
- **Primary Orange (`#E87524`):** Primary interactive targets, primary action buttons, active navigation markers, and decisive confirmations.
- **Dark Orange (`#C95D16`):** Hover and pressed states for primary triggers; ensures immediate feedback while maintaining robust contrast against both white and light backgrounds.
- **Subtle Orange Tint (`#FFF1E5`):** Reserved for low-emphasis badges, tag backgrounds, active tab pills, and table selection highlights. Never used for primary callouts.
- **Main Background (`#F7F7F5`):** A soft, neutral architectural backdrop that reduces eye strain in data-dense planning views.
- **Card & Container Surface (`#FFFFFF`):** Pure solid white for modules, task boards, itinerary rows, modals, and input panels.
- **Main Text (`#252525`):** Near-black charcoal used for high-contrast headlines, monetary values, and core content body.
- **Secondary / Muted Text (`#747474`):** Mid-tone neutral for supporting metadata, field helper labels, timestamps, and placeholder states.
- **Borders & Dividers (`#E7E5E2`):** Structural 1px separation lines for panels, tables, input bounds, and list items.
- **Focus Ring (`#A94F13`):** High-visibility perimeter for keyboard focus indicators.

### Semantic Tones
- **Success:** Solid `#287A4B` (text and icons) with `#EAF6EE` background tint.
- **Warning:** Solid `#A86413` (text and icons) with `#FEF6EB` background tint.
- **Error:** Solid `#B42318` (text and icons) with `#FDF2F2` background tint.

## Typography

The typography relies entirely on Inter to ensure clean rhythm and structural authority. Typesetting uses strict semibold (`600`) weights for headers and numerical figures, balanced by clean regular (`400`) and medium (`500`) weights for data cells, form labels, and operational narratives.

Numeric values such as budgets, headcounts, vendor totals, and countdown timers use `font-feature-settings: "tnum" 1` (tabular numerals) to maintain vertical alignment across columns and summary cards.

## Layout & Spacing

The layout utilizes a structured fixed-width grid centered within viewports above 1440px (max-width 1280px), expanding gracefully through a 12-column layout on desktop, an 8-column layout on tablet, and a 4-column layout on mobile.

- **Desktop (1024px+):** 12 columns, 24px (`1.5rem`) gutters, 32px (`2rem`) screen margins. Side-by-side planning panes, split view logistics, and inline detail drawers.
- **Tablet (768px - 1023px):** 8 columns, 20px gutters, 24px screen margins. Stacks complex three-pane layouts into dual-pane views with collapsible navigation.
- **Mobile (< 768px):** 4 columns, 16px (`1rem`) gutters, 16px (`1rem`) screen margins. Single-column stacks with persistent bottom execution bars.

Vertical rhythm adheres strictly to an 8px baseline grid (with 4px increments for compact tags and input heights). All spatial buffers must use the designated spacing tokens: padding between elements within an event card must not fall below `space-md` (16px), and panel separation conforms to `space-lg` (24px).

## Elevation & Depth

Visual hierarchy is communicated through structural layering, border containment, and subtle ambient shadows. 

1. **Base Plane:** The main workspace canvas is `#F7F7F5`.
2. **Surface Plane:** Interactive cards, calendar blocks, and content containers sit on solid `#FFFFFF` with a 1px solid border in `#E7E5E2`.
3. **Elevated Panels (Flyouts, Menus, Modals):** White `#FFFFFF` panels surrounded by `#E7E5E2` borders paired with a subtle, non-intrusive ambient shadow: `0 4px 12px rgba(37, 37, 37, 0.05), 0 1px 2px rgba(37, 37, 37, 0.04)`.
4. **Active/Drag States:** Floating drag items or active agenda reordering states maintain `0 8px 24px rgba(37, 37, 37, 0.08)`.

Gradients, color-tinted shadows, and blurred glass treatments are strictly forbidden. Depth is reinforced through border containment and tone distribution.

## Shapes

The design system enforces a disciplined geometric hierarchy:

- **Cards, Containers, and Modals:** Defined with a radius of `8px` to `12px` (standardizing on `10px` for general cards and `12px` for primary master wrappers).
- **Controls & Form Elements:** Buttons, text input boxes, dropdown selectors, and segmented toggles use `6px` to `8px` corner radii.
- **Badges & Tags:** Styled with a tight `6px` radius to prevent visual ambiguity with circular or pill-shaped buttons.
- **Prohibited:** Full pill radiuses (`rounded-full` or 9999px) are strictly omitted.

## Components

### Buttons
- **Primary:** Background `#E87524`, text `#FFFFFF`, border none, radius `8px`, vertical padding 10px, horizontal padding 16px. Font weight `500`. Hover state `#C95D16`. Active state `#A94F13`.
- **Secondary:** Background `#FFFFFF`, text `#252525`, border 1px solid `#E7E5E2`, radius `8px`. Hover background `#F7F7F5` with border `#D5D3CF`.
- **Tertiary / Ghost:** Background transparent, text `#747474`, radius `8px`. Hover text `#252525`, hover background `#F7F7F5`.
- **Focus State:** 2px outline of solid `#A94F13` with 2px offset.

### Input Fields & Selects
- Height 40px standard (36px for dense tables). Background `#FFFFFF`. Border 1px solid `#E7E5E2`. Radius `6px` to `8px`. Text `#252525`, placeholder `#747474`.
- **Active Focus:** Border color switches directly to `#E87524` with a 1px solid ring of `#A94F13`.
- **Error State:** Border color `#B42318`. Accompanying helper text in `#B42318` with 14px error icon.

### Cards & Modules
- Solid `#FFFFFF` surface, 1px solid `#E7E5E2` border, radius `10px`. Internal padding `20px` (or `24px` for high-level summaries).
- Card headers feature section title (`section-title`) in `#252525` separated from body content by an optional 1px horizontal `#E7E5E2` divider.

### Chips & Badges
- Non-pill, structured form factor with `6px` radius. Padding 4px 8px. Font size 12px, weight `500`.
- **Neutral:** Background `#F7F7F5`, text `#747474`, border 1px solid `#E7E5E2`.
- **Active / Accent:** Background `#FFF1E5`, text `#C95D16`, border 1px solid `#FBD9BE`.
- **Success:** Background `#EAF6EE`, text `#287A4B`.
- **Warning:** Background `#FEF6EB`, text `#A86413`.
- **Error:** Background `#FDF2F2`, text `#B42318`.

### Checkboxes & Radio Buttons
- 18px square (checkbox) or circle (radio), border 1.5px solid `#747474`, radius `4px` (checkbox).
- Checked state: Fill `#E87524`, border `#E87524`, interior check mark or dot in solid white `#FFFFFF`.

### Lists & Data Tables
- Header row: Solid `#F7F7F5` background, text `#747474` in `12px` semibold, 1px bottom border `#E7E5E2`.
- Data rows: `#FFFFFF` background, height 48px, horizontal borders `#E7E5E2`. Hover state turns row background `#F7F7F5`. Numeric cells strictly right-aligned with tabular figures enabled.

### Event-Specific Components
- **Timeline & Itinerary Node:** 1px vertical spine in `#E7E5E2`. Milestone indicators use an 8px solid square or circle in `#E87524` with a 2px solid `#FFFFFF` outer ring.
- **AI Recommendation Banner:** Background `#FFF1E5`, border 1px solid `#E87524`, radius `8px`. Body copy in `#252525` with action links in `#C95D16` semibold.
- **Budget Metric Tile:** Single metric number rendered in `numeric-stat` (`32px` semibold) with an upper label in `#747474` (`12px` uppercase tracking).