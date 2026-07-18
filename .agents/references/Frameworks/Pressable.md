# Pressable

**Source:** [`packages/Frameworks/Pressable/Pressable.tsx`](../../../packages/Frameworks/Pressable/Pressable.tsx) and [`Pressable.types.ts`](../../../packages/Frameworks/Pressable/Pressable.types.ts)

`Pressable` is UIKit's interactive primitive. It accepts shared layout, padding, theme, radius, and event props while selecting the appropriate semantic target for a button, link, form control, or popover trigger.

## Semantic modes

- `href` renders a Next.js link/anchor path; use `target`, `rel`, and `download` where appropriate.
- Default interaction renders a button-like target and accepts `onClick`.
- `type="checkbox"` or `type="radio"` provides the labelled native-control path with `checked`, `onChange`, `name`, and `value`.
- `form` creates a form wrapper using the supplied form attributes.
- `popover` owns its open state unless `open` is supplied, anchors the popup to the trigger, and exposes `onOpenChange`.

`disabled` and `readOnly` remove interactive eligibility; do not forward lower-case state props manually. Add an accessible name with children, `title`, `aria-label`, or `aria-labelledby`.

## Visual contract

The layout props follow `View`. Theme state is resolved with `isInteractive: true`, so `themePreset` plus `themeInteractive` produces token-defined hover and active feedback. Radius normally uses `Squircle`; pass `noSquircle` only when a rectangular DOM shape is necessary. As with `View`, do not animate Squircle width/height directly through a Motion `animate` object.

## Example

```tsx
import { Pressable, Text, View } from "@musecat/uikit";

export function AccountActions() {
  return (
    <View row gap={8}>
      <Pressable href="/account" padding={12} radius="Regular" themePreset="UISecondary">
        <Text type="Body">Account</Text>
      </Pressable>
      <Pressable
        onClick={() => {}}
        padding={12}
        radius="Regular"
        themePreset="UIPrimary"
        themeInteractive
      >
        <Text type="Body">Save</Text>
      </Pressable>
    </View>
  );
}
```
