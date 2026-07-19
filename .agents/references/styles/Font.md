# Font tokens

**Source:** [`packages/styles/_font.scss`](../../../packages/styles/_font.scss)

This document defines UIKit's font configuration and system.

## External Font Imports

- Asta Sans
- Min Icon
- Tossface (Emoji)
- JetBrains Mono
- Source Han Serif KR
- Pretendard

## Tokens (CSS Variables)

- `--font-size`: Base font size (`10px`) => 1rem = 10px baseline
- `--font-emoji`: Emoji font stack
- `--font-monospace`: Monospace font stack
- `--font-icon`: Icon font stack
- `--font-sans-serif`: Default sans-serif font stack (Pretendard, etc.)
- `--font-serif`: Default serif font stack

## Utility Classes

- `.FontSerif`: Force apply serif font
- `.FontCode`, `code`: Force apply monospace (Mono) font

## Usage

`Text` should be the normal application-facing typography API. Use these variables only in SCSS for framework-level behaviour. The root font-size token establishes UIKit sizing; do not override it within a component because numeric UIKit size values resolve against that scale.

```css
.custom-code-block {
  font-family: var(--font-monospace);
  font-size: 1.4rem;
}
```
