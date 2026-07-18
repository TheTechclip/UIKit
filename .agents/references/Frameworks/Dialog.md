# Dialog

**Sources:** [`packages/Frameworks/Dialog/Dialog.tsx`](../../../packages/Frameworks/Dialog/Dialog.tsx), [`Dialog.types.ts`](../../../packages/Frameworks/Dialog/Dialog.types.ts), and [`Dialog.store.ts`](../../../packages/Frameworks/Dialog/Dialog.store.ts)

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

## Lifecycle and ownership

Use one ownership model per dialog. Declarative dialogs are controlled by `open`/`onOpenChange`; imperative dialogs return an instance and require a mounted `DialogBootstrap`. Anchor references must point to a live element before a popover opens. Avoid changing sheet snap-point semantics while diagnosing gesture or transition issues: drag state and renderer transition state are separate concerns.

## Type Signatures

```typescript
import type { ReactNode, RefObject } from "react";
import type {
  PopoverConfig,
  ModalConfig,
  SheetConfig,
  ExitConfig,
} from "./Dialog.types";
import type { DialogFunnelProp } from "./funnel/DialogFunnel.types";
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
  funnel?: DialogFunnelProp; // result returned by useDialogFunnel

  content?: ReactNode; // dialog body
  exit?: ExitConfig; // outside click, cancel button behavior
}

// Imperative API
export function dialog(props: DialogProps): DialogInstance;
dialog.modal = (props: Omit<DialogProps, "mode">) => DialogInstance;
dialog.sheet = (props: Omit<DialogProps, "mode">) => DialogInstance;
dialog.popover = (anchor: HTMLElement, props: Omit<DialogProps, "mode">) => DialogInstance;
```

## Funnel

Create the flow with `useDialogFunnel` and pass its returned value to `Dialog`.
The hook delegates step/history/context state to `@use-funnel/browser`; each step receives its typed context, `history`, and `setContext`. The default Next control follows declared step order, skips `hidden` steps, and explicit branching must use `history.push`. `validate` prevents navigation when it returns `false`, or displays its returned string above the content. Custom navigation controls are renderer functions receiving `{ onClick, disabled }`.

```tsx
import { Dialog, useDialogFunnel } from "@musecat/uikit";
import { Input, Text } from "@musecat/uikit";

const funnel = useDialogFunnel<{
  Account: { email?: string };
  Confirm: { email: string };
}>({
  id: "signup",
  initial: { step: "Account", context: {} },
  steps: {
    Account: {
      title: "계정 정보",
      validate: (context) => (context.email ? true : "이메일을 입력해 주세요."),
      render: ({ context, setContext }) => (
        <Input value={context.email} onChange={(event) => setContext({ email: event.target.value })} />
      ),
    },
    Confirm: { render: ({ context }) => <Text>{context.email}</Text> },
  },
});

<Dialog mode="modal" open={open} onOpenChange={setOpen} funnel={funnel} />;
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
