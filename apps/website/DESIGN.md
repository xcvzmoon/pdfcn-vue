---
name: pdfcn-vue
description: Vue PDF components and document templates
colors:
  background: '#111113'
  foreground: '#f5f5f5'
  card: '#1b1b1e'
  muted: '#252529'
  muted-foreground: '#a3a3a3'
  border: '#2b2b30'
  accent: '#303035'
  light-background: '#fafafa'
  light-foreground: '#171717'
  light-card: '#ffffff'
  light-muted: '#f5f5f5'
  light-muted-foreground: '#737373'
  light-border: '#e9e9ea'
  light-accent: '#e5e5e5'
  destructive: '#bb382c'
typography:
  display:
    fontFamily: 'Geist Variable, Arial, sans-serif'
    fontSize: 'clamp(3.6rem, 7.5vw, 7.5rem)'
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Geist Variable, Arial, sans-serif'
    fontSize: 'clamp(2.5rem, 5vw, 5rem)'
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: '-0.04em'
  body:
    fontFamily: 'Geist Variable, Arial, sans-serif'
    fontSize: '14px'
    fontWeight: 400
    lineHeight: 1.7
  data:
    fontFamily: 'SFMono-Regular, Consolas, Liberation Mono, monospace'
    fontSize: '11px'
    fontWeight: 400
rounded:
  square: '0'
spacing:
  xs: '8px'
  sm: '12px'
  md: '16px'
  lg: '24px'
  xl: '32px'
  section: '64px'
components:
  button-primary:
    backgroundColor: '{colors.foreground}'
    textColor: '{colors.background}'
    rounded: '{rounded.square}'
    height: '36px'
    padding: '0 14px'
  button-outline:
    backgroundColor: 'transparent'
    textColor: '{colors.foreground}'
    rounded: '{rounded.square}'
    height: '36px'
    padding: '0 14px'
  action-link-primary:
    backgroundColor: '{colors.foreground}'
    textColor: '{colors.background}'
    rounded: '{rounded.square}'
    height: '48px'
    padding: '12px 20px'
  input:
    backgroundColor: 'transparent'
    textColor: '{colors.foreground}'
    rounded: '{rounded.square}'
    height: '32px'
    padding: '4px 10px'
  code-panel:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.square}'
---

# Design System: pdfcn-vue

## Overview

**Creative North Star: "The industrial specimen sheet"**

The site presents Vue source and its rendered PDF as work to inspect. A dark neutral canvas, wide type, fine rules, and a document preview give it the feel of a technical sheet. The light mode keeps the same layout and swaps the surface values. Square shadcn-vue controls sit within the editorial layout.

The pages make room for code, document previews, installation steps, and theme controls. Copy names the action or result in plain developer language. Motion-v reveals are short and tied to entry; reduced motion removes travel.

**Key Characteristics:**

- Neutral dark default with a complete light counterpart.
- Large Geist headings set against compact mono file names and measurements.
- Square controls, quiet dividers, and gridded preview stages.
- Real browser PDF previews and Vue source shown in the same visual frame.

## Colors

The site gets contrast from near-black and near-white. Muted surfaces and borders separate regions without adding a bright brand accent.

### Primary

- **Paper white:** `foreground` colors the main text and filled actions in dark mode. The corresponding `light-foreground` becomes ink in light mode.
- **Neutral selection:** `accent` marks hover and selected regions. The light theme uses `light-accent` for the same role.

### Neutral

- **Night canvas:** `background` covers the dark page. `card` and `muted` distinguish panels and inset stages.
- **Quiet rule:** `border` separates the header, document frames, sidebars, rows, and code headers. `light-border` plays the same part in light mode.
- **Secondary text:** `muted-foreground` carries supporting copy and interface metadata. `light-muted-foreground` preserves that hierarchy in light mode.
- **Light canvas:** `light-background`, `light-card`, and `light-muted` form the alternate theme.
- **Destructive:** `destructive` is reserved for errors and destructive control states.

**The neutral selection rule.** Use the theme's neutral accent for selection and hover; the site does not have a saturated brand highlight.

## Typography

