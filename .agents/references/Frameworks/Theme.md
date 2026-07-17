# Theme Framework

## Purpose

The `Theme` framework is a set of utilities and types that receive UIKit's design system tokens (color, background, border, shadow, blur, etc.) as React props and convert them into corresponding CSS classes. It plays a central role in maintaining global theme-based consistency.

## Usage Logic

- **Radius**: `Radius.types.ts` returns strings like "R8", "Circle" as pixels or CSS variables.
- **Color/Background**: The `resolveThemeClasses` function combines the given preset (`themePreset`), background (`background`), and text color (`color`) to infer class names and returns them as an array.
- **Border / Shadow / Blur**: Each mapping function converts into utility classes like `ThemeBorder-`, `ThemeShadow-`, `BackgroundBlur-`.

## Type Signatures

```typescript
// Theme.types.ts
export type ThemePreset =
  "UIPrimary" | "UISecondary" | "BaseFull" | "BaseSoft"; /* ... */
export type ThemePaint =
  | `${ThemeColorName}${ThemeLevel}`
  | `${ThemeColorName}${ThemeLevel}TP${ThemeTPScale}`;

export interface ThemeSystemProps {
  themePreset?: ThemePreset;
  background?: ThemeBackgroundPaint;
  color?: ThemePaint;
  border?: ThemeBorderPaint;
  shadow?: ThemeShadow;
  themeInteractive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  backgroundBlur?: BackgroundBlurValue;

}

export function resolveThemeClasses(
  props: ThemeSystemProps & {/* ... */},
): string[];
export function Border(
  border?: ThemeBorderPaint,
  basePaint?: ThemePaint,
): string | undefined;
export function Shadow(shadow?: ThemeShadow): string | undefined;
```

## Example Code

```tsx
import {
  resolveThemeClasses,
  Border,
  Shadow,
} from "@musecat/uikit";
import clsx from "clsx";

function CustomBox(props: ThemeSystemProps) {
  const themeClasses = resolveThemeClasses(props);
  const borderClass = Border(props.border);
  const shadowClass = Shadow(props.shadow);

  return (
    <div className={clsx(themeClasses, borderClass, shadowClass)}>
      Box with theme applied
    </div>
  );
}
```
