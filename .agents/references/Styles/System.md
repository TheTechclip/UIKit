# System

This document defines UIKit's global styles and base initialization (CSS Reset) rules.

## Core Rules

1. **Box Sizing & Font**
   - All elements (`*`, `::before`, `::after`) have `box-sizing: border-box`.
   - The default font `var(--font-sans-serif)` is applied.
   - `word-break: keep-all` prevents Korean word breaking.

2. **Root (html, body)**
   - `html`: `font-size: var(--font-size)` is applied so scaling is based on 1rem = 10px.
   - `html`: Default text color (`var(--color-text-base)`) and background color (`var(--color-background-base)`) are set.
   - `body`: Uses a centered flex-col layout by default, with margin/padding reset.

3. **Form Elements & Interactive Elements (a, button, input, etc.)**
   - Background, border, margin, padding, and outline are reset.
   - `a`, `button` have `cursor: pointer`.
   - `input::placeholder` opacity is set to 0.4.

4. **Disabled State**
   - `*:disabled`, `*[disabled]`, `.disabled` elements have `cursor: not-allowed` and `opacity: .4`, and events are blocked (`pointer-events: none`).

## Usage

Loaded at the top of the app without any explicit call to build the global environment. When developing components, be aware of these reset rules (e.g., buttons have no default background/border) and override styles accordingly.
