# Font

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

Use font family variables when specifying the font of a component or element in CSS.

```css
.custom-code-block {
  font-family: var(--font-monospace);
  font-size: 1.4rem;
}
```
