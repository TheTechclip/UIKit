# Animation

This document defines UIKit's animation tokens and related style rules.

## Tokens (CSS Variables)

Animation effects are defined using the `--transition-*` prefix.

- `--transition-surface-duration`: Default surface transition duration (420ms)
- `--transition-surface-ease`: Default surface transition timing function (cubic-bezier)
- `--transition-background`: Background color transition
- `--transition-color`: Text color transition
- `--transition-font-size`: Font size transition
- `--transition-outline`: Outline transition
- `--transition-opacity`: Opacity transition
- `--transition-border`: Border transition
- `--transition-transform`: Transform transition
- `--transition-shadow`: Shadow transition
- `--transition-radius`: Border-radius transition
- `--transition-filter`: Filter (blur, etc.) transition
- `--transition-icon`: Combined icon transition (fill, stroke, color)
- `--transition-surface`: Combined surface transition (border, background, outline)
- `--transition-default`: General shape/transform combined transition
- `--transition-fade`: Simple opacity fade
- `--transition-pressable`: Click effect transition for pressable components such as buttons

## Scaling

- `--s-shallow`: Slight shrink effect `scaleX(.99) scaleY(.99)`
- `--s`: Default click shrink effect `scaleX(.96) scaleY(.96)`

## Usage

AI/human developers inject the CSS variables directly into components that require animation effects.

```css
.button {
  transition: var(--transition-pressable);
}
.button:active {
  transform: var(--s);
}
```
