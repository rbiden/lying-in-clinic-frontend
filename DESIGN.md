---
name: Lying In Clinic
description: A calm, light, monochrome workspace for clinic staff, where patient data and status carry the screen.
colors:
  paper-white: "oklch(1 0 0)"
  ink: "oklch(0.145 0 0)"
  graphite: "oklch(0.205 0 0)"
  graphite-foreground: "oklch(0.985 0 0)"
  mist: "oklch(0.97 0 0)"
  slate-text: "oklch(0.556 0 0)"
  hairline: "oklch(0.922 0 0)"
  input-stroke: "oklch(0.872 0 0)"
  focus-grey: "oklch(0.708 0 0)"
  sidebar-paper: "oklch(0.985 0 0)"
  alert-red: "oklch(0.545 0.235 27.3)"
  recovery-green: "oklch(0.527 0.137 150)"
  caution-amber: "oklch(0.555 0.14 62)"
  notice-blue: "oklch(0.52 0.15 255)"
typography:
  headline:
    fontFamily: "Fraunces Variable, ui-serif, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.11
  title:
    fontFamily: "Fraunces Variable, ui-serif, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.33
  body:
    fontFamily: "Nunito Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Nunito Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  card: "24px"
  full: "9999px"
spacing:
  1: "4px"
  1.5: "6px"
  2: "8px"
  2.5: "10px"
  3: "12px"
  4: "16px"
  5: "20px"
components:
  button-primary:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.graphite-foreground}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
    typography: "{typography.body}"
  button-outline:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-outline-hover:
    backgroundColor: "{colors.mist}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.mist}"
  button-destructive:
    textColor: "{colors.alert-red}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-success:
    textColor: "{colors.recovery-green}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-warning:
    textColor: "{colors.caution-amber}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-info:
    textColor: "{colors.notice-blue}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    height: "40px"
  card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  badge:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.graphite-foreground}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
    typography: "{typography.label}"
  badge-secondary:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  badge-success:
    textColor: "{colors.recovery-green}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  badge-warning:
    textColor: "{colors.caution-amber}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  badge-info:
    textColor: "{colors.notice-blue}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  nav-item:
    textColor: "{colors.slate-text}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 8px"
  data-table:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "4px"
---

# Design System: Lying In Clinic

## Overview

**Creative North Star: "The Quiet Ward"**

The interface should feel like a well-kept clinic room: calm, uncluttered, nothing calling for attention it hasn't earned. Colour is held back almost entirely, so patient names, vitals, bed status and the next task carry the screen. Staff use it all day; its job is to stay out of the way and be exact.

It is a light, monochrome system by intent. There is no dark mode. Everything runs from paper white through mist and slate to a near-black graphite. Four status colours (red, green, amber, blue) appear only when they carry meaning. The layout is compact: 14px body text, 32px controls, 4px-step spacing. Precision shows in alignment and consistency, not ornament.

Warmth comes from tone, not tinted surfaces. The neutrals stay pure grey. The reassurance is carried by the rounded, friendly Nunito body face, the soft Fraunces serif on titles, generous corners, unhurried spacing, gentle state changes, and plain clinic wording.

**Key Characteristics:**

- Light theme only; achromatic palette; colour appears only to mean something.
- Compact, data-first density, built for desktop with tablet and mobile support.
- Soft, rounded forms (10px base radius) and hairline separation.
- Flat surfaces; shadows only for things that float.
- Nunito for the working interface, Fraunces for titles and headings.

## Colors

A pure-grey ladder with a single near-black voice, plus four status colours that only appear when they mean something.

Tokens are defined as CSS custom properties on `:root` in `src/index.css` (shadcn naming). The frontmatter slugs map to them as noted below. There is one light theme; `color-scheme: light` is declared, and there is no `.dark` block or `dark:` variant.

### Primary

- **Graphite** (`--primary`): primary buttons, the active navigation item's text and tint, primary badges, sort indicators, links and the text caret. It is the one dark mark that says "act here". Text on graphite uses **Graphite Foreground** (`--primary-foreground`).

### Neutral

