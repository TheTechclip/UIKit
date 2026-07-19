# Label

**Source:** [`packages/components/Label`](../../../packages/components/Label)

## 1. Purpose

- A form element container and control wrapper.
- Role: Wraps input fields (Input, Select, DatePicker, etc.) and is responsible for the title, required marker (*), bottom hint (error, info, etc.) messages, and common outline styling (theme and padding).

## 2. Usage Logic

- Place the form control component to wrap inside `children`.
- Wrapped by an outer `Pressable` wrapper so that clicking anywhere in the field area transfers focus to the inner form via `htmlFor` control.
- Based on the `hint` object (`type`: "error", "success", "info", "warning", `text`), the bottom icon and text color are automatically mapped and rendered.
- Frequently used internally to keep form interface specs consistent when creating or extending components.

## 3. Type Signatures

```typescript
import type {
  ThemeSystemProps,
  BorderProps,
  RadiusProps,
} from "../../frameworks/Theme/Theme.types";

export interface LabelProps extends ThemeSystemProps, BorderProps, RadiusProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  // HTML form attributes
  htmlFor?: string;
  hintId?: string;

  // Content
  title?: string;
  required?: boolean;
  hint?: {
    type: "info" | "error" | "warning" | "success";
    text: React.ReactNode;
  };

  // State
  readOnly?: boolean;
  disabled?: boolean;
  cursor?: React.CSSProperties["cursor"];
}

// Omit 'children', 'htmlFor', 'hintId' for consumer forwarding
export type LabelSharedProps = Omit<
  LabelProps,
  "children" | "htmlFor" | "hintId"
>;
```

## 4. Example Code

```tsx
import { Label } from "@musecat/uikit";
import { Checkbox } from "@musecat/uikit"; // virtual import

export default function Example() {
  return (
    <Label
      htmlFor="terms-agree"
      title="Agree to Terms"
      required
      hint={{ type: "info", text: "Required to use the service." }}
      themePreset="BaseFull"
      radius="Regular"
    >
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Checkbox id="terms-agree" />
        <span>I agree</span>
      </div>
    </Label>
  );
}
```
