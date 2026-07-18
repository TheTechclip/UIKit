# Box

**Source:** [`packages/Components/Box`](../../../packages/Components/Box)

## Purpose

The Box component serves as a basic layout container for content. By combining an inner element (`Box.Content`) and a bottom area (`Box.Footer`), it can compose a consistent panel or card-shaped UI.

## Usage Logic

- `Box`: The base wrapper component, built on the View component, applying theme and layout properties.
- `Box.Content`: The body area, which can embed a title, loading state, icon, etc., and notifies child elements via Context that they are inside the box.
- `Box.Footer`: Located at the bottom of the Box, providing buttons (Pressable) or additional text. May include a divider (Divider).

## Type Signatures

```typescript
interface BoxProps extends ThemeSystemProps, RadiusProps, BorderProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface BoxContentProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  titleSize?: TitleProps["titleType"];
  icon?: IconProps;
  loading?: boolean;
  card?: boolean;
  padding?: UIKitSizeValue;
}

interface BoxFooterProps extends ThemeSystemProps, BorderProps, RadiusProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  pressable?: PressableProps;
  divider?: DividerProps;
}
```

## Example Code

```tsx
import { Box } from "@musecat/uikit";

export default function Example() {
  return (
    <Box themePreset="UIPrimary" border="Light" radius="Regular">
      <Box.Content title="Information" loading={false}>
        <p>This is the main content area.</p>
      </Box.Content>
      <Box.Footer
        pressable={{ onClick: () => alert("Clicked!") }}
        title="Action"
      >
        Confirm
      </Box.Footer>
    </Box>
  );
}
```