- **Paper White** (`--background`, `--card`, `--popover`): the page, cards, tables and menus.
- **Ink** (`--foreground`): body text and headings. Dialog and sheet scrims are Ink at 30% and 10%.
- **Mist** (`--secondary`, `--muted`, `--accent`): hover fills, secondary buttons and badges, skeleton bars and quiet panels.
- **Slate Text** (`--muted-foreground`): descriptions, helper text, inactive navigation, table metadata and decorative background glows.
- **Hairline** (`--border`): borders, dividers and menu separators.
- **Input Stroke** (`--input`): form-field outlines. It is one step firmer than Hairline so fields keep a visible edge.
- **Focus Grey** (`--ring`): focus rings, at 50% opacity on controls.
- **Sidebar Paper** (`--sidebar`): the navigation rail, one step off white so it reads as a separate plane without a shadow.

### Semantic

Each status colour is dark enough to pass contrast as text, both on white and on its own 10% tint. Each has a `-foreground` pair for the rare solid fill.

- **Alert Red** (`--destructive`): errors, invalid fields, destructive actions and the confirm-dialog warning icon.
- **Recovery Green** (`--success`): completed or saved actions and success toasts. It will also mark positive states such as an available bed or a discharged patient.
- **Caution Amber** (`--warning`): unsaved or changed fields (the `showDirty` highlight), warning toasts and actions that need care.
- **Notice Blue** (`--info`): neutral notices and information toasts.

### Named Rules

**The Earned Colour Rule.** Colour means something or it is not used. Graphite marks the primary action; the four status colours mark state. Nothing is coloured for decoration, and status colours are never used as brand accents.

**The Tint, Not Fill Rule.** Status colours appear as coloured text or icons on a 10% tint of the same colour (20% on hover), with a 40%-strength border when a border is needed. Solid status fills are avoided.

**The Never-Colour-Alone Rule.** Status must also be carried by text, an icon or a shape, because colour by itself fails some staff and some screens. A red border on an invalid field always comes with an error message.

**The Token-Only Rule.** Components use the semantic tokens (`border`, `input`, `muted`, `muted-foreground`, `success`…), never raw Tailwind palette classes (`gray-300`, `amber-50`, `bg-white`, `bg-black`). The palette lives in one place.

## Typography

**Heading Font:** Fraunces Variable (with ui-serif, Georgia, serif), self-hosted from `src/assets/fonts/fraunces` (optical-size axis)
**Body Font:** Nunito Variable (with ui-sans-serif, system-ui, sans-serif), self-hosted from `src/assets/fonts/nunito`

**Character:** Nunito's rounded terminals make dense working screens feel friendly rather than clinical. Fraunces is a soft, slightly old-style serif that gives titles a calm, humane voice. It adjusts its letterforms to the size it is set at.

### Hierarchy

- **Headline** (Fraunces 700, 1.5rem rising to 2.25rem from the `sm` breakpoint, 1.11): the page title in the page header, in Graphite. One per screen.
- **Title** (Fraunces 900, 1.5rem, 1.33): card titles, plus the product name in the navigation rail at 1rem bold.
- **Body** (Nunito 400–500, 0.875rem, 1.43): the default for text, table cells, buttons, inputs and navigation. Page descriptions keep a 42rem maximum width.
- **Label** (Nunito 500–600, 0.75rem, 1.33): badges, helper text, captions and compact metadata.

### Named Rules

**The Two Voices Rule.** Fraunces speaks for titles and headings; `h1`–`h4` and `font-heading` use it automatically. Nunito does everything else: controls, data, forms and body copy. Never set data, buttons or form labels in Fraunces, and never add a third family.

**The Small-and-Steady Rule.** Working text is 14px; 12px is the floor, used for labels only. Keep long readings, such as clinical notes, at 14px or larger. Tables use tabular figures so numbers line up.

## Layout

The app is a two-pane shell: a collapsible navigation rail (Sidebar Paper) and a content area. The content area has a 56px sticky header (`bg-background/70` with a medium backdrop blur and a bottom hairline), then the page header, then content stacked with 16px gaps.

