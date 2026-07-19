# Radio

**Source:** [`packages/components/Radio`](../../../packages/components/Radio)

## Purpose

The `Radio` component provides a radio button UI that lets the user select a single option among multiple choices. It supports custom theming, controlled/uncontrolled state management, and labels.

## Usage Logic

- **Controlled/Uncontrolled**: Depending on the presence of the `checked` prop, it acts as a controlled or uncontrolled component.
- **Grouped State**: `Radio` components with the same `name` synchronize their state via the native `change` event.
- **Styling**: Combined with the theme system (`ThemeSystemProps`), allowing various presets, background, color, and size (`UIKitSizeValue`) adjustments. Providing a `title` renders a text label together, and `titleSpaceBetween` or `reversed` adjusts the layout.

## Type Signatures

```typescript
import type { RadiusProps } from "@musecat/uikit";
import type { UIKitSizeValue } from "../../frameworks/shared/sizing";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../frameworks/Theme/Theme.types";
import type { TextProps } from "../Text/Text.types";

export interface RadioProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color">,
    BorderProps,
    RadiusProps,
    ThemeSystemProps {
  title?: string;
  titleType?: TextProps["type"];
  titleSpaceBetween?: boolean;
  reversed?: boolean;
  readOnly?: boolean;
  size?: UIKitSizeValue;
}
```

## Example Code

```tsx
import { Radio } from "@musecat/uikit";
import { useState } from "react";

export default function RadioExample() {
  const [selected, setSelected] = useState("apple");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Radio
        name="fruit"
        value="apple"
        title="Apple"
        checked={selected === "apple"}
        onChange={(e) => setSelected(e.target.value)}
      />
      <Radio
        name="fruit"
        value="banana"
        title="Banana"
        checked={selected === "banana"}
        onChange={(e) => setSelected(e.target.value)}
      />
      <Radio name="fruit" value="cherry" title="Cherry" disabled />
    </div>
  );
}
```
