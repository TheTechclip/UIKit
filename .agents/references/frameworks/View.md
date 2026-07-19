# View

**Source:** [`packages/frameworks/View/View.tsx`](../../../packages/frameworks/View/View.tsx) and [`View.types.ts`](../../../packages/frameworks/View/View.types.ts)

`View` is UIKit's structural primitive. It renders a `div`, `motion.div`, or `Squircle` according to its props, and is the default building block for layout instead of raw `div` elements.

## Rendering decision

1. A non-`None` `radius`, no border, and `noSquircle !== true` render through `Squircle`.
2. Otherwise, providing `motion` renders `motion.div`.
3. All other cases render a `div`.

This distinction is intentional. A border disables the Squircle path, and direct Motion width/height animation on a Squircle can reset its generated clip path. Animate a wrapper or use imperative controls for size changes.

## Layout and sizing

`View` is `display: flex` by default, `inline-flex` when `inline` is true, and `grid` if any grid-template prop is supplied. Use `column`, `row`, `gap`, `alignItems`, `justifyContent`, `wrap`, and `alignSelf` for flex layout. `width`, `height`, `margin`, padding props, `top`, and `bottom` resolve with `Size`; numeric values are token-scaled rather than raw pixels.

`sticky` is `true` for `top: 0`, or a size value for a custom sticky offset. `mobileStrict` and `mobileOrder` enable View's responsive SCSS behaviour. `fullWidth` applies the framework full-width class.

## Theme and state

`themePreset`, `background`, `color`, `border`, `shadow`, and `backgroundBlur` resolve through the shared Theme system. `disabled` and `readOnly` are consumed as visual state and are not forwarded as invalid DOM attributes. Supply `data-color-mode` only for a deliberate local palette override.

## Example

```tsx
import { Pressable, Text, View } from "@musecat/uikit";

export function SettingsSection() {
  return (
    <View column gap={16} padding={24} radius="Regular" background="Base1">
      <View row alignItems="center" justifyContent="space-between">
        <Text type="Title3">Settings</Text>
        <Pressable padding={8} radius="Light" themePreset="UISecondary">
          <Text type="Caption1">Edit</Text>
        </Pressable>
      </View>
      <Text type="Body" color="Base3">Choose how this feature behaves.</Text>
    </View>
  );
}
```

For drag-and-drop lists use the attached `View.DND` component; for horizontal carousels use the separately exported `HScrollView`.
