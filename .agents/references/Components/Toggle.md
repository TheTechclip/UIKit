# Toggle

## 1. Purpose

A toggle (switch) component that lets the user switch between two states (on/off). Smoothly supports drag gestures and click animations.

## 2. Usage Logic

- Maintains accessibility by linking with the native HTML `input[type="checkbox"]`.
- Supports both controlled and uncontrolled rendering via the `checked`, `defaultChecked` props.
- Uses Framer Motion to naturally control the toggle button's drag (`drag="x"`) and spring animation.
- Supports `loading`, `disabled`, `readOnly` states, displaying an internal spinner while loading.
- Rendered together with a `title`, and the `titleSpaceBetween` prop easily sets the spacing layout between the toggle and title.

## 3. Type Signatures

```tsx
export interface ToggleProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color">,
    ThemeSystemProps {
  title?: string;
  titleType?: TextProps["type"];
  titleSpaceBetween?: boolean;
  reversed?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  size?: UIKitSizeValue;
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;
}
```

## 4. Example Code

```tsx
import { useState } from "react";
import Toggle from "./Toggle";

function Example() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Toggle
      checked={isEnabled}
      onChange={(e) => setIsEnabled(e.target.checked)}
      title="Enable Feature"
      titleSpaceBetween
      size={24}
    />
  );
}
```