**Display Font:** Geist Variable (Arial fallback).
**Body Font:** Geist Variable (Arial fallback).
**Data Font:** SFMono-Regular (Consolas and Liberation Mono fallbacks).

Geist keeps the large headings direct and compact. Mono type identifies filenames, token values, shortcuts, and document measurements.

### Hierarchy

- **Display:** The landing headline uses the `display` token and a tight three-line composition.
- **Headline:** Section headings use the `headline` token; docs headings use a smaller clamp with the same close tracking.
- **Body:** Supporting paragraphs sit mostly at 13–14px with generous line height. The hero lead is larger (22px).
- **Data:** Small mono text is used where the content is genuinely technical, such as filenames and token values. Keep it readable in dense controls.

**The source-and-output rule.** Give Vue source, template names, and PDF output clear typographic roles so readers can compare them at a glance.

## Layout

The shared container is capped at 1440px with 40px side margins. At 760px and below, margins fall to 16px and major grids become one column. The landing hero uses a two-column copy and document frame; the registry index follows as a full-width row of ruled cells. Sections use 64px vertical padding on desktop and 40px on small screens.

The sticky header is 76px tall on desktop and 64px below 900px, where navigation moves into a menu. Documentation uses a 224px sidebar with 64px gutter, then a 200px sidebar with 32px gutter below 1100px. At 760px it becomes a disclosure above the article. The theme builder pairs a 320px control rail with a flexible preview, then stacks them at 760px. The recurring spacing steps are recorded in frontmatter.

## Elevation & Depth

The interface is flat. Background changes, borders, and the fine grid on PDF stages provide depth. Code panels and builder regions use the same quiet rule rather than ambient shadow. Focus uses a visible foreground outline or shadcn-vue ring. PDF paper remains visually separate from its preview stage; its current hard offset shadow is an isolated implementation detail, not a surface token.

**The ruled-surface rule.** Separate working regions with a one-pixel neutral rule and tonal change before adding depth effects.

## Shapes

The website sets shadcn-vue radius tokens to zero, and its signature actions and working panels have square corners. Borders are thin and orthogonal. The document preview can preserve the geometry of the document being demonstrated; it does not set the shape of site controls.

## Components

### Buttons and action links

shadcn-vue buttons use small, medium-weight type and 36px default height. Filled buttons invert foreground and background; outline buttons use a transparent fill and the neutral border. Ghost actions gain a muted fill on hover. The larger bordered action link is 48px high with wider internal space. Keyboard focus is visible, and disabled buttons reduce opacity.

### Inputs and theme fields

Inputs are square, outlined, and transparent against the current surface. Focus strengthens the border and adds a ring. Theme color rows pair a native swatch with a mono hex field; number fields put units and token controls in a compact ruled row. Invalid hex values show a specific inline error.

### Navigation

The sticky header keeps a wordmark, text links, docs search, theme switch, and source link on one rule. Active and hovered desktop links underline. The mobile menu uses full-width links separated by rules. Docs navigation uses a selected neutral fill; its sidebar collapses to a disclosure on small screens.

### Code panels and previews

Code panels have a muted title bar, border, mono content, horizontal scrolling, and a copy action. Shiki switches between GitHub dark and light themes with the site mode. The landing playground and theme builder offer source and rendered PDF tabs. Browser render status and download actions stay visible with the preview.

### Cards and badges

shadcn-vue cards and badges are used in documentation and PDF preview utilities. Cards take the current card surface with a fine outline; badges identify states such as browser rendering. These library primitives inherit the site's square radius tokens.

## Do's and Don'ts

### Do:

- **Do** use the dark neutral tokens as the default and keep light-mode roles paired.
- **Do** use square controls and restrained one-pixel borders for site chrome.
- **Do** keep PDF examples tied to the source and actual render state they describe.
- **Do** write direct labels and documentation that tell developers what they can install, edit, or render.

### Don't:

- **Don't** introduce a saturated accent into shared navigation or selection.
- **Don't** use decorative motion in place of the short entry reveals and functional state changes already present.
- **Don't** let the sample document's own colors or type become website tokens.
