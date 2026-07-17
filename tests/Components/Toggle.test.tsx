import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Toggle from "@/packages/Components/Toggle/Toggle";
import Spinner from "@/packages/Components/Spinner/Spinner";
import Text from "@/packages/Components/Text/Text";
import View from "@/packages/Frameworks/View/View";

vi.mock("@/packages/Components/Spinner/Spinner", () => ({
  default: () => <span data-testid="spinner" />,
}));

vi.mock("@/packages/Components/Text/Text", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <span data-testid="text">{children}</span>
  ),
}));

vi.mock("@/packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: { children?: React.ReactNode; [k: string]: unknown }) => (
    <div data-testid="view" {...rest}>
      {children}
    </div>
  ),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({
      children,
      onClick,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
      onDragStart,
      onDrag,
      onDragEnd,
      drag,
      dragConstraints,
      ...rest
    }: any) => (
      <div
        data-testid="knob"
        data-drag={drag ? "true" : undefined}
        data-drag-constraints={JSON.stringify(dragConstraints)}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        {...rest}
      >
        {children}
      </div>
    ),
  },
}));

describe("Toggle", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders a switch role input unchecked by default", () => {
    render(<Toggle />);
    const input = screen.getByRole("switch") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).not.toBeChecked();
    expect(input).toHaveAttribute("aria-checked", "false");
  });

  it("reflects defaultChecked in uncontrolled mode", () => {
    render(<Toggle defaultChecked />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("reflects controlled checked prop", () => {
    render(<Toggle checked readOnly />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("toggles and fires onChange on click in uncontrolled mode", () => {
    const onChange = vi.fn();
    const { container } = render(<Toggle onChange={onChange} />);
    const track = container.querySelector("label > div") as HTMLElement;
    fireEvent.click(track);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("does not toggle internally when controlled", () => {
    const onChange = vi.fn();
    const { container } = render(<Toggle checked={false} onChange={onChange} />);
    const track = container.querySelector("label > div") as HTMLElement;
    fireEvent.click(track);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("toggles via Enter key", () => {
    const onChange = vi.fn();
    render(<Toggle onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("switch"), { key: "Enter" });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("toggles via Space key", () => {
    const onChange = vi.fn();
    render(<Toggle onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("switch"), { key: " " });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("does not toggle when disabled", () => {
    const onChange = vi.fn();
    render(<Toggle disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    fireEvent.keyDown(screen.getByRole("switch"), { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("does not toggle when readonly", () => {
    const onChange = vi.fn();
    render(<Toggle readOnly onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not toggle when loading", () => {
    const onChange = vi.fn();
    render(<Toggle loading onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders the title text", () => {
    render(<Toggle title="Notifications" />);
    expect(screen.getByTestId("text")).toHaveTextContent("Notifications");
  });

  it("renders a spinner when loading", () => {
    render(<Toggle loading />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("sets data-checked on the track when checked", () => {
    render(<Toggle defaultChecked />);
    const track = screen.getByTestId("view");
    expect(track).toHaveAttribute("data-checked");
  });

  it("sets data-disabled on the wrapper when disabled", () => {
    render(<Toggle disabled />);
    expect(screen.getByTestId("view").parentElement).toHaveAttribute(
      "data-disabled",
      "true",
    );
  });

  it("stretches to full width with titleSpaceBetween", () => {
    render(<Toggle title="Wide" titleSpaceBetween />);
    const wrapper = screen.getByTestId("view").parentElement as HTMLElement;
    expect(wrapper).toHaveStyle({ width: "100%" });
  });

  it("renders a draggable knob", () => {
    render(<Toggle />);
    expect(screen.getByTestId("knob")).toHaveAttribute("data-drag", "true");
  });
});
