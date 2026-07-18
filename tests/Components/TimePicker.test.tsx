import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TimePicker from "../../packages/Components/TimePicker/TimePicker";

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

  it("normalizes overflow, clamps numeric input, and advances through segments", () => {
    const onChange = vi.fn();
    const onHourOverflow = vi.fn();
    render(
      <TimePicker
        defaultValue="01:02:03"
        onChange={onChange}
        onHourOverflow={onHourOverflow}
        showSeconds
      />,
    );
    const [hour, minute, second] = screen.getAllByRole("textbox");

    fireEvent.change(hour, { target: { value: "27" } });
    expect(onHourOverflow).toHaveBeenCalledWith({ input: 27, normalized: 3 });
    expect(onChange).toHaveBeenLastCalledWith("03:02:03");
    expect(minute).toHaveFocus();
    fireEvent.change(minute, { target: { value: "99" } });
    expect(onChange).toHaveBeenLastCalledWith("03:59:03");
    expect(second).toHaveFocus();
    fireEvent.change(second, { target: { value: "" } });
    expect(onChange).toHaveBeenLastCalledWith("03:59:00");
  });

  it("supports segment arrows, digit buffering, and 12-hour keyboard controls", () => {
    const onChange = vi.fn();
    render(
      <TimePicker
        defaultValue="13:30:45"
        onChange={onChange}
        showSeconds
        use12h
      />,
    );
    const [hour, minute, second] = screen.getAllByRole("textbox");
    const ampm = screen.getByRole("button", { name: "PM" });

    fireEvent.keyDown(hour, { key: "ArrowRight" });
    expect(minute).toHaveFocus();
    fireEvent.keyDown(minute, { key: "ArrowLeft" });
    expect(hour).toHaveFocus();
    fireEvent.keyDown(hour, { key: "ArrowRight" });
    fireEvent.keyDown(minute, { key: "ArrowRight" });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: "ArrowRight" });
    expect(ampm).toHaveFocus();
    fireEvent.keyDown(ampm, { key: "a" });
    expect(onChange).toHaveBeenLastCalledWith("01:30:45");
    fireEvent.keyDown(ampm, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith("13:30:45");
    fireEvent.keyDown(ampm, { key: "ArrowLeft" });
    expect(second).toHaveFocus();
    fireEvent.keyDown(hour, { key: "0" });
    fireEvent.keyDown(hour, { key: "9" });
    expect(onChange).toHaveBeenLastCalledWith("21:30:45");
  });

  it("synchronizes controlled values, including clearing every segment", () => {
    const { rerender } = render(
      <TimePicker value="23:59" onChange={vi.fn()} />,
    );
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("23");

    rerender(<TimePicker value="" onChange={vi.fn()} />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("");
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("");

    rerender(<TimePicker value="00:01" onChange={vi.fn()} />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("00");
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("01");
  });

  it("selects focused fields and ignores non-numeric and tab keys", () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    const onChange = vi.fn();
    render(
      <TimePicker
        defaultValue="10:20:30"
        onChange={onChange}
        showSeconds
        use12h
      />,
    );
    const [hour, minute, second] = screen.getAllByRole("textbox");
    const ampm = screen.getByRole("button", { name: "AM" });
    const select = vi.fn();
    Object.defineProperty(hour, "select", {
      configurable: true,
      value: select,
    });

    fireEvent.focus(hour);
    fireEvent.click(hour);
    fireEvent.focus(minute);
    fireEvent.click(minute);
    fireEvent.focus(second);
    fireEvent.click(second);
    fireEvent.focus(ampm);
    fireEvent.keyDown(hour, { key: "Tab" });
    fireEvent.keyDown(minute, { key: "x" });
    fireEvent.keyDown(ampm, { key: "Tab" });

    expect(select).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});
