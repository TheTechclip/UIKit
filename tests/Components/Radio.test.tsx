import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Radio from "@/packages/Components/Radio/Radio";

describe("Radio", () => {
  it("renders an unchecked radio input by default", () => {
    render(<Radio />);
    const input = screen.getByRole("radio") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).not.toBeChecked();
    expect(input).toHaveAttribute("aria-checked", "false");
  });

  it("reflects defaultChecked in uncontrolled mode", () => {
    render(<Radio defaultChecked />);
    expect(screen.getByRole("radio")).toBeChecked();
    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "true");
  });

  it("reflects controlled checked prop", () => {
    render(<Radio checked readOnly />);
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("toggles internal state and fires onChange in uncontrolled mode", () => {
    const onChange = vi.fn();
    render(<Radio onChange={onChange} />);
    const input = screen.getByRole("radio");
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toBeChecked();
  });

  it("does not internally toggle when controlled", () => {
    const onChange = vi.fn();
    render(<Radio checked={false} onChange={onChange} />);
    const input = screen.getByRole("radio");
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).not.toBeChecked();
  });

  it("renders the title text", () => {
    render(<Radio title="Option A" />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  it("marks the input disabled", () => {
    render(<Radio disabled />);
    expect(screen.getByRole("radio")).toBeDisabled();
  });

  it("marks the input readonly", () => {
    render(<Radio readOnly />);
    expect(screen.getByRole("radio")).toHaveAttribute("readonly");
  });

  it("renders an inner dot element for the selected state", () => {
    const { container } = render(<Radio defaultChecked />);
    expect(container.querySelector("div > div")).toBeTruthy();
  });

  it("reverses layout when reversed prop is set", () => {
    const { container } = render(<Radio reversed title="X" />);
    expect(container.querySelector("label")).toBeTruthy();
  });

  it("sets data-disabled attribute when disabled", () => {
    const { container } = render(<Radio disabled />);
    expect(container.querySelector('[data-disabled="true"]')).toBeTruthy();
  });

  it("sets data-readonly attribute when readonly", () => {
    const { container } = render(<Radio readOnly />);
    expect(container.querySelector('[data-readonly="true"]')).toBeTruthy();
  });

  it("syncs checked state across radios sharing a name", () => {
    render(
      <>
        <Radio name="group" value="a" defaultChecked />
        <Radio name="group" value="b" />
      </>,
    );
    const [a, b] = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(a.checked).toBe(true);
    expect(b.checked).toBe(false);
    fireEvent.click(b);
    expect(a.checked).toBe(false);
    expect(b.checked).toBe(true);
  });

  it("passes value through to the input", () => {
    const { container } = render(<Radio name="g" value="x" />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("x");
  });
});
