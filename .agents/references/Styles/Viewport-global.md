# Viewport Global

This document defines global utility classes based on viewport (responsive resolution). Generated based on the mixins in `_viewport.scss`.

## Breakpoints

- `w1`: ~ 319.98px
- `w2`: 320px ~ 409.98px
- `w3`: 410px ~ 767.98px
- `w4`: 768px ~ 1279.98px

## Utility Classes

Prefixed with `wX` to control responsive behavior. (e.g., `.w1-h`, `--w1-h` supported)

### 1. Single Interval Control

- `.{key}-h`: `display: none` at or below the interval
- `.{key}-s`: `display: none` above the interval
- `.{key}-scrollX`: Enables horizontal scroll (`overflow-x: auto`) at or below the interval
- `.{key}-col`: Changes to `flex-direction: column` at or below the interval

### 2. Composite Interval Control (Between)

Combines two breakpoints to create an interval. (e.g., `w2w3`)

- `.{start}{end}-h`: `display: none` between start ~ end
- `.{start}{end}-s`: `display: none` outside the specified interval (i.e., visible only within that interval)

## Usage

When writing responsive layouts, control visibility through HTML classes rather than writing new CSS media queries.

```html
<!-- Enable horizontal scroll at w3 size (767px) or below -->
<div class="w3-scrollX">
  <!-- item list -->
</div>

<!-- Hidden on mobile (w2 or below) -->
<div class="w2-h">Text visible only on PC</div>
```
