import { renderHook } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { useNavDrag } from "../../packages/Components/Nav/hooks/useNavDrag";

describe("useNavDrag", () => {
  const itemRefs = { current: [] } as React.MutableRefObject<
    (HTMLElement | null)[]
  >;
  const dragReleaseTimer = { clear: vi.fn(), start: vi.fn() };

  it("returns drag state", () => {
    const { result } = renderHook(() =>
      useNavDrag({
        items: [],
        itemRefs,
        dragSelection: false,
        radio: false,
        dragSelectionCommit: "change",
        selectValue: vi.fn(),
        setDragPreviewValue: vi.fn(),
        applyIndicatorStyle: vi.fn(),
        committedIndicatorStyleRef: { current: undefined },
        setIsDraggingSelection: vi.fn(),
        setIsReleasingSelection: vi.fn(),
        setPressed: vi.fn(),
        dragReleaseTimer,
      }),
    );
    expect(result.current).toBeDefined();
  });
});
