import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Pill from "@/packages/Components/Pill/Pill";
import Icon from "@/packages/Components/Icon/Icon";
import Text from "@/packages/Components/Text/Text";
import Pressable from "@/packages/Frameworks/Pressable/Pressable";

vi.mock("@/packages/Components/Icon/Icon", () => ({
  default: ({ icon, spinner }: { icon?: string; spinner?: boolean }) => (
    <span data-testid="icon" data-icon={icon} data-spinner={spinner ? "true" : undefined} />
  ),
}));
vi.mock("@/packages/Components/Text/Text", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <span data-testid="text">{children}</span>
  ),
}));
vi.mock("@/packages/Frameworks/Pressable/Pressable", () => ({
  default: ({ children, onClick, ...rest }: any) => (
    <button type="button" data-testid="pressable" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

describe("Pill", () => {
  it("renders the text", () => {
    render(<Pill text="Active" />);
    expect(screen.getByTestId("text")).toHaveTextContent("Active");
  });

  it("renders an icon when provided", () => {
    render(<Pill text="X" icon={{ icon: "iStar" }} />);
    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon", "iStar");
  });

  it("renders a spinner when loading", () => {
    render(<Pill text="X" loading />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("data-spinner", "true");
  });

  it("fires the pressable onClick", () => {
    const onClick = vi.fn();
    render(<Pill text="X" pressable={{ onClick }} />);
    fireEvent.click(screen.getByTestId("pressable"));
    expect(onClick).toHaveBeenCalled();
  });

  it("marks the pill disabled when loading", () => {
    render(<Pill text="X" loading />);
    expect(screen.getByTestId("pressable")).toBeDisabled();
  });

  it("marks the pill disabled when disabled prop is set", () => {
    render(<Pill text="X" disabled />);
    expect(screen.getByTestId("pressable")).toBeDisabled();
  });

  it("renders a right icon", () => {
    render(<Pill text="X" rightIcon={{ icon: "iClose" }} />);
    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon", "iClose");
  });

  it("forwards a custom className", () => {
    const { container } = render(<Pill text="X" className="my-pill" />);
    expect(container.querySelector(".my-pill")).toBeTruthy();
  });
});
