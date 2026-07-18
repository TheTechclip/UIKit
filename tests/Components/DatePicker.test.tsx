import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DatePicker from "../../packages/Components/DatePicker/DatePicker";

describe("DatePicker", () => {
  it("renders without crashing", () => {
    const { container } = render(<DatePicker />);
    expect(container).not.toBeNull();
  });

  it("handles empty date correctly", () => {
    const { container } = render(<DatePicker value={undefined} />);
    // The placeholder or "Select Date" text should be displayed or input rendered
    expect(container).not.toBeNull();
  });

  it("emits a complete single date entered through segmented fields", () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue="2024-05-10" onChange={onChange} />);
    const [, , day] = screen.getAllByRole("textbox");

    fireEvent.change(day, { target: { value: "11" } });

    expect(onChange).toHaveBeenLastCalledWith("2024-05-11");
  });

  it("emits and normalizes a range entered in reverse order", () => {
    const onRangeChange = vi.fn();
    render(
      <DatePicker
        defaultEndDate="2024-05-20"
        defaultStartDate="2024-05-10"
        mode="range"
        onRangeChange={onRangeChange}
      />,
    );
    const inputs = screen.getAllByRole("textbox");

    fireEvent.change(inputs[5], { target: { value: "05" } });

    expect(onRangeChange).toHaveBeenLastCalledWith("2024-05-05", "2024-05-10");
  });
});
