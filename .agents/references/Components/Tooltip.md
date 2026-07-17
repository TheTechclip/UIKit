# Tooltip

## 1. Purpose

A component that displays a popup bubble (`content`) with additional explanation or information when hovering over or focusing a specific UI element (`trigger`).

## 2. Usage Logic

- Positions the `content` popup above the React element passed as `trigger`.
- Built-in position auto-adjustment (clamp and flip) logic calculates and adjusts (ClampShift) the position so it is not clipped at screen edges.
- The `placement` prop specifies the bubble's default position and alignment direction (default: `"top"`).
- The `delay` prop adjusts the delay before the tooltip appears on hover.
- Flexible controlled and uncontrolled usage via `open`, `defaultOpen`, `onOpenChange`.
- Setting `interactive` to `true` keeps the bubble from disappearing immediately when the mouse moves over it, enabling interaction.

## 3. Type Signatures

```tsx
export type TooltipPlacement =
  "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end";

export interface TooltipProps extends BorderProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
  disabled?: boolean;
  interactive?: boolean;
  flip?: boolean;
  className?: string;
  contentClassName?: string;
  maxWidth?: number | string;

  themePreset?: ThemePreset;
  background?: ThemeBackgroundPaint;
  color?: ThemePaint;
  radius?: RadiusValue;

  "data-color-mode"?: string;
}
```

## 4. Example Code

```tsx
import Tooltip from "./Tooltip";
import Pressable from "../../Frameworks/Pressable/Pressable";

function Example() {
  return (
    <Tooltip
      placement="top"
      content="This is some additional information."
      delay={300}
      trigger={<Pressable>Hover me</Pressable>}
    />
  );
}
```
