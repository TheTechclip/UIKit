# Nav Component Documentation

## Purpose

Provides a UI for choosing one (or several) option among multiple choices such as tabs, radio button groups, and navigation menus. Supports a visual selection effect (sliding indicator) along with a smooth item selection method via drag-and-drop gestures.

## Usage Logic

- **`Nav` component**: Passes options (icon, text, value, etc.) via the `items` array to render the UI. Supports both Controlled (`value`, `onChange`) and Uncontrolled (`defaultValue`) modes.
- **`useNavIndicator` (internal hook)**: Tracks the currently selected item's position and calculates `transform` and `width` so the highlight background (Indicator) moves smoothly.
- **`useNavDrag` (internal hook)**: Manages the logic that, while dragging across buttons with mouse or touch (Drag Selection), dynamically changes the indicator to match the hovered value and commits the final selection at drop time.

## Type Signatures

```tsx
// Nav.types.ts
import type { ReactNode } from "react";
import type { PressableProps } from "../../Frameworks/Pressable/Pressable.types";
import type { IconProps } from "../Icon/Icon.types";

export interface NavOption extends Omit<PressableProps, "title"> {
  checked?: boolean;
  icon?: IconProps;
  title?: ReactNode;
  value?: string | number; // value returned/compared on selection
}

export interface NavProps extends RadiusProps {
  className?: string;
  name?: string; // radio group name
  radio?: boolean; // enable radio mode (exclusive single selection when true)
  dragSelection?: boolean; // allow selection change via drag
  dragSelectionCommit?: "change" | "end";
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  items: NavOption[];
  // ...sizing and theme props
}
```

## Example Code

```tsx
import Nav from "@/packages/Components/Nav/Nav";
import { useState } from "react";

export function TabNavigation() {
  const [activeTab, setActiveTab] = useState<string>("home");

  const items = [
    { title: "Home", value: "home", icon: { icon: "iHome" } },
    { title: "Explore", value: "explore", icon: { icon: "iSearch" } },
    { title: "Profile", value: "profile", icon: { icon: "iPerson" } },
  ];

  return (
    <Nav
      radio={true}
      dragSelection={true}
      value={activeTab}
      onChange={(val) => setActiveTab(val as string)}
      items={items}
      radius="Round"
    />
  );
}
```
