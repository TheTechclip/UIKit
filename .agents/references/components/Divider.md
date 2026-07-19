# Divider

**Source:** [`packages/components/Divider`](../../../packages/components/Divider)

## 1. Purpose

- A visual separator component within a layout.
- Role: Renders a horizontal or vertical line to clearly mark structural separation between contents.

## 2. Usage Logic

- Default is a horizontal line (`width: 100%`, `height: 1px`). With `vertical=true`, it renders as a vertical line (`width: 1.5px`, `height: stretch`).
- Controls surrounding margin size via `margin`, `marginVertical`, `marginHorizontal` props (mapped to `Size` token).
- With `gradient=true`, renders a linear gradient that fades out at both ends (fade effect).
- The default color is a semi-transparent version of `--color-base-reversed-6`, and `data-color-mode` can be injected.

## 3. Type Signatures

```typescript
import type { UIKitSizeValue } from "../../frameworks/shared/sizing";

export interface DividerProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  vertical?: boolean;
  margin?: UIKitSizeValue;
  marginHorizontal?: UIKitSizeValue;
  marginVertical?: UIKitSizeValue;
  gradient?: boolean;
}
```

## 4. Example Code

```tsx
import { Divider } from "@musecat/uikit";

export default function Example() {
  return (
    <div>
      <span>Top content</span>

      {/* Default horizontal divider */}
      <Divider margin={16} />

      <span>Bottom content</span>

      {/* Gradient vertical divider */}
      <div style={{ display: "flex", height: "50px" }}>
        <span>Left</span>
        <Divider vertical gradient marginHorizontal={8} />
        <span>Right</span>
      </div>
    </div>
  );
}
```
