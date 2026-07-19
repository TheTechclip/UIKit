# Global system styles

**Source:** [`packages/styles/_system.scss`](../../../packages/styles/_system.scss)

This stylesheet is the baseline reset applied by the importer. It is global: importing it changes browser defaults for the host application.

## What it guarantees

- `box-sizing: border-box`, the UIKit sans font, Korean-friendly `word-break: keep-all`, and disabled tap highlighting apply to every element and pseudo-element.
- `html` uses `--font-size`, semantic foreground/background tokens, smooth scrolling, and hides horizontal overflow.
- `body` is a full-width, centered flex column with zero margin and padding.
- `a`, `button`, `input`, `textarea`, `select`, and `label` lose browser background, border, padding, margin, text-decoration, and outline defaults.
- Text inputs and textareas are full width; placeholder opacity is `0.4`; anchors and buttons receive a pointer cursor.

## Implications for component authors

Native browser styles are intentionally unavailable after the importer is loaded. Use UIKit primitives and token-backed component styling to restore the intended visual contract. Do not rely on native button borders, native form spacing, or browser focus rings.

The visible focus rule is currently commented out in the source. Components that introduce keyboard interaction must therefore provide their own tested focus-visible treatment rather than assume the reset supplies one.

## Import order

Load the importer once before application or component styles. Do not import `_system.scss` repeatedly from individual component modules.
