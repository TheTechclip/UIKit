import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Card from "../../packages/Components/Card/Card";
import Icon from "../../packages/Components/Icon/Icon";
import Pill from "../../packages/Components/Pill/Pill";
import Text from "../../packages/Components/Text/Text";
import StopParentInteraction from "../../packages/Frameworks/_shared/StopParentInteraction";
import Pressable from "../../packages/Frameworks/Pressable/Pressable";
import View from "../../packages/Frameworks/View/View";

vi.mock("../../packages/Components/Icon/Icon.tsx", () => ({
  default: ({ icon }: { icon?: string }) => (
    <span data-testid="icon" data-icon={icon} />
  ),
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
vi.mock("../../packages/Frameworks/_shared/StopParentInteraction.tsx", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="stop">{children}</div>
  ),
}));
vi.mock("motion/react", () => ({
  animate: () => ({ stop: () => {} }),
  useMotionValue: () => ({ get: () => 0, set: () => {} }),
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

describe("Card (default)", () => {
  it("renders the title and caption", () => {
    render(<Card title="Settings" caption="Manage your account" />);
    const texts = screen.getAllByTestId("text");
    expect(texts.some((t) => t.textContent === "Settings")).toBe(true);
    expect(texts.some((t) => t.textContent === "Manage your account")).toBe(
      true,
    );
  });

  it("renders the leading icon", () => {
    render(<Card title="X" icon={{ icon: "iStar" }} />);
    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon", "iStar");
  });

  it("renders a default arrow icon", () => {
    render(<Card title="X" arrow />);
    expect(screen.getByTestId("icon")).toHaveAttribute(
      "data-icon",
      "iArrowKeyRight",
    );
  });

  it("renders pills from the pill prop", () => {
    render(<Card title="X" pill={[{ text: "New" }, { text: "Hot" }]} />);
    const pills = screen.getAllByTestId("pill");
    expect(pills).toHaveLength(2);
  });

  it("renders customRight content", () => {
    render(
      <Card title="X" customRight={<span data-testid="custom">Y</span>} />,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("fires the pressable onClick", () => {
    const onClick = vi.fn();
    render(<Card title="X" pressable={{ onClick }} />);
    fireEvent.click(screen.getByTestId("pressable"));
    expect(onClick).toHaveBeenCalled();
  });

  it("marks the pressable disabled", () => {
    render(<Card title="X" pressable={{ disabled: true }} />);
    expect(screen.getByTestId("pressable")).toBeDisabled();
  });
});

describe("Card (foldable / accordion)", () => {
  it("renders the header title", () => {
    render(
      <Card title="Details" accordion={{ name: "group", value: "a" }}>
        <span data-testid="body">Body content</span>
      </Card>,
    );
    const texts = screen.getAllByTestId("text");
    expect(texts.some((t) => t.textContent === "Details")).toBe(true);
  });

  it("toggles open state when the header is clicked", () => {
    const onActivatedChange = vi.fn();
    render(
      <Card
        title="Details"
        accordion={{ name: "group", value: "a", onActivatedChange }}
      >
        <span data-testid="body">Body content</span>
      </Card>,
    );
    fireEvent.click(screen.getByTestId("pressable"));
    expect(onActivatedChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when the pressable is disabled", () => {
    const onActivatedChange = vi.fn();
    render(
      <Card
        title="Details"
        accordion={{ name: "group", value: "a", onActivatedChange }}
        pressable={{ disabled: true }}
      >
        <span data-testid="body">Body content</span>
      </Card>,
    );
    fireEvent.click(screen.getByTestId("pressable"));
    expect(onActivatedChange).not.toHaveBeenCalled();
  });

  it("shows the down arrow when collapsed and up arrow when expanded", () => {
    const collapsed = render(
      <Card title="Details" arrow accordion={{ name: "g", value: "a" }}>
        body
      </Card>,
    );
    const collapsedIcon = collapsed
      .getAllByTestId("icon")
      .map((el) => el.getAttribute("data-icon"))
      .find((name) => name?.startsWith("iArrowKey"));
    expect(collapsedIcon).toMatch(/Down/);

    collapsed.unmount();
    const expanded = render(
      <Card
        title="Details"
        arrow
        accordion={{ name: "g", value: "a", defaultActivated: true }}
      >
        body
      </Card>,
    );
    const expandedIcon = expanded
      .getAllByTestId("icon")
      .map((el) => el.getAttribute("data-icon"))
      .find((name) => name?.startsWith("iArrowKey"));
    expect(expandedIcon).toMatch(/Up/);
  });

  it("renders body content inside the foldable", () => {
    render(
      <Card title="Details" accordion={{ name: "g", value: "a" }}>
        <span data-testid="body">Body content</span>
      </Card>,
    );
    expect(screen.getByTestId("body")).toBeInTheDocument();
  });

  it("reflects controlled activated prop", () => {
    const onActivatedChange = vi.fn();
    render(
      <Card
        title="Details"
        accordion={{
          name: "g",
          value: "a",
          activated: true,
          onActivatedChange,
        }}
      >
        body
      </Card>,
    );
    fireEvent.click(screen.getByTestId("pressable"));
    expect(onActivatedChange).toHaveBeenCalledWith(false);
  });
});
