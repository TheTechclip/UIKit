# DNDView Framework

## Purpose

`DNDView` is a component that provides list reordering (Reorder) via drag-and-drop (DnD). Internally uses `@dnd-kit/core` and `@dnd-kit/sortable`, fully supporting mouse, touch, and keyboard accessibility.

## Usage Logic

- Provide an `items` array and a `getKey` function to uniquely identify them.
- Define each item's appearance via the `renderItem` function; rendering the `handle` property from the `state` argument passed in makes that area the drag handle.
- When order changes, the `onReorder(newItems)` callback is called, so update state in the parent component.
- The `strategy` prop selects the sorting algorithm (`vertical`, `horizontal`, `rect`), and keyboard navigation is optimized for direction-key movement per this strategy.

## Type Signatures

```typescript
import type { UniqueIdentifier } from "@dnd-kit/core";
import type { ReactNode } from "react";

export type DNDViewItemState<T> = {
  item: T;
  id: UniqueIdentifier;
  index: number;
  dragging: boolean;
  sorting: boolean;
  handle: ReactNode;
};

export type DNDViewStrategy = "vertical" | "horizontal" | "rect";

export interface DNDViewProps<T> extends ViewProps {
  items: T[];
  onReorder: (items: T[]) => void;
  getKey: (item: T) => UniqueIdentifier;
  renderItem: (item: T, state: DNDViewItemState<T>) => ReactNode;
  renderHandle?: (
    props: HTMLAttributes<HTMLElement>,
    state: DNDViewItemState<T>,
  ) => ReactNode;
  dragHandle?: boolean;
  keyboard?: boolean;
  strategy?: DNDViewStrategy;
}
```

## Example Code

```tsx
import View from "@/packages/Frameworks/View";
import { useState } from "react";

function SortableList() {
  const [items, setItems] = useState([
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
  ]);

  return (
    <View.DND
      items={items}
      getKey={(item) => item.id}
      onReorder={setItems}
      strategy="vertical"
      gap={8}
      renderItem={(item, { dragging, handle }) => (
        <View
          row
          alignItems="center"
          padding={16}
          radius="R8"
          background="Base1"
          shadow={dragging ? "Bold" : "None"} // emphasize while dragging
        >
          {handle} {/* Grab and drag this part */}
          <span style={{ marginLeft: 16 }}>{item.name}</span>
        </View>
      )}
    />
  );
}
```
