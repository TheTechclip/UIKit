import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EdgeEffect from "../../packages/frameworks/EdgeEffect/EdgeEffect";

vi.mock("../../packages/frameworks/View/View.tsx", () => ({
  default: ({ children, style, ...rest }: any) => (
    <div data-testid="view" style={style} {...rest}>
      {children}
    </div>
  ),
}));

describe("EdgeEffect", () => {
  it("renders a gradient overlay", () => {
    const { container } = render(<EdgeEffect />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with top side by default", () => {
    render(<EdgeEffect />);
    const views = screen.getAllByTestId("view");
    const inner = views[1];
    expect(inner.style.background).toContain("linear-gradient");
    expect(inner.style.background).toContain("to bottom");
  });

  it("renders with a custom side", () => {
    render(<EdgeEffect side="bottom" />);
    const views = screen.getAllByTestId("view");
    expect(views[1].style.background).toContain("to top");
  });

  it("renders with left side", () => {
    render(<EdgeEffect side="left" />);
    const views = screen.getAllByTestId("view");
    expect(views[1].style.background).toContain("to right");
  });

  it("sets pointer-events to none", () => {
    const { container } = render(<EdgeEffect />);
    expect((container.firstChild as HTMLElement).style.pointerEvents).toBe(
      "none",
    );
  });
});
