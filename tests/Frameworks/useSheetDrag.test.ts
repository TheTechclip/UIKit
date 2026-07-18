import { act, renderHook } from "@testing-library/react";
import type { MotionValue } from "motion/react";
import { describe, expect, it, vi } from "vitest";
import { useSheetDrag } from "../../packages/Frameworks/Dialog/hooks/useSheetDrag";

function createMotionValue(initial = 0) {
  let value = initial;
  return {
    get: () => value,
    jump: vi.fn((next: number) => {
      value = next;
    }),
    set: vi.fn((next: number) => {
      value = next;
    }),
    stop: vi.fn(),
  } as unknown as MotionValue<number>;
}

function createInput(
  overrides: Partial<Parameters<typeof useSheetDrag>[0]> = {},
) {
  return {
    y: createMotionValue(),
    scrollRef: { current: document.createElement("div") },
    config: undefined,
    viewportHeight: 800,
    getViewportHeight: () => 800,
    sheetHeightPx: 400,
    isFreeDrag: false,
    minPx: 100,
    maxPx: 800,
    maxSnap: 1,
    normalizedSnapPoints: [0.5, 1],
    resolvedFreeDragHeightPx: 800,
    isMinDefault: true,
    snapIndex: 0,
    currentSnap: 0.5,
    getTargetYForSnap: (snap: number) => (1 - snap) * 800,
    getGapHiddenY: () => 800,
    close: vi.fn(),
    cancelEntranceAnimation: vi.fn(),
    onDragStateChange: vi.fn(),
    onSnapIndexChange: vi.fn(),
    ...overrides,
  };
}

describe("useSheetDrag", () => {
  it("closes the lowest fixed snap after a downward flick", () => {
    const input = createInput();
    const { result } = renderHook(() => useSheetDrag(input));

    act(() => {
      result.current.handleDragEnd(new PointerEvent("pointerup"), {
        offset: { y: 10 },
        velocity: { y: 1000 },
      });
    });

    expect(input.close).toHaveBeenCalledOnce();
    expect(input.onDragStateChange).toHaveBeenLastCalledWith(false);
  });

  it("snaps to the nearest fixed point instead of closing", () => {
    const input = createInput({ snapIndex: 1 });
    const { result } = renderHook(() => useSheetDrag(input));

    act(() => {
      result.current.handleDragEnd(new PointerEvent("pointerup"), {
        offset: { y: 0 },
        velocity: { y: 1000 },
      });
    });

    expect(input.onSnapIndexChange).toHaveBeenCalledWith(1);
    expect(input.close).not.toHaveBeenCalled();
  });

  it("clamps a free drag to its configured minimum", () => {
    const y = createMotionValue(300);
    const input = createInput({
      config: { min: 200, freeDrag: true },
      isFreeDrag: true,
      resolvedFreeDragHeightPx: 600,
      y,
    });
    const { result } = renderHook(() => useSheetDrag(input));

    act(() => {
      result.current.handleDragEnd(new PointerEvent("pointerup"), {
        offset: { y: 0 },
        velocity: { y: 0 },
      });
    });

    expect(input.close).not.toHaveBeenCalled();
    expect(input.onDragStateChange).toHaveBeenLastCalledWith(false);
  });

  it("closes an implicitly-sized free drag that is released below its minimum", () => {
    const input = createInput({
      isFreeDrag: true,
      isMinDefault: false,
      resolvedFreeDragHeightPx: 400,
      y: createMotionValue(300),
    });
    const { result } = renderHook(() => useSheetDrag(input));

    act(() => {
      result.current.handleDragEnd(new PointerEvent("pointerup"), {
        offset: { y: 0 },
        velocity: { y: 1000 },
      });
    });

    expect(input.close).toHaveBeenCalledOnce();
  });

  it("uses sheet height to close a single fixed snap point", () => {
    const input = createInput({
      normalizedSnapPoints: [0.5],
      sheetHeightPx: 300,
      y: createMotionValue(200),
    });
    const { result } = renderHook(() => useSheetDrag(input));

    act(() => {
      result.current.handleDragEnd(new PointerEvent("pointerup"), {
        offset: { y: 0 },
        velocity: { y: 0 },
      });
    });

    expect(input.close).toHaveBeenCalledOnce();
  });

  it("takes over a top-scrolled content drag and releases it into snap logic", () => {
    const input = createInput();
    const scroll = input.scrollRef.current;
    if (!scroll) {
      throw new Error("Expected the scroll container");
    }
    Object.assign(scroll, {
      hasPointerCapture: () => true,
      releasePointerCapture: vi.fn(),
      setPointerCapture: vi.fn(),
    });
    const { result } = renderHook(() => useSheetDrag(input));
    const pointer = (clientY: number) =>
      ({
        clientY,
        pointerId: 5,
        preventDefault: vi.fn(),
      }) as unknown as React.PointerEvent;

    act(() => result.current.handleContentPointerDown(pointer(100)));
    act(() => result.current.handleContentPointerMove(pointer(110)));
    act(() => result.current.handleContentPointerMove(pointer(180)));
    act(() => result.current.handleContentPointerUp(pointer(180)));

    expect(scroll.setPointerCapture).toHaveBeenCalledWith(5);
    expect(scroll.releasePointerCapture).toHaveBeenCalledWith(5);
    expect(input.onDragStateChange).toHaveBeenCalledWith(true);
  });

  it("restores the current target when content dragging is cancelled", () => {
    const input = createInput();
    const scroll = input.scrollRef.current;
    if (!scroll) {
      throw new Error("Expected the scroll container");
    }
    Object.assign(scroll, { setPointerCapture: vi.fn() });
    const { result } = renderHook(() => useSheetDrag(input));
    const pointer = (clientY: number) =>
      ({
        clientY,
        pointerId: 5,
        preventDefault: vi.fn(),
      }) as unknown as React.PointerEvent;

    act(() => result.current.handleContentPointerDown(pointer(100)));
    act(() => result.current.handleContentPointerMove(pointer(110)));
    act(() => result.current.handleContentPointerCancel());

    expect(scroll.style.touchAction).toBe("");
    expect(input.onDragStateChange).toHaveBeenLastCalledWith(false);
  });

  it("does not interfere with disabled or already-scrolled content", () => {
    const disabled = createInput({ config: { disableDrag: true } });
    const { result: disabledResult } = renderHook(() => useSheetDrag(disabled));
    const pointer = {
      clientY: 100,
      pointerId: 5,
      preventDefault: vi.fn(),
    } as unknown as React.PointerEvent;

    act(() => disabledResult.current.handleContentPointerDown(pointer));
    expect(disabled.cancelEntranceAnimation).not.toHaveBeenCalled();

    const scrolled = createInput();
    if (!scrolled.scrollRef.current) {
      throw new Error("Expected the scroll container");
    }
    scrolled.scrollRef.current.scrollTop = 10;
    const { result } = renderHook(() => useSheetDrag(scrolled));
    act(() => result.current.handleContentPointerDown(pointer));
    act(() => result.current.handleContentPointerMove(pointer));
    expect(scrolled.y.set).not.toHaveBeenCalled();
  });
});
