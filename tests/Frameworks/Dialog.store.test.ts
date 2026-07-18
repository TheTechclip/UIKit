import { beforeEach, describe, expect, it } from "vitest";
import { DialogStore, dialog } from "../../packages/Frameworks/Dialog/Dialog.store";

describe("DialogStore", () => {
  beforeEach(() => {
    DialogStore.clear();
  });

  it("returns empty stack initially", () => {
    expect(DialogStore.getStack()).toHaveLength(0);
  });

  it("notifies subscribers on change", () => {
    const cb = vi.fn();
    DialogStore.subscribe(cb);
    DialogStore.clear();
    expect(cb).toHaveBeenCalled();
  });
});

describe("dialog()", () => {
  beforeEach(() => {
    DialogStore.clear();
  });

  it("creates and tracks a dialog", () => {
    const instance = dialog({ mode: "modal", open: true });
    expect(DialogStore.getStack()).toHaveLength(1);
    expect(instance.id).toBeDefined();
  });

  it("closes a dialog", () => {
    const instance = dialog({ mode: "modal", open: true });
    instance.close();
    const stack = DialogStore.getStack();
    const found = stack.find((d) => d.id === instance.id);
    expect(found?.props.open).toBe(false);
  });

  it("toggles popover dialog", () => {
    const anchor = document.createElement("button");
    const instance = dialog({
      mode: "popover",
      open: false,
      popover: { anchorRef: { current: anchor } } as any,
    });
    expect(DialogStore.getStack()).toHaveLength(1);
  });

  it("uses the funnel's stable id after its current step changes", () => {
    const Content = () => null;
    const createFunnel = (name: string) => ({
      id: "signup",
      Content,
      current: {
        name,
        index: 0,
        total: 2,
        isFirst: true,
        isLast: false,
        nextDisabled: false,
        meta: {},
      },
      error: null,
      goBack: () => {},
      advance: async () => {},
    });

    const first = dialog.modal({ funnel: createFunnel("Account") });
    const reopened = dialog.modal({ funnel: createFunnel("Confirm") });

    expect(reopened.id).toBe(first.id);
    expect(DialogStore.getStack()).toHaveLength(1);
  });
});
