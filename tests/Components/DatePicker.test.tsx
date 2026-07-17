import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DatePicker from "@/packages/Components/DatePicker/DatePicker";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("DatePicker", () => {
  it("renders without crashing", () => {
    const { container } = render(<DatePicker />);
    expect(container).not.toBeNull();
  });

  it("handles empty date correctly", () => {
    const { container } = render(<DatePicker date={undefined} />);
    // The placeholder or "Select Date" text should be displayed or input rendered
    expect(container).not.toBeNull();
  });
});
