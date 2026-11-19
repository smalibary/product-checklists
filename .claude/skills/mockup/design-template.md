---
version: alpha
name: Project name
description: One line on what the app is and how it should feel.
colors:
  # Tier 1, primitives: the raw palette, named by what they are. Only tier 2 points at these.
  green-700: "#1f6f5c"
  white: "#ffffff"
  grey-50: "#f7f8f6"
  grey-200: "#dfe4e0"
  grey-600: "#5f6b64"
  grey-900: "#1d2420"
  # Tier 2, roles: named by what they are for. Components use only these.
  primary: "{colors.green-700}"
  on-primary: "{colors.white}"
  background: "{colors.grey-50}"
  surface: "{colors.white}"
  text: "{colors.grey-900}"
  muted: "{colors.grey-600}"
  line: "{colors.grey-200}"
typography:
  headline-md:
    fontFamily: system-ui
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  body-md:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.4
  label-md:
    fontFamily: system-ui
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1
spacing:
  space-8: 8px
  space-16: 16px
  space-24: 24px
  sm: "{spacing.space-8}"
  md: "{spacing.space-16}"
  lg: "{spacing.space-24}"
rounded:
  r-10: 10px
  r-999: 999px
  md: "{rounded.r-10}"
  full: "{rounded.r-999}"
components:
  # Tier 3: component tokens, pointing only at tier 2.
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 16px
---

# Design

Google's DESIGN.md format (github.com/google-labs-code/design.md): tokens in the front matter above, reasons in the
sections below, in this order. Check with `npx @google/design.md lint DESIGN.md`.

**Three tiers of tokens** (Salem's standard): primitives (the raw values) → roles (what each is for, pointing at a
primitive) → component tokens (pointing only at roles). Change a colour once, in its primitive.

How the mockup builder reads it:
- Tokens become CSS variables: `colors.x` is `--color-x`, `typography.x` is `--font-x` (a whole font, used as
  `font: var(--font-x)`), `spacing.x` is `--space-x`, `rounded.x` is `--radius-x`. Never raw colours or primitives in components (the builder warns).
- **Components** is a closed list (the component inventory, R-35): one job, one component. One `###` per component:
  a one-line description, one ```html block whose outer element has `data-component="Name"`, and a ```css block.
- A Google Fonts address written anywhere in this file is loaded by the mockups.
- Use start and end, never left and right, if the app has a right-to-left language.

## Overview

The feel in two or three sentences, and who uses it.

## Colors

What each colour is for.

## Typography

Which typeface and why.

## Layout

How a screen is arranged and how roomy it is.

## Elevation & Depth

What floats, if anything.

## Shapes

Corners and outlines.

## Components

### Button
The main action on a screen. One per screen.

```html
<button data-component="Button" class="c-button">Continue</button>
```

```css
.c-button { font: var(--font-label-md); background: var(--color-primary); color: var(--color-on-primary);
  border: 0; border-radius: var(--radius-md); padding: var(--space-md); width: 100%; }
```

## Do's and Don'ts

- Do use only the components listed above (R-35).
- Don't put more than one main button on a screen.
