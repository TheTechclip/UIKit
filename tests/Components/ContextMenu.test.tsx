import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ContextMenu from "../../packages/Components/ContextMenu/ContextMenu";
import { useRef } from "react";

const TestComponent = () => {
  const anchorRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={anchorRef} data-testid="anchor">Anchor</div>
      <ContextMenu
        open={true}
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        popoverOwnerId="test"
        listId="test-list"
        isInteractionDisabled={false}
        recalcKey="test"
        contents={[
          { type: "option", label: "Option 1", value: "1", onClick: vi.fn() },
          { type: "option", label: "Option 2", value: "2" },
        ]}
      />
    </>
  );
};

describe("ContextMenu Component", () => {
  it("renders options correctly", () => {
    render(<TestComponent />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });
});
