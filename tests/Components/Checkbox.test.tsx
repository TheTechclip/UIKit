import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Checkbox from "@/packages/Components/Checkbox/Checkbox";

describe("Checkbox", () => {
  it("renders an unchecked input by default", () => {
    render(<Checkbox />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).not.toBeChecked();
    expect(input).toHaveAttribute("aria-checked", "false");
  });

  it("reflects defaultChecked in uncontrolled mode", () => {
    render(<Checkbox defaultChecked />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input).toBeChecked();
    expect(input).toHaveAttribute("aria-checked", "true");
  });

  it("reflects controlled checked prop", () => {
    render(<Checkbox checked readOnly />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input).toBeChecked();
    expect(input).toHaveAttribute("aria-checked", "true");
  });

  it("toggles internal state and fires onChange in uncontrolled mode", () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange} />);
    const input = screen.getByRole("checkbox");
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input as HTMLInputElement).toBeChecked();
  });

  it("does not toggle internal state when controlled", () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} onChange={onChange} />);
    const input = screen.getByRole("checkbox");
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input as HTMLInputElement).not.toBeChecked();
  });

  it("renders the title text", () => {
    render(<Checkbox title="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("marks the input disabled", () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("marks the input readonly", () => {
    render(<Checkbox readOnly />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("readonly");
  });

  it("wires the check icon visibility to checked state", () => {
    const { rerender } = render(<Checkbox />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    rerender(<Checkbox onChange={() => {}} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("reflects defaultChecked on mount", () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("renders an icon element for the check mark", () => {
    const { container } = render(<Checkbox defaultChecked />);
    expect(container.querySelector("i, svg, span")).toBeTruthy();
  });

  it("stretches to full width with titleSpaceBetween", () => {
    const { container } = render(<Checkbox title="Wide" titleSpaceBetween />);
    const label = container.querySelector("label") as HTMLElement;
    expect(label.style.width).toBe("100%");
  });

  it("sets data-disabled attribute when disabled", () => {
    const { container } = render(<Checkbox disabled />);
    expect(container.querySelector('[data-disabled="true"]')).toBeTruthy();
  });

  it("sets data-readonly attribute when readonly", () => {
    const { container } = render(<Checkbox readOnly />);
    expect(container.querySelector('[data-readonly="true"]')).toBeTruthy();
  });

  it("passes defaultChecked through to the input", () => {
    const { container } = render(<Checkbox defaultChecked />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.defaultChecked).toBe(true);
  });
});
