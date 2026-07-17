# Timeline

## Purpose

The `Timeline` component is a layout component that visualizes a series of events, states, or records as a time-ordered or sequential list.

## Usage Logic

- **Items structure**: Receives an array of `TimelineItemProps` structure via `items`. Each item includes text content (`children`), an icon (`icon`), or a custom node (`node`).
- **Custom Nodes**: The node (dot) color or design can be customized globally (`nodePreset`, `nodeBackground`, `nodeColor`) or per item.
- **Interactivity**: The inside of each item is wrapped with the `Pressable` component, so click/touch events can be easily bound via the `pressable` prop.

## Type Signatures

```typescript
import type { IconProps } from "../Icon/Icon.types";
import type { PressableProps } from "../../Frameworks/Pressable/Pressable.types";
import type { ThemeSystemProps } from "../../Frameworks/Theme/Theme.types";

export interface TimelineItemProps {
  children?: React.ReactNode;
  id?: string | number;
  icon?: IconProps;
  node?: React.ReactNode;
  nodePreset?: ThemeSystemProps["themePreset"];
  nodeBackground?: ThemeSystemProps["background"];
  nodeColor?: ThemeSystemProps["color"];
  pressable?: PressableProps;
}

export interface TimelineProps {
  className?: string;
  style?: React.CSSProperties;
  items: TimelineItemProps[];
  nodePreset?: ThemeSystemProps["themePreset"];
  nodeBackground?: ThemeSystemProps["background"];
  nodeColor?: ThemeSystemProps["color"];
}
```

## Example Code

```tsx
import { Timeline } from "@musecat/uikit";
import { Text } from "@musecat/uikit";

export default function TimelineExample() {
  const events = [
    {
      id: "1",
      icon: { icon: "iCheck", size: 12 },
      nodePreset: "UIPrimary",
      children: (
        <>
          <Text type="Subheadline" weight={600}>
            Order Completed
          </Text>
          <Text type="Caption1" color="Base3">
            10:30 AM
          </Text>
        </>
      ),
    },
    {
      id: "2",
      icon: { icon: "iTruck", size: 12 },
      nodePreset: "UINeutral",
      children: (
        <>
          <Text type="Subheadline" weight={600}>
            In Delivery
          </Text>
          <Text type="Caption1" color="Base3">
            2:15 PM
          </Text>
        </>
      ),
      pressable: {
        onClick: () => alert("Go to delivery tracking page"),
      },
    },
    {
      id: "3",
      nodePreset: "UISecondary", // gray dot indicating waiting state
      children: (
        <>
          <Text type="Subheadline" weight={600} color="Base3">
            Delivery Completed (Scheduled)
          </Text>
        </>
      ),
    },
  ];

  return <Timeline items={events as any} />;
}
```
