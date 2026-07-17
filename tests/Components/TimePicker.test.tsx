import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TimePicker from "@/packages/Components/TimePicker/TimePicker";

describe("TimePicker Component", () => {
  it("renders with default props", () => {
    render(<TimePicker title="Time" />);
    expect(screen.getByText("Time")).toBeInTheDocument();
    const inputs = screen.getAllByPlaceholderText("--");
    expect(inputs).toHaveLength(2); // hour, minute
  });

  it("renders with initial value (24h)", () => {
    render(<TimePicker defaultValue="14:30" />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("14");
    expect(inputs[1]).toHaveValue("30");
  });

  it("renders with initial value (12h)", () => {
    render(<TimePicker defaultValue="14:30" use12h />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("02"); // 14 % 12
    expect(inputs[1]).toHaveValue("30");
    const ampm = screen.getByText("PM");
    expect(ampm).toBeInTheDocument();
  });

  it("triggers onChange when hour is changed", () => {
    const onChange = vi.fn();
    render(<TimePicker defaultValue="14:30" onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "15" } });
    expect(onChange).toHaveBeenCalledWith("15:30");
  });

  it("triggers onChange when minute is changed", () => {
    const onChange = vi.fn();
    render(<TimePicker defaultValue="14:30" onChange={onChange} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[1], { target: { value: "45" } });
    expect(onChange).toHaveBeenCalledWith("14:45");
  });

  it("handles showSeconds", () => {
    render(<TimePicker defaultValue="14:30:45" showSeconds />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toHaveValue("14");
    expect(inputs[1]).toHaveValue("30");
    expect(inputs[2]).toHaveValue("45");
  });

  it("handles AM/PM toggle", () => {
    const onChange = vi.fn();
    render(<TimePicker defaultValue="14:30" use12h onChange={onChange} />);
    const ampmButton = screen.getByText("PM").parentElement as HTMLElement;
    fireEvent.click(ampmButton);
    expect(onChange).toHaveBeenCalledWith("02:30");
  });

  it("respects disabled state", () => {
    render(<TimePicker defaultValue="14:30" disabled />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toBeDisabled();
    expect(inputs[1]).toBeDisabled();
  });

  it("respects readOnly state", () => {
    render(<TimePicker defaultValue="14:30" readOnly />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveAttribute("readOnly");
    expect(inputs[1]).toHaveAttribute("readOnly");
  });

  it("handles keyboard navigation for hours", () => {
    const onChange = vi.fn();
    render(<TimePicker defaultValue="14:30" onChange={onChange} />);
    const hourInput = screen.getAllByRole("textbox")[0];
    
    fireEvent.keyDown(hourInput, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith("15:30");
    
    fireEvent.keyDown(hourInput, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith("14:30");
  });

  it("handles keyboard navigation bounds", () => {
    const onChange = vi.fn();
    render(<TimePicker defaultValue="23:30" onChange={onChange} />);
    const hourInput = screen.getAllByRole("textbox")[0];
    
    // Up from 23 should wrap to 00
    fireEvent.keyDown(hourInput, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith("00:30");
  });
});
