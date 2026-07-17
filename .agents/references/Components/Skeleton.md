# Skeleton

## Purpose

The `Skeleton` component provides a visual placeholder to the user while data is loading, naturally conveying the loading state.

## Usage Logic

- **Sizing**: Specify `width`, `height`, or pass a font typography type (`Title1`, `Body`, etc.) to the `type` prop to automatically adjust the height to match the text size.
- **Multiple Slots**: The `count` prop easily renders multiple lines of skeleton UI at once. Concise code without array mapping.

## Type Signatures

```typescript
import type { UIKitSizeValue } from "../../Frameworks/_shared/sizing";
import type { TextProps } from "../Text/Text.types";

export interface SkeletonProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;
  count?: number;
  type?: TextProps["type"];
}
```

## Example Code

```tsx
import Skeleton from "@/packages/Components/Skeleton/Skeleton";

export default function SkeletonExample() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Single-line skeleton matching 'Headline' text height */}
      <Skeleton type="Headline" width="50%" />

      {/* Three-line skeleton matching 'Body' text height */}
      <Skeleton type="Body" count={3} />

      {/* Arbitrary-size skeleton */}
      <Skeleton width="100px" height="100px" />
    </div>
  );
}
```
