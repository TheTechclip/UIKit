import { fireEvent, render } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNavDrag } from "../../packages/Components/Nav/hooks/useNavDrag";

const items = [
  { title: "One", value: "one" },
  { title: "Two", value: "two" },
  { title: "Three", value: "three" },
];

type HarnessProps = {
  commit?: "change" | "end";
  dragSelection?: boolean;
  radio?: boolean;
  callbacks: ReturnType<typeof createCallbacks>;
};

function createCallbacks() {
  return {
    applyIndicatorStyle: vi.fn(),
    dragReleaseTimer: { clear: vi.fn(), start: vi.fn() },
    selectValue: vi.fn(),
    setDragPreviewValue: vi.fn(),
    setIsDraggingSelection: vi.fn(),
    setIsReleasingSelection: vi.fn(),
    setPressed: vi.fn(),
  };
}

function Harness({
  callbacks,
  commit = "change",
  dragSelection = true,
  radio = true,
}: HarnessProps) {
  const itemRefs = { current: [] } as React.MutableRefObject<
    (HTMLElement | null)[]
  >;
  const drag = useNavDrag({
    items,
    itemRefs,
    dragSelection,
    radio,
    dragSelectionCommit: commit,
    committedIndicatorStyleRef: { current: { left: 0, width: 10 } },
    ...callbacks,
  });

  return (
    <div
      data-testid="nav"
      onPointerDown={drag.handlePointerDown}
      onPointerMove={drag.handlePointerMove}
      onPointerUp={drag.stopDragging}
      onPointerCancel={drag.stopDragging}
      ref={(node) => {
        if (!node) return;
        Object.assign(node, {
          hasPointerCapture: () => false,
          releasePointerCapture: vi.fn(),
          setPointerCapture: vi.fn(),
        });
      }}
    >
      {items.map((item, index) => (
        <button
          key={item.value}
          ref={(node) => {
            itemRefs.current[index] = node;
            if (!node) return;
            Object.defineProperties(node, {
              offsetLeft: { configurable: true, value: index * 100 },
              offsetWidth: { configurable: true, value: 80 },
            });
            node.getBoundingClientRect = () =>
              new DOMRect(index * 100, 0, 80, 32);
          }}
          type="button"
        >
          {item.title}
        </button>
      ))}
    </div>
  );
}

describe("useNavDrag", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    class PointerEventMock extends MouseEvent {
      pointerId: number;
      pointerType: string;

      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerId = init.pointerId ?? 0;
        this.pointerType = init.pointerType ?? "mouse";
      }
    }
    vi.stubGlobal("PointerEvent", PointerEventMock);
  });

  it("leaves ordinary presses enabled without starting a drag", () => {
    const callbacks = createCallbacks();
    const { getByTestId } = render(
      <Harness callbacks={callbacks} dragSelection={false} />,
    );

    fireEvent.pointerDown(getByTestId("nav"), {
      button: 0,
      clientX: 10,
      pointerId: 1,
      pointerType: "mouse",
    });

    expect(callbacks.setPressed).toHaveBeenCalledWith(true);
    expect(callbacks.setIsDraggingSelection).not.toHaveBeenCalled();
  });

  it("commits each mouse preview and restores the selected indicator", () => {
    const callbacks = createCallbacks();
    const { getByTestId } = render(<Harness callbacks={callbacks} />);
    const nav = getByTestId("nav");

    fireEvent.pointerDown(nav, {
      button: 0,
      clientX: 10,
      pointerId: 1,
      pointerType: "mouse",
    });
    fireEvent.pointerMove(nav, { clientX: 150, pointerId: 1 });
    fireEvent.pointerUp(nav, { clientX: 150, pointerId: 1 });

    expect(callbacks.selectValue).toHaveBeenCalledWith("one");
    expect(callbacks.selectValue).toHaveBeenCalledWith("two");
    expect(callbacks.setIsDraggingSelection).toHaveBeenLastCalledWith(false);
    expect(callbacks.setIsReleasingSelection).toHaveBeenLastCalledWith(true);
    expect(callbacks.applyIndicatorStyle).toHaveBeenLastCalledWith({
      left: 100,
      opacity: 1,
      width: 80,
    });
    expect(callbacks.dragReleaseTimer.start).toHaveBeenCalledWith(240);
  });

  it("activates a horizontal touch gesture but rejects vertical scrolling", () => {
    const callbacks = createCallbacks();
    const { getByTestId } = render(
      <Harness callbacks={callbacks} commit="end" />,
    );
    const nav = getByTestId("nav");

    fireEvent.pointerDown(nav, {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 2,
      pointerType: "touch",
    });
    fireEvent.pointerMove(nav, {
      clientX: 12,
      clientY: 30,
      pointerId: 2,
      pointerType: "touch",
    });
    fireEvent.pointerUp(nav, { pointerId: 2 });
    expect(callbacks.setIsDraggingSelection).not.toHaveBeenCalled();

    fireEvent.pointerDown(nav, {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 3,
      pointerType: "touch",
    });
    fireEvent.pointerMove(nav, {
      clientX: 40,
      clientY: 12,
      pointerId: 3,
      pointerType: "touch",
    });
    fireEvent.pointerMove(nav, {
      clientX: 250,
      clientY: 12,
      pointerId: 3,
      pointerType: "touch",
    });
    fireEvent.pointerUp(nav, { clientX: 250, pointerId: 3 });

    expect(callbacks.setDragPreviewValue).toHaveBeenCalledWith("one");
    expect(callbacks.selectValue).toHaveBeenCalledWith("three");
  });
});
