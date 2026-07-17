# Theme

This document defines the theme utility used throughout the app. It includes comprehensive tokens and mixins for background colors, borders, shadows, rounding (Radius), and blur effects.

## Tokens (CSS Variables)

- `--radius-*`: Corner rounding (circle, system-extra-light, system-light, system, system-bold, system-extra-bold, system-heavy)
- `--shadow-base-*`: Shadow tokens (levels 1~3). In dark mode, the shadow tone changes to a brighter variant.

## Utility Classes

### 1. ThemeBg (Background & Interactive)

Specifies the color system's level 1~6 colors as background. Classes with the TP (transparency) suffix apply a transparent background.

- `.ThemeBg-{Color}{Level}` (e.g., `.ThemeBg-Blue4`)
- `.ThemeBg-{Color}{Level}TP{Alpha}` (e.g., `.ThemeBg-BaseDark1TP3`)

> Interactive state (when combined with the `ThemeInteractive` class): Bright colors with `Level` 4 or below dynamically level-up on hover/active to provide click feedback.

### 2. ThemeColor (Foreground)

- `.ThemeColor-{Color}{Level}`: Overrides the element's `color` and `stroke` with the specified color. (e.g., `.ThemeColor-Red5`)

### 3. ThemeBorder (Border)

Supports thickness (Light, Regular, Bold) and direction (1: all, 2: left-right, 3: bottom, 4: left).

- `.ThemeBorder-{Color}{Level}-{Width}`
- `.ThemeBorder{Direction}-{Color}{Level}-{Width}` (e.g., `.ThemeBorder3-Base4-Regular`)
- Passing `None` makes it transparent.

### 4. Interactive & Shadow & Blur

- `.ThemeInteractive`: When used alone (without a background color), a semi-transparent black/white mask is applied on hover/active to give click feedback.
- `.ThemeShadow-{1~3}`: Applies shadow by level. `.ThemeShadow-None` is supported.
- `.BackgroundBlur-{Level}`: `backdrop-filter: blur` effect.


## Usage

Mix tokens and classes to compose the base form of UI components such as buttons, cards, and modals.

```html
<div
  class="ThemeBg-Base1 ThemeShadow-2 ThemeBorder-Base3-Light"
  style="border-radius: var(--radius-system);"
>
  <span class="ThemeColor-Blue4">Text</span>
</div>
```
