import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CodeBox from "@/packages/Components/CodeBox/CodeBox";

vi.mock("@/packages/Frameworks/Pressable/Pressable", () => ({
  default: ({ children, ...rest }: any) => (
    <button type="button" {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("@/packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

vi.mock("@/packages/Components/Icon/Icon", () => ({
  default: ({ icon }: { icon?: string }) => (
    <span data-testid="icon">{icon}</span>
  ),
}));

describe("CodeBox", () => {
  it("renders code content", () => {
    render(<CodeBox code="console.log('hello')" language="js" />);
    expect(screen.getByText(/console/)).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    render(<CodeBox code="test" language="text" />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("renders with theme props", () => {
    render(<CodeBox code="copy this" language="text" />);
    expect(screen.getByText("copy this")).toBeInTheDocument();
  });
});
