# View Framework

## Purpose

The `View` framework is UIKit's core layout building block. It replaces React's `div` or `motion.div` to help you declaratively and consistently write Flexbox and Grid layouts, themes, corner rounding (Squircle), padding/margin, blur, and other style properties. It also provides sub-components like `HScroll`, `Image`, and `DND`.

## Usage Logic

- The `alignItems`, `justifyContent`, `column`, `row`, `gap` shorthand props make Flexbox layout easy to compose.
- When `radius` is specified, it is rendered using the `Squircle` framework by default, except when `noSquircle` is `true` or there is a border.
- Passing the `motion` prop internally converts it into `motion/react`'s animation component.
- Sub-components like `View.DND` are provided as a namespace to maintain a consistent mental model.

## Type Signatures

```typescript
import type { CSSProperties, HTMLAttributes } from "react";
import type { MotionProps } from "motion/react";
import type { WindProps } from "../_shared/Wind.types";
import type {
  PaddingProps,
  RadiusProps,
  ThemeSystemProps,
  BorderProps,
} from "../Theme";

export interface ViewProps
  extends
    HTMLAttributes<HTMLDivElement>,
    WindProps,
    ThemeSystemProps,
    BorderProps,
    RadiusProps,
    PaddingProps {
  motion?: MotionProps;
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  wrap?: CSSProperties["flexWrap"];
  column?: boolean;
  row?: boolean;
  inline?: boolean;
  gap?: number | string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridAutoFlow?: CSSProperties["gridAutoFlow"];
  fullWidth?: boolean;
  width?: number | string;
  height?: number | string;
  margin?: number | string;
  sticky?: boolean | number | string;
  top?: number | string;
  bottom?: number | string;
  noSquircle?: boolean; // option to bypass Squircle rendering
}
```

## Example Code

```tsx
import { View } from "@musecat/uikit";

function Card() {
  return (
    <View
      column
      gap={16}
      padding="R24"
      radius="R16"
      themePreset="UIPrimary"
      width="100%"
    >
      <View row alignItems="center" justifyContent="space-between">
        <h3>Title</h3>
        <button>Action</button>
      </View>

      <View opacity={0.8}>Content goes here.</View>
    </View>
  );
}
```
