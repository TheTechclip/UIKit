import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TimePicker from "@/packages/Components/TimePicker/TimePicker";

vi.mock("@/packages/Frameworks/Pressable/Pressable", () => ({
  default: ({ children, ...rest }: any) => <button type="button" {...rest}>{children}</button>,
}));

vi.mock("@/packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

vi.mock("@/packages/Components/Icon/Icon", () => ({
  default: ({ icon }: { icon?: string }) => <span data-testid="icon">{icon}</span>,
}));

vi.mock("@/packages/Components/Label/Label", () => ({
  default: ({ children, title, ...rest }: any) => <label {...rest}>{title}{children}</label>,
}));

describe("TimePicker", () => {
  it("renders empty, disabled, and read-only fields", () => {
    const { rerender } = render(<TimePicker title="Time" disabled />);
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getAllByRole("textbox")[0]).toBeDisabled();

    rerender(<TimePicker defaultValue="14:30" readOnly />);
    expect(screen.getAllByRole("textbox")[0]).toHaveAttribute("readonly");
  });

  it("parses controlled values and clears them", () => {
    const { rerender } = render(<TimePicker value="27:70:80" showSeconds />);
    let fields = screen.getAllByRole("textbox");
    expect(fields.map((field) => (field as HTMLInputElement).value)).toEqual(["23", "59", "59"]);

    rerender(<TimePicker value="" showSeconds />);
    fields = screen.getAllByRole("textbox");
    expect(fields.map((field) => (field as HTMLInputElement).value)).toEqual(["", "", ""]);
  });

  it("emits edits, normalization, and keyboard wrapping", () => {
    const onChange = vi.fn();
    const onHourOverflow = vi.fn();
    render(<TimePicker defaultValue="23:30:45" showSeconds onChange={onChange} onHourOverflow={onHourOverflow} />);
    const [hour, minute, second] = screen.getAllByRole("textbox");

    fireEvent.change(hour, { target: { value: "27" } });
    expect(onHourOverflow).toHaveBeenCalledWith({ input: 27, normalized: 3 });
    expect(onChange).toHaveBeenLastCalledWith("03:30:45");

    fireEvent.change(minute, { target: { value: "" } });
    expect(onChange).toHaveBeenLastCalledWith("03:00:45");
    fireEvent.change(second, { target: { value: "99" } });
    expect(onChange).toHaveBeenLastCalledWith("03:00:59");

    fireEvent.keyDown(hour, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith("04:00:59");
    fireEvent.keyDown(hour, { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith("03:00:59");
  });

  it("supports 12-hour seconds and AM/PM controls", () => {
    const onChange = vi.fn();
    render(<TimePicker defaultValue="14:30:15" showSeconds use12h onChange={onChange} />);
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("02");
    const ampm = screen.getByRole("button", { name: "PM" });

    fireEvent.click(ampm);
    expect(onChange).toHaveBeenLastCalledWith("02:30:15");
    fireEvent.keyDown(ampm, { key: "a" });
    expect(onChange).toHaveBeenLastCalledWith("02:30:15");
    fireEvent.keyDown(ampm, { key: "Enter" });
    expect(onChange).toHaveBeenCalled();
    const second = screen.getAllByRole("textbox")[2];
    fireEvent.focus(second);
    fireEvent.click(second);
    fireEvent.keyDown(second, { key: "ArrowUp" });
    fireEvent.keyDown(second, { key: "ArrowRight" });
    expect(ampm).toHaveFocus();
    fireEvent.focus(ampm);
    fireEvent.keyDown(ampm, { key: "ArrowLeft" });
    fireEvent.click(screen.getAllByRole("textbox")[0]);
    fireEvent.click(screen.getAllByRole("textbox")[1]);
  });

  it("handles keyboard navigation, buffered numbers, and incomplete values", () => {
    const onChange = vi.fn();
    render(<TimePicker defaultValue="00:00" onChange={onChange} />);
    const [hour, minute] = screen.getAllByRole("textbox");
    fireEvent.keyDown(hour, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith("01:00");
    fireEvent.keyDown(hour, { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith("00:00");
    fireEvent.keyDown(hour, { key: "1" });
    expect(onChange).toHaveBeenLastCalledWith("01:00");
    fireEvent.keyDown(hour, { key: "2" });
    expect(onChange).toHaveBeenLastCalledWith("12:00");
    fireEvent.keyDown(hour, { key: "ArrowRight" });
    expect(minute).toHaveFocus();
    fireEvent.keyDown(minute, { key: "ArrowLeft" });
    expect(hour).toHaveFocus();
    fireEvent.keyDown(minute, { key: "x" });
    fireEvent.keyDown(minute, { key: "Tab" });
  });
});
