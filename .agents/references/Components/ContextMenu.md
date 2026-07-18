# ContextMenu

**Source:** [`packages/Components/ContextMenu`](../../../packages/Components/ContextMenu)

## Purpose

A context menu that displays a list of menu items as a popover or bottom sheet (on mobile) and lets the user select an item.

## Usage Logic

- Built on the `Dialog` framework, it renders responsively as a popover or sheet depending on screen size (`isMobile`) and `mobileMode`.
- Fully supports keyboard navigation (ArrowUp/Down, Home, End, Enter, Space), including a visual focus auto-scroll (Ensure Visible) logic.
- Manages option items via the `contents` array, with individual items rendered by the submodule `ContextMenu.options.tsx`.

## Type Signatures

```typescript
interface ContentItem {
  type: "option";
  value: string | number;
  label: ReactNode;
  icon?: string;
  description?: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

interface ContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  popoverOwnerId: string;
  listId: string;
  isInteractionDisabled: boolean;
  contents: ContentItem[];
  mobileMode?: DialogMobileMode;
  showCheck?: boolean;
}
```

## Example Code

```tsx
import { ContextMenu } from "@musecat/uikit";
import { useRef, useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const options = [
    {
      type: "option" as const,
      value: "1",
      label: "Edit",
      onClick: () => console.log("Edit"),
    },
    {
      type: "option" as const,
      value: "2",
      label: "Delete",
      onClick: () => console.log("Delete"),
    },
  ];

  return (
    <>
      <button ref={ref} onClick={() => setOpen(true)}>
        Open Menu
      </button>
      <ContextMenu
        open={open}
        onOpenChange={setOpen}
        anchorRef={ref}
        popoverOwnerId="example-menu"
        listId="example-menu-list"
        isInteractionDisabled={false}
        contents={options}
      />
    </>
  );
}
```
