import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Icon from "../../packages/Components/Icon/Icon";
import IconGroup from "../../packages/Components/Icon/Icon.group";
import Pill from "../../packages/Components/Pill/Pill";
import Text from "../../packages/Components/Text/Text";
import Title from "../../packages/Components/Title/Title";
import Pressable from "../../packages/Frameworks/Pressable/Pressable";
import View from "../../packages/Frameworks/View/View";

vi.mock("../../packages/Components/Icon/Icon.group.tsx", () => ({
  default: ({ icons }: { icons?: unknown[] }) => (
    <span data-testid="icon-group" data-count={icons?.length ?? 0} />
  ),
}));
vi.mock("../../packages/Components/Icon/Icon.tsx", () => ({
  IconInner: ({ icon }: { icon?: string }) => (
    <span data-testid="icon-inner" data-icon={icon} />
  ),
  default: () => null,
}));
vi.mock("../../packages/Components/Pill/Pill.tsx", () => ({
  default: ({ text }: { text?: React.ReactNode }) => (
    <span data-testid="pill">{text}</span>
  ),
}));
vi.mock("../../packages/Components/Text/Text.tsx", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <span data-testid="text">{children}</span>
  ),
}));
vi.mock("../../packages/Frameworks/Pressable/Pressable.tsx", () => ({
  default: ({ children, onClick, ...rest }: any) => (
    <button type="button" data-testid="pressable" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));
vi.mock("../../packages/Frameworks/View/View.tsx", () => ({
  default: ({ children, ...rest }: any) => (
    <div data-testid="view" {...rest}>
      {children}
    </div>
  ),
}));

describe("Title", () => {
  it("renders the title text", () => {
    render(<Title title={[{ text: "Dashboard" }]} />);
    expect(screen.getByTestId("text")).toHaveTextContent("Dashboard");
  });

  it("renders multiple title items", () => {
    render(<Title title={[{ text: "A" }, { text: "B" }]} />);
    const texts = screen.getAllByTestId("text");
    expect(texts.some((t) => t.textContent === "A")).toBe(true);
    expect(texts.some((t) => t.textContent === "B")).toBe(true);
  });

  it("renders the caption", () => {
    render(<Title title={[{ text: "X" }]} caption="Subtitle" />);
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });

  it("renders the meta on the right cluster", () => {
    render(<Title title={[{ text: "X" }]} meta="12 items" />);
    expect(screen.getByText("12 items")).toBeInTheDocument();
  });

  it("renders action icons", () => {
    render(
      <Title
        title={[{ text: "X" }]}
        actions={[{ icon: "iStar" }, { icon: "iClose" }]}
      />,
    );
    expect(screen.getByTestId("icon-group")).toHaveAttribute("data-count", "2");
  });

  it("renders a suffix pill", () => {
    render(<Title title={[{ text: "X" }]} suffix={{ text: "Beta" } as any} />);
    expect(screen.getByTestId("pill")).toHaveTextContent("Beta");
  });

  it("fires the title item pressable onClick", () => {
    const onClick = vi.fn();
    render(<Title title={[{ text: "X", pressable: { onClick } }]} />);
    fireEvent.click(screen.getByTestId("pressable"));
    expect(onClick).toHaveBeenCalled();
  });

  it("renders a context bar with start and end items", () => {
    render(
      <Title
        title={[{ text: "X" }]}
        context={
          <Title.ContextBar
            start={[{ content: "Left", key: "l" }]}
            end={[{ content: "Right", key: "r" }]}
          />
        }
      />,
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });

  it("renders context items with leading icons", () => {
    render(
      <Title
        title={[{ text: "X" }]}
        context={
          <Title.ContextBar
            start={[{ content: "Left", leadingIcon: "iStar", key: "l" }]}
          />
        }
      />,
    );
    expect(screen.getByTestId("icon-inner")).toHaveAttribute(
      "data-icon",
      "iStar",
    );
  });

  it("forwards a className", () => {
    const { container } = render(
      <Title title={[{ text: "X" }]} className="my-title" />,
    );
    expect(container.querySelector(".my-title")).toBeTruthy();
  });
});
