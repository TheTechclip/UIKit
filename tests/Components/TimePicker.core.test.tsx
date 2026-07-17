import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import TimePickerCore from "@/packages/Components/TimePicker/TimePicker.core";

vi.mock("@/packages/Frameworks/Pressable/Pressable", () => ({
  default: ({ children, ...rest }: any) => <button type="button" {...rest}>{children}</button>,
}));
vi.mock("@/packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

describe("TimePickerCore", () => {
  const props = { hour: 23, minute: 30, second: 45, ampm: "PM" as const, onTimeChange: vi.fn() };

  it("changes each numeric segment with bounds and arrow keys", () => {
    const onTimeChange = vi.fn();
    const onHourOverflow = vi.fn();
    render(<TimePickerCore {...props} showSeconds onTimeChange={onTimeChange} onHourOverflow={onHourOverflow} />);
    const [hour, minute, second] = screen.getAllByRole("textbox");
    fireEvent.change(hour, { target: { value: "27" } });
    expect(onHourOverflow).toHaveBeenCalledWith({ input: 27, normalized: 3 });
    expect(onTimeChange).toHaveBeenLastCalledWith(3, 30, 45, "PM");
    fireEvent.change(minute, { target: { value: "" } });
    expect(onTimeChange).toHaveBeenLastCalledWith(23, 0, 45, "PM");
    fireEvent.change(second, { target: { value: "99" } });
    expect(onTimeChange).toHaveBeenLastCalledWith(23, 30, 59, "PM");
    fireEvent.keyDown(hour, { key: "ArrowUp" });
    expect(onTimeChange).toHaveBeenLastCalledWith(0, 30, 45, "PM");
    fireEvent.keyDown(hour, { key: "ArrowDown" });
    expect(onTimeChange).toHaveBeenLastCalledWith(22, 30, 45, "PM");
  });

  it("navigates, buffers digits, and supports 12-hour AM/PM", () => {
    const onTimeChange = vi.fn();
    const onFocusPrev = vi.fn();
    const onFocusNext = vi.fn();
    render(<TimePickerCore {...props} hour={12} use12h showSeconds onTimeChange={onTimeChange} onFocusPrev={onFocusPrev} onFocusNext={onFocusNext} />);
    const [hour, minute, second] = screen.getAllByRole("textbox");
    const ampm = screen.getByRole("button", { name: "PM" });
    expect(hour).toHaveValue("12");
    fireEvent.keyDown(hour, { key: "ArrowLeft" });
    expect(onFocusPrev).toHaveBeenCalled();
    fireEvent.keyDown(ampm, { key: "ArrowRight" });
    expect(onFocusNext).toHaveBeenCalled();
    fireEvent.keyDown(minute, { key: "5" });
    fireEvent.blur(minute);
    expect(onTimeChange).toHaveBeenLastCalledWith(12, 5, 45, "PM");
    fireEvent.keyDown(second, { key: "x" });
    fireEvent.keyDown(ampm, { key: "a" });
    expect(onTimeChange).toHaveBeenLastCalledWith(12, 30, 45, "AM");
    fireEvent.keyDown(ampm, { key: "Enter" });
    expect(onTimeChange).toHaveBeenLastCalledWith(12, 30, 45, "AM");
  });

  it("exercises focus APIs, empty navigation, and AM/PM mouse and keyboard controls", () => {
    const onTimeChange = vi.fn();
    const onFocusPrev = vi.fn();
    const onFocusNext = vi.fn();
    const ref = createRef<{ focusFirst: () => void; focusLast: () => void }>();
    render(
      <TimePickerCore
        ref={ref}
        hour={null}
        minute={null}
        second={null}
        ampm="AM"
        use12h
        showSeconds
        onTimeChange={onTimeChange}
        onFocusPrev={onFocusPrev}
        onFocusNext={onFocusNext}
      />,
    );
    const [hour, minute, second] = screen.getAllByRole("textbox");
    const ampm = screen.getByRole("button", { name: "AM" });
    ref.current?.focusFirst();
    expect(hour).toHaveFocus();
    ref.current?.focusLast();
    expect(ampm).toHaveFocus();
    fireEvent.keyDown(hour, { key: "Backspace" });
    expect(onFocusPrev).toHaveBeenCalled();
    fireEvent.keyDown(second, { key: "ArrowRight" });
    expect(ampm).toHaveFocus();
    fireEvent.keyDown(ampm, { key: "ArrowLeft" });
    expect(second).toHaveFocus();
    fireEvent.keyDown(ampm, { key: "ArrowUp" });
    expect(onTimeChange).toHaveBeenLastCalledWith(null, null, null, "PM");
    fireEvent.click(ampm);
    expect(onTimeChange).toHaveBeenLastCalledWith(null, null, null, "PM");
    fireEvent.keyDown(minute, { key: "Tab" });
    fireEvent.keyDown(minute, { key: "0" });
    fireEvent.keyDown(minute, { key: "5" });
    expect(onTimeChange).toHaveBeenLastCalledWith(null, 5, null, "AM");
    fireEvent.focus(hour);
    fireEvent.click(minute);
    fireEvent.focus(second);
    fireEvent.click(second);
    fireEvent.blur(second);
    fireEvent.focus(ampm);
  });

  it("does not activate disabled controls", () => {
    const onTimeChange = vi.fn();
    render(<TimePickerCore {...props} use12h disabled onTimeChange={onTimeChange} />);
    const [hour] = screen.getAllByRole("textbox");
    expect(hour).toBeDisabled();
    expect(screen.getByRole("button", { name: "PM" })).toBeDisabled();
  });

  it("focuses the last visible numeric field without AM/PM", () => {
    const secondsRef = createRef<{ focusLast: () => void }>();
    const minutesRef = createRef<{ focusLast: () => void }>();
    const { unmount } = render(<TimePickerCore ref={secondsRef} {...props} showSeconds />);
    secondsRef.current?.focusLast();
    expect(screen.getAllByRole("textbox")[2]).toHaveFocus();
    fireEvent.click(screen.getAllByRole("textbox")[0]);
    unmount();
    render(<TimePickerCore ref={minutesRef} {...props} />);
    minutesRef.current?.focusLast();
    expect(screen.getAllByRole("textbox")[1]).toHaveFocus();
  });

  it("handles every numeric segment and non-moving key paths", () => {
    const onTimeChange = vi.fn();
    render(<TimePickerCore hour={1} minute={1} second={1} ampm="AM" showSeconds onTimeChange={onTimeChange} />);
    const [hour, minute, second] = screen.getAllByRole("textbox");
    fireEvent.change(hour, { target: { value: "" } });
    expect(onTimeChange).toHaveBeenLastCalledWith(0, 1, 1, "AM");
    fireEvent.change(second, { target: { value: "" } });
    expect(onTimeChange).toHaveBeenLastCalledWith(1, 1, 0, "AM");
    fireEvent.keyDown(minute, { key: "ArrowUp" });
    expect(onTimeChange).toHaveBeenLastCalledWith(1, 2, 1, "AM");
    fireEvent.keyDown(second, { key: "ArrowDown" });
    expect(onTimeChange).toHaveBeenLastCalledWith(1, 1, 0, "AM");
    fireEvent.keyDown(hour, { key: "Backspace" });
    fireEvent.keyDown(hour, { key: "Tab" });
  });
});
