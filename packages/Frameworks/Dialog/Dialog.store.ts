"use client";

import type { DialogProps } from "./Dialog.types";

export interface DialogInstance extends Promise<any> {
  id: string;
  instanceId: string;
  props: DialogProps;
  close: (value?: any) => void;
}

type Listener = (stack: DialogInstance[]) => void;

let nextId = 0;
let nextAnchorId = 0;
let stack: DialogInstance[] = [];
let listeners: Listener[] = [];
const anchorIds = new WeakMap<HTMLElement, string>();

function closeOpenInstances(mode: DialogProps["mode"], exceptId?: string) {
  for (const item of stack) {
    if (item.props.open === false) continue;
    if (item.props.mode !== mode) continue;
    if (exceptId && item.id === exceptId) continue;
    item.close();
  }
}

function resolveModeId(
  mode: DialogProps["mode"],
  props: Omit<DialogProps, "mode">,
) {
  if (props.id) return props.id;

  if (props.funnel?.id) {
    return `${mode}-funnel:${props.funnel.id}`;
  }

  if (mode === "modal") {
    const title =
      props.modal && "header" in props.modal
        ? props.modal.header?.title
        : undefined;
    if (typeof title === "string" && title.trim()) {
      return `dialog-modal:${title.trim()}`;
    }
  }

  if (mode === "sheet") {
    const title =
      props.sheet && "header" in props.sheet
        ? props.sheet.header?.title
        : undefined;
    if (typeof title === "string" && title.trim()) {
      return `dialog-sheet:${title.trim()}`;
    }
  }

  return `dialog-${mode}`;
}

function notify() {
  for (const listener of listeners) {
    listener([...stack]);
  }
}

export function dialog(props: DialogProps): DialogInstance {
  const id = props.id ?? `dialog-${++nextId}`;
  const instanceId = `dialog-inst-${++nextId}`;

  const existing = stack.find((item) => item.id === id);
  if (existing && existing.props.open !== false) return existing;

  let resolvePromise: (value: any) => void;

  const promise = new Promise<any>((resolve) => {
    resolvePromise = resolve;
  });

  const close = (value?: any) => {
    instance.props = {
      ...instance.props,
      open: false,
    };
    notify();
    resolvePromise(value);

    setTimeout(() => {
      stack = stack.filter(
        (item) => item !== instance || item.props.open !== false,
      );
      notify();
    }, 350);
  };

  const instance = Object.assign(promise, {
    id,
    instanceId,
    props: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) close();
      },
    },
    close,
  }) as DialogInstance;

  stack.push(instance);
  notify();

  return instance;
}

dialog.popover = (
  anchor: HTMLElement,
  popoverProps: Omit<DialogProps, "mode">,
) => {
  if (!anchorIds.has(anchor)) {
    anchorIds.set(anchor, `dialog-popover-${++nextAnchorId}`);
  }
  const id = popoverProps.id || anchorIds.get(anchor)!;

  const existing = stack.find(
    (item) => item.id === id && item.props.open !== false,
  );
  if (existing) {
    const closeOnClickTrigger =
      (popoverProps.popover as any)?.closeOnClickTrigger !== false;
    if (closeOnClickTrigger) existing.close();
    return existing;
  }

  return dialog({
    ...popoverProps,
    id,
    mode: "popover",
    popover: {
      anchorRef: { current: anchor },
      ...(popoverProps.popover as any),
    },
  } as DialogProps);
};

dialog.modal = (modalProps: Omit<DialogProps, "mode">) => {
  const id = resolveModeId("modal", modalProps);
  const existing = stack.find(
    (item) => item.id === id && item.props.open !== false,
  );
  if (existing) {
    existing.close();
    return existing;
  }

  closeOpenInstances("modal", id);

  return dialog({
    ...modalProps,
    id,
    mode: "modal",
  } as DialogProps);
};

dialog.sheet = (sheetProps: Omit<DialogProps, "mode">) => {
  const id = resolveModeId("sheet", sheetProps);
  const existing = stack.find(
    (item) => item.id === id && item.props.open !== false,
  );
  if (existing) {
    existing.close();
    return existing;
  }

  closeOpenInstances("sheet", id);

  return dialog({
    ...sheetProps,
    id,
    mode: "sheet",
  } as DialogProps);
};

export const DialogStore = {
  getStack() {
    return [...stack];
  },
  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  clear() {
    stack = [];
    notify();
  },
};
