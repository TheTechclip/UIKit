import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../packages/frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

vi.mock("../../packages/components/Icon/Icon", () => ({
  default: () => null,
}));

vi.mock("../../packages/frameworks/Pressable/Pressable", () => ({
  default: ({ children, onClick, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

describe("Calendar", () => {
  it("renders days grid", async () => {
    const { Calendar } = await import(
      "../../packages/components/DatePicker/DatePicker.calendar"
    );
    const baseDate = new Date(2026, 6, 17);
    const days = [new Date(2026, 6, 1), new Date(2026, 6, 2)];
    const locale = {
      weekdays: ["S", "M", "T", "W", "T", "F", "S"],
      title: () => "July 2026",
    };
    const { container } = render(
      <Calendar
        currentLocale={locale}
        viewYear={2026}
        viewMonth={6}
        prevMonth={() => {}}
        nextMonth={() => {}}
        days={days}
        mode="single"
        today={baseDate}
        setHoverDay={() => {}}
        handleDayClick={() => {}}
        isInRange={() => false}
        isRangeStart={() => false}
        isRangeEnd={() => false}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
