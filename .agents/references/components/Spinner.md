# Spinner

**Source:** [`packages/components/Spinner`](../../../packages/components/Spinner)

## Purpose

The `Spinner` component is a rotating animation icon that visually represents an in-progress process or loading state. It supports three different designs (`apple`, `material`, `wheel`).

## Usage Logic

- **Visual Type**: Choose one of `apple` (segmented), `material` (SVG track), or `wheel` (default rotating) designs via the `type` prop.
- **Customization**: Fine-tune the spinner's appearance and rotation speed via `size`, `color`, `strokeWidth`, `duration`, etc.
- **Accessibility**: Automatically sets `role="progressbar"` or appropriate `aria-label`, `aria-hidden` to indicate progress, ensuring screen reader accessibility.

## Type Signatures

```typescript
import type { AriaRole, CSSProperties, SVGAttributes } from "react";
import type { UIKitSizeValue } from "../../frameworks/shared/sizing";
import type { ThemePaint } from "../../frameworks/Theme/Theme.types";

export interface SpinnerProps {
  "data-color-mode"?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
  role?: AriaRole;
  type?: "apple" | "material" | "wheel";
  className?: string;
  style?: CSSProperties;
  size?: UIKitSizeValue;
  strokeWidth?: number;
  color?: ThemePaint;
  opacity?: number;
  duration?: number;
  linecap?: SVGAttributes<SVGElement>["strokeLinecap"];
}
```

## Example Code

```tsx
import { Spinner } from "@musecat/uikit";

export default function SpinnerExample() {
  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
      {/* Default Wheel spinner */}
      <Spinner size={32} color="Blue3" />

      {/* Material Design style spinner */}
      <Spinner
        type="material"
        size={32}
        color="Red3"
        strokeWidth={3}
        duration={1.5}
      />

      {/* Apple style spinner */}
      <Spinner type="apple" size={32} color="Base3" />
    </div>
  );
}
```
