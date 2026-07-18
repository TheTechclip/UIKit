import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import StopParentInteraction from "../../packages/Frameworks/_shared/StopParentInteraction";

describe("StopParentInteraction", () => {
  it("renders children", () => {
    render(
      <StopParentInteraction>
        <div data-testid="child">content</div>
      </StopParentInteraction>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("content");
  });

  it("stops propagation on mouse down", async () => {
    const user = userEvent.setup();
    const outerClick = vi.fn();
    render(
      <div onClick={outerClick}>
        <StopParentInteraction>
          <span>inner</span>
        </StopParentInteraction>
      </div>,
    );
    await user.click(screen.getByText("inner"));
    expect(outerClick).not.toHaveBeenCalled();
  });
});
