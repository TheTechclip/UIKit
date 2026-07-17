# Color

This document defines UIKit's color system and tokens.

## Tokens (CSS Variables)

### 1. Primitive Colors (Level 1 ~ Level 6)

The base color palette is provided from level 1 (bright/light) to level 6 (dark/saturated).

- Pink, Red, Brown, Orange, Yellow, Green, Mint, Cyan, Blue, Indigo, Purple, Magenta
- Base Light (white/gray-tone family)
- Base Dark (black/dark-gray family)
- e.g. `--color-blue-4`, `--color-red-5`

### 2. Semantic/Base Colors (Light/Dark mode support)

- `--color-text-base`: Default text color
- `--color-icon-base`: Default icon color
- `--color-border-base`: Default border color
- `--color-background-base`: Default background color (system/modal background, etc.)

Depending on the mode, the `--color-base-*` family is swapped:

- `light`: `--color-base-1` is the light tone, `--color-base-reversed-1` is the dark tone
- `dark`: `--color-base-1` is the dark tone, `--color-base-reversed-1` is the light tone

## Usage

AI/human developers must avoid hardcoding color values (hex, rgb) and always use color tokens when specifying colors.

```css
/* Good */
.card {
  background-color: var(--color-background-base);
  color: var(--color-text-base);
  border: 1px solid var(--color-blue-4);
}

/* Bad - Do not hardcode colors */
.card {
  background-color: #ffffff;
  color: #333333;
}
```
