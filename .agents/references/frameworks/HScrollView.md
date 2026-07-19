# HScrollView

**Source:** [`packages/frameworks/View/HScrollView/HScrollView.tsx`](../../../packages/frameworks/View/HScrollView/HScrollView.tsx) and [`HScrollView.types.ts`](../../../packages/frameworks/View/HScrollView/HScrollView.types.ts)

## Purpose

`HScrollView` is a horizontal scroll container supporting both mobile and desktop environments. Internally uses `embla-carousel-react` to provide a smooth horizontal scroll experience based on touch swipe and mouse wheel, and can automatically apply EdgeEffect at both ends.

## Usage Logic

- The `active` prop specifies whether scrolling is enabled. Passing a string-based viewport breakpoint ("w1", "w2", "w3", "w4") allows responsive activation of the swiper only below a specific breakpoint.
- The carousel engine (Embla) is activated only when there are multiple child elements; with one or fewer, or when inactive, it falls back to a normal Flexbox structure.
- The `renderControls` render prop can freely inject left/right scroll control buttons outside or inside the swiper.
- `renderControls` receives current capability flags; controls must honour `canScrollPrev`, `canScrollNext`, and `isScrollActive` rather than infer state from child count.

## Type Signatures

```typescript
import type { CSSProperties, ReactNode } from "react";
import type { ViewProps } from "../View.types";

export type HScrollViewViewport = "w1" | "w2" | "w3" | "w4";
export type HScrollViewActive = boolean | HScrollViewViewport;

export interface HScrollViewControls {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  isScrollActive: boolean;
}

export interface HScrollViewProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "color"
> {
  active?: HScrollViewActive;
  rootStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  activeContainerStyle?: CSSProperties;
  inactiveContainerStyle?: CSSProperties;
  itemWidth?: number | string;
  itemHeight?: number | string;
  renderControls?: (controls: HScrollViewControls) => ReactNode;
  showEdgeEffect?: boolean;
  // ... ViewProps (gap, padding, margin, width, theme, etc.)
}
```

## Example Code

```tsx
import { HScrollView } from "@musecat/uikit";
import { View } from "@musecat/uikit";

function HorizontalList() {
  return (
    <HScrollView
      active="w3" // enable horizontal scroll only below 768px
      gap={16}
      showEdgeEffect={true}
      itemWidth="20rem"
    >
      <View background="Base3" padding={24}>
        Item 1
      </View>
      <View background="Base3" padding={24}>
        Item 2
      </View>
      <View background="Base3" padding={24}>
        Item 3
      </View>
      <View background="Base3" padding={24}>
        Item 4
      </View>
    </HScrollView>
  );
}
```
