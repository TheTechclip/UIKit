# Pill

**Source:** [`packages/Components/Pill`](../../../packages/Components/Pill)

## Purpose

A UI element (capsule/pill shape) used as a keyword, tag, status badge, or small rounded capsule button. Flexibly supports combinations of icon and text, loading state display, and text ellipsis handling.

## Usage Logic

- Built on the `Pressable` framework component, so it easily converts from a simple badge form to a touch/clickable interactive button.
- `text`, `icon`, `rightIcon` make it easy to arrange a left icon, center text, and right supplementary icon.
- When the `loading` prop is true, a loading spinner icon is automatically shown in the right area.
- The `ellipsis` option truncates text with `...` without wrapping in narrow spaces.

## Type Signatures

```tsx
// Pill.types.ts
import type { IconProps } from "../Icon/Icon.types";
import type { PressableProps } from "../../Frameworks/Pressable/Pressable.types";
import type { TextProps } from "../Text/Text.types";
import type { RadiusProps } from "../../Frameworks/Theme/Radius.types";
import type {
  ThemeSystemProps,
  BorderProps,
} from "../../Frameworks/Theme/Theme.types";

export interface PillProps extends ThemeSystemProps, RadiusProps, BorderProps {
  text?: React.ReactNode;
  icon?: IconProps; // left icon
  rightIcon?: IconProps; // right icon

  pressable?: PressableProps; // Pressable props including click events
  disabled?: boolean;
  loading?: boolean; // enable loading state (show spinner)

  ellipsis?: boolean; // text ellipsis handling
  shouldWrapText?: boolean; // whether to wrap text (default true)

  textType?: TextProps["type"];
  textSize?: TextProps["size"];
  textWeight?: TextProps["weight"];
  iconSize?: UIKitSizeValue;

  checkedThemePreset?: ThemeSystemProps["themePreset"];
  // ... other style and layout related Props
}
```

## Example Code

```tsx
import { Pill } from "@musecat/uikit";

export function TagList() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {/* Basic text pill */}
      <Pill text="Design" themePreset="BaseFull" radius="Circle" />

      {/* Pill with icon, clickable */}
      <Pill
        text="Apply Filter"
        icon={{ icon: "iFilter" }}
        themePreset="BlueSolid"
        pressable={{
          onClick: () => console.log("Filter clicked"),
        }}
      />

      {/* Loading state pill */}
      <Pill text="Saving" loading={true} disabled={true} />
    </div>
  );
}
```
