import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Skeleton from "../../packages/Components/Skeleton/Skeleton";

describe("Skeleton", () => {
  it("renders a single slot by default", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelectorAll('[style*="color-mix"]').length).toBe(1);
  });

  it("renders the requested number of slots", () => {
    const { container } = render(<Skeleton count={3} />);
    expect(container.querySelectorAll('[style*="color-mix"]').length).toBe(3);
  });

  it("uses full width by default", () => {
    const { container } = render(<Skeleton />);
    expect((container.firstChild as HTMLElement).style.width).toBe("100%");
  });

  it("applies a custom height", () => {
    const { container } = render(<Skeleton height={40} />);
    expect((container.firstChild as HTMLElement).style.height).toBe("4rem");
  });

  it("derives height from the type prop", () => {
    const { container } = render(<Skeleton type="Body" />);
    expect((container.firstChild as HTMLElement).style.height).toBe(
      "var(--font-body-size)",
    );
  });

  it("forwards a className", () => {
    const { container } = render(<Skeleton className="my-skel" />);
    expect(container.querySelector(".my-skel")).toBeTruthy();
  });

  it("sets data-color-mode when provided", () => {
    const { container } = render(<Skeleton data-color-mode="dark" />);
    expect(
      container.querySelector('[data-color-mode="dark"]'),
    ).toBeTruthy();
  });
});
