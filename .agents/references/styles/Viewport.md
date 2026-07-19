# Viewport SCSS helpers

**Source:** [`packages/styles/_viewport.scss`](../../../packages/styles/_viewport.scss)

This document defines viewport mixin functions for easily writing media queries within SCSS.

## Configuration

Manages the breakpoint ranges (min, max, next) of `w1`, `w2`, `w3`, `w4` as a Map object.

## Mixins

- `@mixin viewport-max($max)`: Generates a max-width based media query
- `@mixin viewport-min($min)`: Generates a min-width based media query
- `@mixin viewport-between($min, $max)`: Generates a range-specified media query

### Helper Mixins

- `@mixin down($key)`: Applies at or below the max-width of a specific keyword (e.g., `w3`). Useful when writing mobile-first views.
- `@mixin up($key)`: Applies at or above the min-width of a specific keyword. Useful when writing PC-first views.
- `@mixin only($key)`: Applies exactly within the min ~ max range of a specific keyword.

## Usage

Import `_viewport.scss` as a module when designing custom components to control media queries.

```scss
@use "../../styles/viewport" as vp;

.container {
  padding: 2rem;

  @include vp.down(w3) {
    // Applied on screens 767.98px or below
    padding: 1rem;
    flex-direction: column;
  }

  @include vp.only(w2) {
    // Applied only on screens 320px ~ 409.98px
    // Use a UIKit token-backed property here when styling a component.
  }
}
```
