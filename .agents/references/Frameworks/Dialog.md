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

## Funnel (Multi-Step) — `useDialogFunnel`

The funnel feature is powered by `@use-funnel/browser` internally, exposed through a `useDialogFunnel` hook. Key concepts:

- **step / context / history**: Each step has a typed context. Step transitions (`history.push`) validate the context type at compile time.
- **accumulate pattern**: Context accumulates as user progresses; `history.push("nextStep", (prev) => prev)` carries all previous fields forward.
- **validation**: Each step can define `validate(context)` returning `boolean | string`. String = error message shown in banner.
- **auto-advance**: DialogFunnelShell's "다음" button calls `funnel.advance()` which runs validate + accumulate push.
- **switch pattern**: Steps with `hidden: true` hide the auto-next button; render function calls `history.push` directly.

### Type signatures

```typescript
// useDialogFunnel returns a DialogFunnelProp — opaque, no generic required by Dialog
interface DialogFunnelProp {
  Content: ComponentType;                          // renders current step via @use-funnel's funnel.Render
  current: {
    name: string;
    index: number;
    total: number;
    isFirst: boolean;
    isLast: boolean;
    meta: { title?: ReactNode; caption?: ReactNode; icon?: IconProps };
  };
  navigation?: FunnelNavigationConfig;
  preset?: "classic" | "oobe";
  footer?: { columnLayout?: boolean; buttonCondensed?: boolean | "pc" };
  error: string | null;                           // validation error message
  goBack: () => void;
  advance: () => Promise<void>;                   // validate → accumulate → next
  onFinish?: () => void;
}
```

### Usage

```tsx
import { useDialogFunnel } from "@musecat/uikit";

const funnel = useDialogFunnel<{
  email: { addr?: string };
  verify: { addr: string; code?: string };
  done: { addr: string; code: string };
}>({
  id: "signup",
  initial: { step: "email", context: {} },
  steps: {
    email: {
      name: "email",
      title: "이메일 입력",
      render: ({ context, setContext }) => (
        <Input value={context.addr ?? ""} onChange={(v) => setContext({ addr: v })} />
      ),
    },
    verify: {
      name: "verify",
      title: "인증 코드",
      render: ({ context, setContext }) => (
        <CodeInput value={context.code ?? ""} onChange={(v) => setContext({ code: v })} />
      ),
      validate: (ctx) => ctx.code?.length === 6 || "6자리 코드를 입력하세요",
    },
    done: {
      name: "done",
      title: "완료",
      render: ({ context }) => <DoneView email={context.addr} />,
    },
  },
  navigation: { back: true, next: true },
  onFinish: () => submit(funnel.historySteps),
});

return <Dialog mode="modal" width={480} funnel={funnel} />;
```

### History Methods

Each step's render function receives:
- `context`: Current step's context (type-safe per step)
- `history.push(step, context)`: Move to next step with type-checked context
- `history.replace(step, context)`: Replace current history entry
- `history.back()`: Go to previous step (context restored from snapshot)
- `history.go(index)`: Jump to arbitrary step
- `setContext(patch)`: Update current step's context (for accumulate pattern)

### Switch Pattern (conditional branching)

```tsx
steps: {
  selectRole: {
    title: "역할 선택",
    hidden: true,  // hides auto-next button
    render: ({ history }) => (
      <>
        <Button text="학생" pressable={{ onClick: () => history.push("school", { school: "" }) }} />
        <Button text="직장인" pressable={{ onClick: () => history.push("company", { company: "" }) }} />
      </>
    ),
  },
}
```

### Step Config Fields

| prop | type | description |
|------|------|-------------|
| `name` | string | Step identifier, matches the key in the generic map |
| `title` / `caption` / `icon` | ReactNode | Rendered in DialogHeader by DialogFunnelShell |
| `render` | function | Step UI. Receives `{ context, history, index, total, setContext }` |
| `nextDisabled` | boolean \| ((ctx) => boolean) | Disables auto-next button |
| `hidden` | boolean | Hides auto-next entirely (for switch pattern) |
| `validate` | (ctx) => boolean \| string \| Promise | Called on advance; string = error message |

## Type Signatures

```typescript
import type { ReactNode, RefObject } from "react";
import type {
  PopoverConfig,
  ModalConfig,
  SheetConfig,
  FunnelConfig,
  FunnelNavigationConfig,
  DialogFunnelProp,
  ExitConfig,
} from "./Dialog.types";
import type { ThemeSystemProps, BorderProps } from "../Theme/Theme.types";
import type { RadiusProps } from "../Theme/Radius.types";

export type DialogMode = "popover" | "modal" | "sheet";

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
  funnel?: FunnelConfig | DialogFunnelProp; // multi-step funnel flow control

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
import { Dialog, dialog, useDialogFunnel } from "@musecat/uikit";
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

  // 2. Declarative funnel
  const funnel = useDialogFunnel<{
    step1: { field?: string };
    step2: { field: string };
  }>({
    id: "example",
    initial: { step: "step1", context: {} },
    steps: {
      step1: {
        name: "step1",
        title: "Step 1",
        render: ({ context, setContext }) => (
          <Input value={context.field ?? ""} onChange={(v) => setContext({ field: v })} />
        ),
      },
      step2: {
        name: "step2",
        title: "Step 2",
        render: ({ context }) => <div>Field: {context.field}</div>,
      },
    },
    navigation: { back: true, next: true },
  });

  return (
    <div>
      <button onClick={showModal}>Open Imperative Modal</button>
      <button onClick={() => setOpen(true)}>Open Declarative Sheet</button>

      <Dialog mode="modal" width={480} funnel={funnel} />

      {/* 3. Declarative sheet rendering */}
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
