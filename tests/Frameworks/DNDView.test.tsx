import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DNDView from "@/packages/Frameworks/View/DNDView/DNDView";

vi.mock("@/packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: any) => (
    <div data-testid="dnd-context">{children}</div>
  ),
  DragOverlay: ({ children }: any) => <div>{children}</div>,
  closestCenter: () => {},
  KeyboardSensor: class {},
  PointerSensor: class {
    static activators = [];
  },
  MouseSensor: class {
    static activators = [];
  },
  TouchSensor: class {
    static activators = [];
  },
  useSensor: () => ({}),
  useSensors: (...sensors: any[]) => sensors,
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => (
    <div data-testid="sortable">{children}</div>
  ),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
  verticalListSortingStrategy: {},
  horizontalListSortingStrategy: {},
  rectSortingStrategy: {},
  arrayMove: (arr: any[], from: number, to: number) => {
    const copy = [...arr];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item!);
    return copy;
  },
  sortableKeyboardCoordinates: () => {},
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: { toString: () => "" },
  },
}));

describe("DNDView", () => {
  type Item = { id: string; label: string };
  const items: Item[] = [
    { id: "1", label: "Item 1" },
    { id: "2", label: "Item 2" },
  ];

  it("renders items", () => {
    render(
      <DNDView
        items={items}
        onReorder={() => {}}
        getKey={(item) => item.id}
        renderItem={(item) => <div data-testid="rendered">{item.label}</div>}
      />,
    );
    expect(screen.getAllByTestId("rendered")).toHaveLength(2);
  });

  it("renders with drag handle", () => {
    render(
      <DNDView
        items={items}
        onReorder={() => {}}
        getKey={(item) => item.id}
        renderItem={(item) => <div>{item.label}</div>}
        dragHandle
      />,
    );
    expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
  });
});
