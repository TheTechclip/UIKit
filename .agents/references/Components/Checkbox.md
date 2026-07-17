# Checkbox

## Purpose

A checkbox element for receiving a boolean value from the user, with custom design and animation applied.

## Usage Logic

- Visually hides the native `<input type="checkbox">` and renders a designed checkbox using `Icon` and `View`.
- Supports both controlled/uncontrolled components (`checked`, `defaultChecked`).
- A label text can be composed via the `title` prop, and `reversed` swaps the order of the checkbox and text.

## Type Signatures

```typescript
interface CheckboxProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "title" | "color"
    >,
    BorderProps,
    RadiusProps,
    ThemeSystemProps {
  title?: React.ReactNode;
  titleType?: TextProps["type"];
  titleSpaceBetween?: boolean;
  reversed?: boolean;
  size?: UIKitSizeValue;
}
```

## Example Code

```tsx
import Checkbox from "@/packages/Components/Checkbox/Checkbox";

export default function Example() {
  return (
    <Checkbox
      title="Accept terms and conditions"
      size={24}
      onChange={(e) => console.log(e.target.checked)}
      radius="ExtraLight"
    />
  );
}
```
