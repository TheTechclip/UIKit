import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import DatePickerCore from "../../packages/Components/DatePicker/DatePicker.core";

const today = new Date(2024, 1, 15);
const base = {
  year: 2024,
  month: 2,
  day: 29,
  startYear: 2024,
  startMonth: 2,
  startDay: 29,
  endYear: 2024,
  endMonth: 3,
  endDay: 1,
  today,
  onDateChange: vi.fn(),
};

describe("DatePickerCore", () => {
  it("edits and navigates single-date segments", () => {
    const onDateChange = vi.fn();
    const onFocusPrev = vi.fn();
    const onFocusNext = vi.fn();
    render(
      <DatePickerCore
        {...base}
        mode="single"
        onDateChange={onDateChange}
        onFocusPrev={onFocusPrev}
        onFocusNext={onFocusNext}
      />,
    );
    const [year, month, day] = screen.getAllByRole("textbox");
    expect(year).toHaveValue("2024");
    expect(month).toHaveValue("2");
    expect(day).toHaveValue("29");

    fireEvent.change(year, { target: { value: "999" } });
    expect(onDateChange).toHaveBeenLastCalledWith("year", 999);
    fireEvent.change(year, { target: { value: "99999" } });
    expect(onDateChange).toHaveBeenLastCalledWith("year", 9999);
    fireEvent.change(month, { target: { value: "19" } });
    expect(onDateChange).toHaveBeenLastCalledWith("month", 12);
    fireEvent.change(day, { target: { value: "99" } });
    expect(onDateChange).toHaveBeenLastCalledWith("day", 29);
    fireEvent.change(day, { target: { value: "" } });
    expect(onDateChange).toHaveBeenLastCalledWith("day", null);

    fireEvent.keyDown(year, { key: "ArrowLeft" });
    expect(onFocusPrev).toHaveBeenCalled();
    fireEvent.keyDown(day, { key: "ArrowRight" });
    expect(onFocusNext).toHaveBeenCalled();
    fireEvent.keyDown(month, { key: "ArrowUp" });
    expect(onDateChange).toHaveBeenLastCalledWith("month", 3);
    fireEvent.keyDown(month, { key: "ArrowDown" });
    expect(onDateChange).toHaveBeenLastCalledWith("month", 1);
    for (const field of [year, month, day]) {
      fireEvent.focus(field);
      fireEvent.click(field);
      fireEvent.blur(field);
    }
    fireEvent.keyDown(day, { key: "ArrowUp" });
    fireEvent.keyDown(day, { key: "ArrowDown" });
    fireEvent.keyDown(day, { key: "x" });
    fireEvent.keyDown(day, { key: "Tab" });
  });

  it("renders range fields, honors read-only state, and commits buffered input", () => {
    const onDateChange = vi.fn();
    render(
      <DatePickerCore
        {...base}
        mode="range"
        readOnly
        onDateChange={onDateChange}
      />,
    );
    const fields = screen.getAllByRole("textbox");
    expect(fields).toHaveLength(6);
    expect(fields.every((field) => (field as HTMLInputElement).readOnly)).toBe(
      true,
    );

    const { rerender } = render(
      <DatePickerCore {...base} mode="range" onDateChange={onDateChange} />,
    );
    const editable = screen.getAllByRole("textbox").slice(-6);
    fireEvent.keyDown(editable[0], { key: "2" });
    fireEvent.keyDown(editable[0], { key: "0" });
    fireEvent.keyDown(editable[0], { key: "2" });
    fireEvent.keyDown(editable[0], { key: "5" });
    expect(onDateChange).toHaveBeenLastCalledWith("startYear", 2025);
    fireEvent.keyDown(editable[5], { key: "ArrowDown" });
    expect(onDateChange).toHaveBeenLastCalledWith("endDay", 31);
    fireEvent.keyDown(editable[3], { key: "Backspace" });
    for (const field of editable) {
      fireEvent.focus(field);
      fireEvent.click(field);
      fireEvent.blur(field);
    }
    fireEvent.change(editable[0], { target: { value: "2025" } });
    expect(onDateChange).toHaveBeenLastCalledWith("startYear", 2025);
    fireEvent.change(editable[1], { target: { value: "15" } });
    expect(onDateChange).toHaveBeenLastCalledWith("startMonth", 12);
    fireEvent.keyDown(editable[1], { key: "ArrowUp" });
    fireEvent.change(editable[2], { target: { value: "32" } });
    expect(onDateChange).toHaveBeenLastCalledWith("startDay", 29);
    fireEvent.keyDown(editable[2], { key: "2" });
    fireEvent.blur(editable[2]);
    fireEvent.change(editable[3], { target: { value: "2025" } });
    expect(onDateChange).toHaveBeenLastCalledWith("endYear", 2025);
    fireEvent.change(editable[4], { target: { value: "15" } });
    expect(onDateChange).toHaveBeenLastCalledWith("endMonth", 12);
    fireEvent.change(editable[5], { target: { value: "32" } });
    expect(onDateChange).toHaveBeenLastCalledWith("endDay", 31);
    fireEvent.keyDown(editable[4], { key: "ArrowUp" });
    rerender(
      <DatePickerCore
        {...base}
        mode="range"
        disabled
        onDateChange={onDateChange}
      />,
    );
    expect(screen.getAllByRole("textbox").slice(-6)[0]).toBeDisabled();
  });

  it("exposes first and last focus for both modes", () => {
    const singleRef = createRef<{
      focusFirst: () => void;
      focusLast: () => void;
    }>();
    const { unmount } = render(
      <DatePickerCore ref={singleRef} {...base} mode="single" />,
    );
    singleRef.current?.focusFirst();
    expect(screen.getAllByRole("textbox")[0]).toHaveFocus();
    singleRef.current?.focusLast();
    expect(screen.getAllByRole("textbox")[2]).toHaveFocus();
    unmount();
    const rangeRef = createRef<{
      focusFirst: () => void;
      focusLast: () => void;
    }>();
    render(<DatePickerCore ref={rangeRef} {...base} mode="range" />);
    rangeRef.current?.focusFirst();
    expect(screen.getAllByRole("textbox")[0]).toHaveFocus();
    rangeRef.current?.focusLast();
    expect(screen.getAllByRole("textbox")[5]).toHaveFocus();
  });

  it("moves back from an empty range field", () => {
    const onFocusPrev = vi.fn();
    render(
      <DatePickerCore
        {...base}
        mode="range"
        startYear={null}
        onFocusPrev={onFocusPrev}
      />,
    );
    const first = screen.getAllByRole("textbox")[0];
    fireEvent.keyDown(first, { key: "Backspace" });
    expect(onFocusPrev).toHaveBeenCalled();
  });
});
