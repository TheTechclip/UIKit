import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Tooltip from "../../packages/Components/Tooltip/Tooltip";
import View from "../../packages/Frameworks/View/View";

vi.mock("../../packages/Frameworks/View/View.tsx", () => ({
  default: ({ children, role, ...rest }: any) => (
    <div data-testid="view" {...rest}>
      {children}
    </div>
  ),
}));

describe("Tooltip", () => {
  function getWrapper() {
    return screen.getAllByTestId("view")[0];
  }

  it("shows content when open is controlled", () => {
    render(
      <Tooltip
        trigger={<button type="button">Hover</button>}
        content="Help text"
        open
      />,
    );
    const wrapper = getWrapper();
    expect(wrapper).toHaveAttribute("data-tooltip-open");
  });

  it("supports controlled open state", () => {
    const { rerender } = render(
      <Tooltip
        trigger={<button type="button">X</button>}
        content="Help text"
        open
      />,
    );
    expect(getWrapper()).toBeInTheDocument();
    rerender(
      <Tooltip
        trigger={<button type="button">X</button>}
        content="Help text"
        open={false}
      />,
    );
    expect(getWrapper()).toBeInTheDocument();
  });

  it("does not toggle when disabled", () => {
    render(
      <Tooltip
        trigger={<button type="button">X</button>}
        content="Help text"
        disabled
      />,
    );
    const wrapper = getWrapper();
    fireEvent.click(wrapper);
    expect(wrapper).not.toHaveAttribute("data-tooltip-open");
  });

  it("toggles on click", () => {
    render(
      <Tooltip
        trigger={<button type="button">X</button>}
        content="Help text"
      />,
    );
    const wrapper = getWrapper();
    fireEvent.click(wrapper);
    expect(wrapper).toHaveAttribute("data-tooltip-open");
    fireEvent.click(wrapper);
    expect(wrapper).not.toHaveAttribute("data-tooltip-open");
  });

  it("renders custom content", () => {
    render(
      <Tooltip
        trigger={<button type="button">X</button>}
        content={<span data-testid="custom">Custom</span>}
        open
      />,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });
});
