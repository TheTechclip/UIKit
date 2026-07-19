# Squircle

**Source:** [`packages/frameworks/Squircle/Squircle.tsx`](../../../packages/frameworks/Squircle/Squircle.tsx) and [`Squircle.types.ts`](../../../packages/frameworks/Squircle/Squircle.types.ts)

`Squircle` creates Figma-style continuous corners using `figma-squircle` and a dynamically generated SVG clip path. `View` and `Pressable` select it automatically for radius-enabled, borderless rendering; use `Squircle` directly only when an independent element needs the same clipping contract.

## Props and measurement

- `radius` accepts a standard token, numeric/string size, or one-to-four directional values.
- `cornerRadius` overrides the resolved radius for the clip calculation.
- `cornerSmoothing` controls the Figma-squircle smoothing factor.
- `defaultWidth` and `defaultHeight` provide initial dimensions while the element is not yet measured.
- `preserveSmoothing` keeps smoothing behaviour when dimensions or radius change.
- `as` chooses the rendered element type; `motion` enables Motion integration.

The component measures its rendered bounds to generate the clip path. When diagnosing clipping defects, verify the element's post-layout `getBoundingClientRect()` dimensions before changing squircle math.

## Motion constraint

Do not pass an animation object that changes `width` or `height` directly to a Squircle. That can cause Motion to reset the base `clip-path`. Animate an outer `View`, use animation controls imperatively, or change layout dimensions outside the raw Squircle animation object.
