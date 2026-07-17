import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Pagination from "@/packages/Components/Pagination/Pagination";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock("@/i18n/shared", () => ({
  Word: () => ({
    UIKit: {
      ui: {
        previous: "Previous",
        next: "Next",
        pagination: "Pagination",
        goToPage: "Go to page",
        currentPage: "Current page {value}",
        goToPageItem: "Go to page {value}",
      },
    },
  }),
}));

describe("Pagination Component", () => {
  it("renders correctly with initial page and total", () => {
    render(<Pagination page={2} total={10} />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("2");
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("handles next page click", () => {
    const onChange = vi.fn();
    render(<Pagination page={2} total={10} onChange={onChange} />);
    const nextBtn = screen.getByLabelText("Next");
    fireEvent.click(nextBtn);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("handles previous page click", () => {
    const onChange = vi.fn();
    render(<Pagination page={2} total={10} onChange={onChange} />);
    const prevBtn = screen.getByLabelText("Previous");
    fireEvent.click(prevBtn);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("disables previous button on first page", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} total={10} onChange={onChange} />);
    const prevBtn = screen.getByLabelText("Previous");
    fireEvent.click(prevBtn);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables next button on last page", () => {
    const onChange = vi.fn();
    render(<Pagination page={10} total={10} onChange={onChange} />);
    const nextBtn = screen.getByLabelText("Next");
    fireEvent.click(nextBtn);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("allows changing page via input", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} total={10} onChange={onChange} />);

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(5);
  });
});
