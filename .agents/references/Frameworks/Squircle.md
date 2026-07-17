# Squircle Framework

## Purpose

The `Squircle` framework is a component for rendering the "Super Ellipse" (squircle) corners mainly used in the Apple ecosystem within React applications. Using the `figma-squircle` library, it dynamically calculates and applies an SVG Path-based `clip-path`, providing smooth and soft rounded-corner design.

## Usage Logic

- Renders as a `<div>` by default, and can be changed to the desired element via the `as` prop.
- The `radius` prop specifies the corner roundness (can be set individually); internally observes the element size (ResizeObserver) to generate the accurate SVG `clip-path`.
- When a `motion` object is passed, it renders as a motion squircle component combined with framer-motion.

## Type Signatures

```typescript
import type { ElementType, HTMLAttributes } from "react";
import type { MotionProps } from "motion/react";
import type { RadiusValue } from "../Theme/Radius.types";

export interface SquircleProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "color"
> {
  as?: ElementType; // element to render (default: "div")
  radius?: RadiusValue; // corner radius (scale or pixel unit)
  cornerRadius?: number; // hardcoded corner radius
  cornerSmoothing?: number; // smoothing degree (default: 0.6)
  preserveSmoothing?: boolean;
  motion?: MotionProps; // animation properties
}
```

## Example Code

```tsx
import Squircle from "@/packages/Frameworks/Squircle";

function Card() {
  return (
    <Squircle
      as="section"
      radius="R24" // UIKit Radius system token
      style={{ background: "white", padding: 20 }}
    >
      <h2>Soft-corner card</h2>
      <p>Super Ellipse curvature applied.</p>
    </Squircle>
  );
}
```