- **Spacing rhythm:** Tailwind's 4px scale. In practice: 4–8px inside controls, 8–12px between related items, 16px between blocks, 20px inside cards (16px for small cards).
- **Density:** compact. Controls are 32px by default (28px small, 36px large, 40px for inputs and navigation rows). Table cells use 12px horizontal and 6px vertical padding.
- **Breakpoints:** Tailwind defaults. The app treats anything under 768px as mobile: the rail becomes a sheet, and table pagination drops its text labels.
- **Tables:** scroll horizontally inside their rounded container rather than wrapping cells.

## Elevation & Depth

Flat, lines first. Surfaces sit on the page and are separated by 1px hairlines, a faint ring (`ring-1` at 10% foreground), or a one-step tonal change (Sidebar Paper against Paper White). Shadows are kept for things that genuinely float above the page.

### Shadow Vocabulary

- **Resting card** (`shadow-xs` with a 10% foreground ring): cards. Barely there; the ring does the work.
- **Floating** (`shadow-lg` on a solid Paper White surface with a Hairline border): dropdown menus, popovers, comboboxes and toasts.
- **Overlay** (`shadow-xl` over an Ink scrim): dialogs and sheets.

### Named Rules

**The Float-Only Shadow Rule.** If it does not sit above other content, it gets no shadow beyond the resting card. Panels, tables and sections separate with hairlines.

**The Solid Menu Rule.** Menus and popovers are opaque Paper White. No frosted glass, no translucent popups and no inverted dark menus.

**The Soft Veil Rule.** Busy and error states veil the table with a translucent background and a 1px backdrop blur instead of replacing it, so staff keep their place.

## Shapes

Soft and rounded throughout, from a 10px base (`--radius: 0.625rem`). The radius grows with the size of the container:

- **Navigation rows, small controls:** gently rounded (8px).
- **Buttons:** soft corners (10px).
- **Inputs, dropdown menus:** rounder (14px).
- **Tables:** 18px.
- **Cards:** 24px.
- **Badges, avatars, status dots:** fully round.

Borders are always 1px. Focus is a 2–3px soft ring, never a hard outline.

## Components

### Buttons

Soft and restrained: compact, rounded, and states change by tint rather than loud fills.

- **Shape:** soft corners (10px); 32px tall with 10px horizontal padding (28px small, 36px large; square icon buttons at the same heights).
- **Primary:** a Graphite fill with Graphite Foreground text, medium-weight 14px Nunito. Hover fades the fill to 80%.
- **Outline:** a Paper White fill with a Hairline border; hover fills with Mist.
- **Secondary:** a Mist fill with Graphite text.
- **Ghost:** transparent; hover fills with Mist. Used for table row actions, pagination and toolbars.
- **Status (`destructive`, `success`, `warning`, `info`):** the status colour as text on a 10% tint of the same colour, deepening to 20% on hover. The focus ring and border take the status colour.
- **Focus / Press:** a 3px Focus Grey ring at 50% opacity; pressing nudges the button down 1px. Disabled buttons sit at 50% opacity.

### Badges

- **Style:** fully round, 12px semibold, 2px × 10px padding.
- **Variants:** Graphite (default), Mist (secondary), Hairline outline, and the four status tints (`destructive`, `success`, `warning`, `info`).

### Menus

- **Surface:** solid Paper White, 14px corners, Hairline border and the floating shadow (see Elevation & Depth).
- **Items:** 14px Nunito with 16px Lucide icons. The hover and keyboard highlight is Mist. Items with a status variant (`destructive`, `success`, `warning`, `info`) take that colour for text and icon, with a 10% tint on hover.
- **Used by:** `Dropdown`, DataTable row actions and the `variant` on DataTable actions.

### Feedback

- **Toasts:** a solid Paper White card with a Lucide status icon. The icon is green for success, amber for warning, blue for info and red for error.
- **Confirmation dialog:** a round icon badge above the title. It takes the colour of the confirm action's variant (green, amber or blue), and defaults to the red warning tint.
- **Unsaved changes:** fields with `showDirty` that have been edited get a 5% Caution Amber wash, a 40% amber border and a soft amber ring. Switches and toggle groups get the ring alone.

