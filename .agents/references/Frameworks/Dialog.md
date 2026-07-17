# Dialog Framework

## Purpose

The `Dialog` framework is a universal framework that centrally manages all overlay UI such as popover, modal, sheet, and funnel. It supports both a global-state-based imperative API (`dialog(...)`) and a declarative component (`<Dialog />`).

## Usage Logic

- **Imperative**: Call `dialog.modal({ ... })` or `dialog.popover(element, { ... })` to render a dialog from anywhere. (Mounting `<DialogBootstrap />` somewhere in the app root is required)
- **Declarative**: Declare inside a component's JSX as `<Dialog open={isOpen} onOpenChange={setIsOpen} mode="modal" ... />`.
- **Per-mode characteristics**:
  - `popover`: Positioned around a specific element (`anchorRef`).
  - `modal`: A traditional modal positioned at the center of the screen.
  - `sheet`: A Bottom Sheet that rises from the bottom on mobile. (Supports gestures, snap points)
  - `mobileMode`: A useful option that is `modal` on desktop but automatically converts to `sheet` on mobile (when `isMobile` condition is met).
- **Common components**: Header, Footer (button arrangement automation), background (Dim), exit animation handling, keyboard Escape handling, etc.

## Type Signatures

```typescript
import type { ReactNode, RefObject } from "react";
import type {
  PopoverConfig,
  ModalConfig,
  SheetConfig,
  FunnelConfig,
  ExitConfig,
} from "./Dialog.types";
import type { ThemeSystemProps, BorderProps } from "../Theme/Theme.types";
import type { RadiusProps } from "../Theme/Radius.types";

export type DialogMode = "popover" | "modal" | "sheet";
export type DialogMobileMode = "modal" | "sheet";

// Shared by all mode configs
type DialogBaseConfig = ThemeSystemProps & BorderProps & RadiusProps;

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  mode: DialogMode;
  mobileMode?: DialogMobileMode;

  // Per-mode config (choose one)
  popover?: PopoverConfig;
  modal?: ModalConfig;
  sheet?: SheetConfig;
  funnel?: FunnelConfig; // multi-step funnel flow control

  content?: ReactNode; // dialog body
  exit?: ExitConfig; // outside click, cancel button behavior
}

// Imperative API
export function dialog(props: DialogProps): DialogInstance;
dialog.modal = (props: Omit<DialogProps, "mode">) => DialogInstance;
dialog.sheet = (props: Omit<DialogProps, "mode">) => DialogInstance;
dialog.popover = (anchor: HTMLElement, props: Omit<DialogProps, "mode">) =>
  DialogInstance;
```

## Example Code

```tsx
import { Dialog, dialog } from "@musecat/uikit";
import { Pressable } from "@musecat/uikit";
import { useState } from "react";

function Example() {
  const [open, setOpen] = useState(false);

  // 1. Imperative modal call
  const showModal = () => {
    dialog.modal({
      modal: {
        header: { title: "Imperative Modal" },
        footer: {
          buttons: [{ text: "Confirm", onClick: (e, close) => close() }],
        },
      },
      content: <div>This modal can be called from anywhere.</div>,
    });
  };

  return (
    <div>
      <button onClick={showModal}>Open Imperative Modal</button>
      <button onClick={() => setOpen(true)}>Open Declarative Sheet</button>

      {/* 2. Declarative sheet rendering */}
      <Dialog
        mode="sheet"
        open={open}
        onOpenChange={setOpen}
        sheet={{
          header: { title: "Select Option" },
          snapPoints: [300, 600],
        }}
      >
        <div style={{ padding: 20 }}>
          <Pressable>Menu 1</Pressable>
          <Pressable>Menu 2</Pressable>
        </div>
      </Dialog>
    </div>
  );
}
```
