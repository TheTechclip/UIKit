import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Toaster from "../../packages/Frameworks/Toaster/Toaster.boot";

vi.mock("sonner", () => ({
  Toaster: ({ theme, toastOptions }: any) => (
    <div data-testid="sonner-toaster" data-theme={theme} />
  ),
  toast: { success: () => {}, error: () => {}, info: () => {}, warning: () => {}, loading: () => {} },
}));

vi.mock("../../packages/Components/Icon/Icon.tsx", () => ({
  default: () => <span data-testid="icon" />,
}));

describe("Toaster", () => {
  it("renders the sonner toaster", () => {
    const { container } = render(<Toaster />);
    expect(container.querySelector('[data-testid="sonner-toaster"]')).toBeInTheDocument();
  });

  it("forwards the theme prop", () => {
    render(<Toaster theme="dark" />);
    expect(document.querySelector('[data-testid="sonner-toaster"]')).toHaveAttribute("data-theme", "dark");
  });

  it("exports the toast function", async () => {
    const { toast } = await import("../../packages/Frameworks/Toaster/Toaster.boot");
    expect(typeof toast.success).toBe("function");
  });
});
