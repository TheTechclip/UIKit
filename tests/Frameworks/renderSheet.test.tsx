import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const motionMocks = vi.hoisted(() => {
  type MotionListener = (value: number) => void;
  const createMotionValue = (initial: number) => {
    let value = initial;
    const listeners = new Set<MotionListener>();
    return {
      get: () => value,
      jump: (next: number) => {
        value = next;
        listeners.forEach((listener) => {
          listener(next);
        });
      },
      on: (_event: "change", listener: MotionListener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      set: (next: number) => {
        value = next;
        listeners.forEach((listener) => {
          listener(next);
        });
      },
      stop: vi.fn(),
    };
  };

  return {
    animate: vi.fn(
      (
        _value: unknown,
        _target: unknown,
        options?: { onComplete?: () => void },
      ) => {
        options?.onComplete?.();
        return { stop: vi.fn() };
      },
    ),
    createMotionValue,
    dragControls: { start: vi.fn() },
  };
});

vi.mock("motion/react", () => ({
  animate: motionMocks.animate,
  useDragControls: () => motionMocks.dragControls,
  useMotionValue: motionMocks.createMotionValue,
  useTransform: () => motionMocks.createMotionValue(1),
}));
vi.mock("../../packages/Frameworks/View/View", () => ({
  default: ({
    children,
    motion: _motion,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { motion?: unknown }) => (
    <div {...props}>{children}</div>
  ),
}));
vi.mock("../../packages/Frameworks/Pressable/Pressable", () => ({
  default: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} type="button">
      {children}
    </button>
  ),
}));
vi.mock("../../packages/Frameworks/Dialog/contents/Dialog.header", () => ({
  default: ({ onExit }: { onExit: () => void }) => (
    <button onClick={onExit} type="button">
      header exit
    </button>
  ),
}));
vi.mock("../../packages/Frameworks/Dialog/contents/Dialog.footer", () => ({
  default: ({ onExit }: { onExit: () => void }) => (
    <button onClick={onExit} type="button">
      footer exit
    </button>
  ),
}));
vi.mock("../../packages/Frameworks/Dialog/Dialog.background", () => ({
  default: ({ onClick }: { onClick?: () => void }) => (
    <button aria-label="backdrop" onClick={onClick} type="button" />
  ),
}));
vi.mock("../../packages/Frameworks/Dialog/Dialog.utils", () => ({
  DialogPortal: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useEscapeClose: () => undefined,
}));
vi.mock("../../packages/Frameworks/Dialog/hooks/useSheetGeometry", () => ({
  resolveInitialSnapIndex: () => 0,
  useSheetGeometry: () => ({
    getGapHiddenY: () => 800,
    getTargetYForSnap: (snap: number) => (1 - snap) * 800,
    getViewportHeight: () => 800,
    isFreeDrag: false,
    isMinDefault: false,
    maxPx: 800,
    maxSnap: 1,
    minPx: 100,
    normalizedSnapPoints: [0.5, 1],
    resolvedFreeDragHeightPx: 800,
    viewportHeight: 800,
  }),
}));
vi.mock("../../packages/Frameworks/Dialog/hooks/useSheetProgressive", () => ({
  useSheetProgressive: () => ({
    bottomGap: 8,
    inset: 8,
    radiusArr: "ExtraBold",
  }),
}));
vi.mock("../../packages/Frameworks/Dialog/hooks/useSheetDrag", () => ({
  useSheetDrag: () => ({
    handleContentPointerCancel: vi.fn(),
    handleContentPointerDown: vi.fn(),
    handleContentPointerMove: vi.fn(),
    handleContentPointerUp: vi.fn(),
    handleDragEnd: vi.fn(),
  }),
}));

import RenderSheet from "../../packages/Frameworks/Dialog/renderers/renderSheet";

describe("RenderSheet", () => {
  it("renders an open sheet and wires drag, overlay, header, footer, and Escape exits", () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const onOpenChange = vi.fn();
    render(
      <RenderSheet
        config={{ snapPoints: [0.5, 1] }}
        id="sheet"
        onOpenChange={onOpenChange}
        open
      >
        <p>Sheet content</p>
      </RenderSheet>,
    );

    const sheet = screen.getByRole("dialog");
    expect(sheet).toHaveAttribute("id", "sheet");
    expect(screen.getByText("Sheet content")).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByRole("button", { name: "시트 이동" }));
    expect(motionMocks.dragControls.start).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "backdrop" }));
    fireEvent.click(screen.getByRole("button", { name: "header exit" }));
    fireEvent.click(screen.getByRole("button", { name: "footer exit" }));
    fireEvent.keyDown(sheet, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("honors disabled outside and drag settings", () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    const onOpenChange = vi.fn();
    render(
      <RenderSheet
        config={{
          disableDrag: true,
          exit: { escape: false, overlay: false },
          outside: false,
        }}
        onOpenChange={onOpenChange}
        open
      />,
    );

    expect(
      screen.queryByRole("button", { name: "backdrop" }),
    ).not.toBeInTheDocument();
    fireEvent.pointerDown(screen.getByRole("button", { name: "시트 이동" }));
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(motionMocks.dragControls.start).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("releases an already open sheet when its controlled state becomes closed", () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <RenderSheet
        config={{ defaultSnap: 1, outside: { lockBodyScroll: false } }}
        onOpenChange={onOpenChange}
        open
      />,
    );

    rerender(
      <RenderSheet
        config={{ defaultSnap: 1, outside: { lockBodyScroll: false } }}
        onOpenChange={onOpenChange}
        open={false}
      />,
    );

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("uses an explicit snap value when it is not an array index", () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    render(
      <RenderSheet
        config={{ defaultSnap: 0.5, snapPoints: [0.5, 1] }}
        onOpenChange={vi.fn()}
        open
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(motionMocks.animate).toHaveBeenCalled();
  });
});