### Cards / Containers

- **Corner Style:** 24px.
- **Background:** Paper White.
- **Shadow Strategy:** resting card (see Elevation & Depth).
- **Border:** a 10% foreground ring instead of a border.
- **Internal Padding:** 20px (16px for small cards). Titles use the Title style.

### Inputs / Fields

- **Style:** 40px tall, 14px corners, a 1px Input Stroke outline on Paper White. Inputs are built from an input group, so prefix and suffix icons, text and buttons sit inside the same stroke.
- **Focus:** the stroke shifts to Focus Grey, with a 2px ring at 30%.
- **Error:** the stroke turns 70% Alert Red with a 2px red ring at 30%, plus a text message below.
- **Changed:** see "Unsaved changes" under Feedback.
- **Disabled:** reduced opacity.

### Navigation

- **Style:** a collapsible rail on Sidebar Paper. It holds the brand mark and product name at the top, then grouped links, with the account action at the bottom.
- **Brand mark:** the Lucide `Baby` icon in Graphite. The same drawing, white on a Graphite rounded square, is the favicon (`public/favicon.svg`). The loading screen and login page use the same mark.
- **Items:** 40px rows, 8px corners, 14px medium Slate Text with a 16px icon.
- **Hover:** a Mist fill.
- **Active:** a 10% Graphite tint, a 30% Graphite ring and semibold Graphite text, with `aria-current="page"`.
- **Collapsed:** icon-only 32px squares, with each label shown as a tooltip.
- **Mobile:** under 768px the rail becomes a slide-in sheet that closes when a link is chosen.

### Data Table (signature component)

The main surface for working lists such as audit logs and, later, patients, admissions and beds.

- **Container:** Paper White, 18px corners, Hairline border, 4px inner padding, horizontal scroll.
- **Header:** a 14px medium Ink row above a Hairline divider. Only sortable columns show a sort control; the active direction is drawn in Graphite.
- **Rows:** tabular figures, 60% Hairline dividers, a 30% Mist hover and a 5% Graphite tint when selected. Clickable rows get a keyboard focus ring.
- **States:** pulsing skeleton bars on first load. While refetching, a 2px progress bar sweeps across the top over a soft veil. Errors and loading show a centred icon in a ring, a heading and a Retry button. Empty tables show a message with a "Clear Filters" button.
- **Row actions:** a ghost "…" icon button that opens a menu, or inline buttons. Each action can use a status variant.
- **Pagination:** a row count on the left, and Previous/Next ghost buttons around a page selector on the right.

## Do's and Don'ts

### Do:

- **Do** use semantic tokens (`bg-background`, `border-border`, `border-input`, `bg-muted`, `text-muted-foreground`, `text-success`, `bg-warning/10`) for every colour.
- **Do** use status colours as text or icons on a 10% tint of the same colour, and pair them with words or an icon.
- **Do** keep working text at 14px Nunito and controls at 32px. Use 40px rows for navigation and form inputs.
- **Do** set titles and headings in Fraunces through `h1`–`h4` or `font-heading`.
- **Do** separate surfaces with 1px Hairlines or a one-step tonal change before reaching for a shadow.
- **Do** show loading, empty, error and success states on every data surface, matching the Data Table's treatments.
- **Do** keep focus visible: a soft Focus Grey ring on every interactive element.

### Don't:

- **Don't** add a dark theme, `dark:` classes or `prefers-color-scheme` styling. The product is light only.
- **Don't** use raw Tailwind palette colours (`gray-*`, `amber-*`, `emerald-*`, `red-*`, `bg-white`, `bg-black`) in components.
- **Don't** use status colours for decoration or brand accents. Decorative glows use Graphite or Slate Text tints.
- **Don't** fill status actions with solid colour. Use the tinted variants.
- **Don't** introduce another typeface or set controls and data in Fraunces.
- **Don't** mix icon libraries. Use Lucide throughout.
- **Don't** put shadows on panels, tables or page sections, and don't make menus translucent or frosted.
- **Don't** use legacy inventory imagery or wording; the brand mark is the `Baby` icon.
