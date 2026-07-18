import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "../../packages/Components/Header/Header";

vi.mock("../../packages/Frameworks/EdgeEffect/EdgeEffect.tsx", () => ({
  default: ({ side, className }: { side?: string; className?: string }) => (
    <div data-testid="edge-effect" data-side={side} className={className} />
  ),
}));
vi.mock("../../packages/Frameworks/View/View.tsx", () => ({
  default: ({ children, ...rest }: any) => (
    <div data-testid="view" {...rest}>
      {children}
    </div>
  ),
}));

describe("Header", () => {
  it("renders a header element", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders a top edge effect", () => {
    render(<Header />);
    const edge = screen.getByTestId("edge-effect");
    expect(edge).toHaveAttribute("data-side", "top");
  });

  it("renders the left slot", () => {
    render(<Header left={<span data-testid="left">L</span>} />);
    expect(screen.getByTestId("left")).toBeInTheDocument();
  });

  it("renders the center slot", () => {
    render(<Header center={<span data-testid="center">C</span>} />);
    expect(screen.getByTestId("center")).toBeInTheDocument();
  });

  it("renders the right slot", () => {
    render(<Header right={<span data-testid="right">R</span>} />);
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("lays out all three slots", () => {
    render(
      <Header
        left={<span data-testid="left">L</span>}
        center={<span data-testid="center">C</span>}
        right={<span data-testid="right">R</span>}
      />,
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("center")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("forwards a className to the header", () => {
    const { container } = render(<Header className="my-header" />);
    expect(container.querySelector(".my-header")).toBeTruthy();
  });

  it("sets data-color-mode when provided", () => {
    render(<Header data-color-mode="dark" />);
    expect(screen.getByRole("banner")).toHaveAttribute(
      "data-color-mode",
      "dark",
    );
  });
});
