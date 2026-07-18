import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSheetDrag } from "../../packages/Frameworks/Dialog/hooks/useSheetDrag";

describe("useSheetDrag", () => {
  const base = {
    y: { get: () => 0, set: vi.fn(), on: vi.fn() } as any,
    scrollRef: { current: null } as any,
    config: undefined,
    viewportHeight: 800,
    getViewportHeight: () => 800,
    sheetHeightPx: 400,
    isFreeDrag: false,
    minPx: 100,
    maxPx: 800,
    maxSnap: 1,
    normalizedSnapPoints: [0, 0.5, 1],
    resolvedFreeDragHeightPx: 800,
    isMinDefault: true,
    snapIndex: 0,
    currentSnap: 0,
    getTargetYForSnap: (_s: number) => 0,
    getGapHiddenY: () => 800,
    close: vi.fn(),
    cancelEntranceAnimation: vi.fn(),
  };

  it("returns drag handlers", () => {
    const { result } = renderHook(() => useSheetDrag(base));
    expect(result.current.handleDragEnd).toBeDefined();
  });
});
