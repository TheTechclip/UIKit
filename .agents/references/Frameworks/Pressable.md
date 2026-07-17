# Pressable Framework

## Purpose

The `Pressable` framework is a versatile multipurpose wrapper component that handles user interactions such as click, touch, and hover. It dynamically identifies its role—link (`<a>`, `Link`), button (`<button>`), form control (`checkbox`, `radio`), or custom popover trigger—and renders the appropriate DOM element and accessibility attributes. It also uniformly applies Squircle shapes, motion wrapping, and theme-based styling.

## Usage Logic

- When an `href` prop is given, it internally renders as Next.js's `Link` component or a plain `<a>` tag.
- With `type="checkbox"` or `type="radio"`, it renders as a custom label (`<label>`) together with a visually hidden `<input>` element.
- With a button action or `onClick`, it renders as a `<button>`. The `popover` prop lets you declaratively write a popover trigger and inner content together.
- Use `themePreset` etc. to automate styling for press/hover interactions.

## Type Signatures

```typescript
import type { CSSProperties } from "react";
import type { LinkProps } from "next/link";
import type { MotionProps } from "motion/react";
import type { PopoverConfig } from "../Dialog/Dialog.types";
import type { WindProps } from "../_shared/Wind.types";
import type { ThemeSystemProps, BorderProps } from "../Theme/Theme.types";
import type { RadiusProps } from "../Theme/Radius.types";

export interface PressableProps
  extends WindProps, ThemeSystemProps, BorderProps, RadiusProps /* ...others omitted */ {
  href?: LinkProps["href"];
  onClick?: (e: React.MouseEvent) => void;
  type?: HTMLButtonElement["type"] | "checkbox" | "radio";
  disabled?: boolean;
  checked?: HTMLInputElement["checked"];
  popover?: Omit<PopoverConfig, "anchorRef"> & {
    content: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
  motion?: MotionProps;
  noSquircle?: boolean; // whether to prevent Squircle corner application
  // other various event handlers and layout properties
}
```

## Example Code

```tsx
import { Pressable } from "@musecat/uikit";

function Example() {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {/* 1. Normal button */}
      <Pressable themePreset="UIPrimary" onClick={() => alert("Clicked")}>
        Primary Button
      </Pressable>

      {/* 2. Link button */}
      <Pressable href="/about" themePreset="BaseFull" radius="R16">
        Go to About
      </Pressable>

      {/* 3. Checkbox control */}
      <Pressable type="checkbox" checked={true} onChange={() => {}}>
        Toggle Checked
      </Pressable>

      {/* 4. Popover trigger combined */}
      <Pressable
        themePreset="UISecondary"
        popover={{
          content: <div style={{ padding: 16 }}>This is popover content.</div>,
        }}
      >
        Open Popover
      </Pressable>
    </div>
  );
}
```
