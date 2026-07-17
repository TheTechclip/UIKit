# Input

## 1. Purpose

- A single text input form component.
- Role: Combines the native HTML `input` element with the UIKit design system, theme props, and a Label (title, hint, etc.) wrapper.

## 2. Usage Logic

- Inherits standard input attributes like `type`, `value`, `placeholder`, `disabled`, `readOnly` as-is.
- Passing `title`, `required`, `hint` props automatically wraps it internally with the `Label` component to render the title and validation message.
- Supports the `prefix` prop: displays left-side text inside the input (e.g., `@`, `#`, `₩`, etc.).
- On error, passing `hint={{ type: "error", text: "..." }}` automatically enables the ARIA-based `aria-invalid`.

## 3. Type Signatures

```typescript
import type { LabelSharedProps } from "../Label/Label.types";

export interface InputProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "prefix" | keyof LabelSharedProps
    >,
    LabelSharedProps {
  value?: string | number;
  type?: string;
  placeholder?: string;
  prefix?: React.ReactNode;
}
```

_(LabelSharedProps includes `title`, `required`, `hint`, ThemeSystemProps, etc.)_

## 4. Example Code

```tsx
import Input from "@/packages/Components/Input/Input";

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Input
        title="Email Address"
        type="email"
        placeholder="example@mail.com"
        required
      />

      <Input
        title="Nickname"
        prefix="@"
        placeholder="username"
        hint={{ type: "error", text: "This nickname is already in use." }}
      />
    </div>
  );
}
```
