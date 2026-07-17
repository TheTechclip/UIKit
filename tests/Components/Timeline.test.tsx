import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Timeline from "@/packages/Components/Timeline/Timeline";
import type { TimelineItemProps } from "@/packages/Components/Timeline/Timeline.types";

describe("Timeline Component", () => {
  const defaultItems: TimelineItemProps[] = [
    { id: "1", children: <div>Step 1</div> },
    { id: "2", children: <div>Step 2</div> },
    { id: "3", children: <div>Step 3</div> },
  ];

  it("renders all items", () => {
    render(<Timeline items={defaultItems} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("applies pressable props to item", () => {
    const onClick = vi.fn();
    const items = [
      {
        id: "1",
        children: <div>Clickable Step</div>,
        pressable: { onClick },
      },
    ];
    render(<Timeline items={items} />);
    const item = screen.getByText("Clickable Step").parentElement as HTMLElement;
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders custom node", () => {
    const items = [
      {
        id: "1",
        children: <div>Step</div>,
        node: <div data-testid="custom-node">Custom</div>,
      },
    ];
    render(<Timeline items={items} />);
    expect(screen.getByTestId("custom-node")).toBeInTheDocument();
  });

  it("renders icon node", () => {
    const items = [
      {
        id: "1",
        children: <div>Step</div>,
        icon: { icon: "iArrowRight" as const },
      },
    ];
    const { container } = render(<Timeline items={items} />);
    expect(container.querySelector(".iArrowRight")).toBeInTheDocument();
  });

  it("passes global node props and overrides with item node props", () => {
    const items = [
      {
        id: "1",
        children: <div>Item 1</div>,
        nodePreset: "UISecondary" as const,
      },
      {
        id: "2",
        children: <div>Item 2</div>,
      },
    ];
    const { container } = render(
      <Timeline items={items} nodePreset="UIAccent" />
    );

    const step1 = screen.getByText("Item 1").parentElement?.parentElement as HTMLElement;
    const step2 = screen.getByText("Item 2").parentElement?.parentElement as HTMLElement;
    
    // The node is the first child of the item container, which is a View
    // View resolves themePreset into className, usually containing specific ThemeBg classes
    expect(step1.innerHTML).not.toEqual(step2.innerHTML);
    expect(step1.innerHTML).toContain("ThemeBg-");
  });

  it("does not render divider for last item", () => {
    // There are 3 items, so there should be 2 dividers.
    const { container } = render(<Timeline items={defaultItems} />);
    // Divider renders <hr>
    const dividers = container.querySelectorAll("hr");
    expect(dividers).toHaveLength(2);
  });
});
