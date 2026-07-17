import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ToasterBootstrap, {
  toast,
} from "@/packages/Frameworks/Toaster/Toaster.boot";

vi.mock("sonner", () => ({
  Toaster: ({ theme, toastOptions }: any) => (
    <div data-testid="sonner-toaster" data-theme={theme} />
  ),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    custom: vi.fn(),
  },
}));

describe("ToasterBootstrap", () => {
  it("renders toaster with default theme", () => {
    render(<ToasterBootstrap />);
    const toaster = screen.getByTestId("sonner-toaster");
    expect(toaster).toBeInTheDocument();
  });

  it("renders with custom theme", () => {
    render(<ToasterBootstrap theme="dark" />);
    const toaster = screen.getByTestId("sonner-toaster");
    expect(toaster).toHaveAttribute("data-theme", "dark");
  });
});

describe("toast", () => {
  it("has standard methods", () => {
    expect(toast).toBeDefined();
    expect(typeof toast.success).toBe("function");
    expect(typeof toast.error).toBe("function");
  });
});
