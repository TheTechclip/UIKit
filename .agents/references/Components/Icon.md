# Icon

**Source:** [`packages/Components/Icon`](../../../packages/Components/Icon)

## 1. Purpose

- An integrated rendering view for icons, images, loading spinners, and SVGs.
- Role: Standardizes the output of icon font classes (`i*`), external image renderers, inline vectors (`SVG/data`), and the loading component (`Spinner`) under the same layout API.

## 2. Usage Logic

- 4 main modes:
  - **Icon font**: Injected as `icon="iCheck"`, `iconBrand="iBrandApple"`.
  - **Image**: Injected as `image="/path/to.jpg"` (uses Next.js Image wrapper).
  - **SVG**: References an internal `SVG.data` like `svg="logo"`. The `svgBordered` prop allows custom stroke color.
  - **Spinner**: Activated with `spinner=true` (SpinnerOptions can be passed).
- With `box={true}`, it renders as a card-style icon with a rounded background. `boxOptions` controls details.
- Injecting `pressable={{ onClick: ... }}` makes it immediately act as a button-style (interactive) icon wrapper.
- `title` and `titleType` can attach a label (Text) next to the icon.

## 3. Type Signatures

```typescript
export interface IconProps extends ThemeSystemProps, RadiusProps, BorderProps {
  "data-color-mode"?: string;
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  title?: React.ReactNode;

  // Box wrapper mode
  box?: boolean;
  boxOptions?: { padding?: UIKitSizeValue; background?: ThemePaint /* ... */ };

  // Size constraints
  size?: UIKitSizeValue;
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;

  // Mode triggers
  icon?: string;
  iconBrand?: string;
  iconFill?: boolean;
  image?: string;
  svg?: string;
  svgBordered?:
    boolean | { fill?: string; stroke?: string; strokeWidth?: number | string };
  spinner?: boolean;

  // Functionality
  pressable?: PressableProps;
  opacity?: number;
}
```

## 4. Example Code

```tsx
import { Icon } from "@musecat/uikit";

export default function Example() {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {/* 1. Normal icon font */}
      <Icon icon="iSettings" size={24} color="Blue3" />

      {/* 2. Interactive box-style brand icon */}
      <Icon
        iconBrand="iBrandGithub"
        box
        themePreset="UIPrimary"
        pressable={{ onClick: () => alert("Github") }}
      />

      {/* 3. Loading state */}
      <Icon spinner title="Loading..." titleType="Caption1" />

      {/* 4. Vector graphic and image */}
      <Icon svg="logo" width={64} height={64} />
      <Icon image="https://example.com/avatar.png" box radius="Circle" />
    </div>
  );
}
```
