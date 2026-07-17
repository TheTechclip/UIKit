# EdgeEffect Framework

## Purpose

The `EdgeEffect` framework adds a blurry gradient overlay to a specific directional edge (top, bottom, left, right) of a container, providing a visual effect where the inner content fades out smoothly at both ends of the screen.

## Usage Logic

- Rendered on top of the `View` component and mainly used to apply a gradient to the edge of a scrollable element.
- Specifying one of `"left"`, `"right"`, `"top"`, `"bottom"` for the `side` prop spreads the gradient toward the opposite direction of that side.
- `pointerEvents: "none"` is applied by default so it does not interfere with click/touch events.

## Type Signatures

```typescript
import type { ViewProps } from "../View/View.types";

export interface EdgeEffectProps extends Omit<ViewProps, "children"> {
  side?: "left" | "right" | "top" | "bottom";
}
```

## Example Code

```tsx
import EdgeEffect from "@/packages/Frameworks/EdgeEffect";
import View from "@/packages/Frameworks/View";

function ScrollContainer() {
  return (
    <View style={{ position: "relative", height: 300, overflow: "hidden" }}>
      {/* Top edge fade effect */}
      <EdgeEffect
        side="top"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          zIndex: 10,
        }}
      />

      <View style={{ overflowY: "auto", height: "100%" }}>
        {/* contents... */}
      </View>

      {/* Bottom edge fade effect */}
      <EdgeEffect
        side="bottom"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
          zIndex: 10,
        }}
      />
    </View>
  );
}
```
