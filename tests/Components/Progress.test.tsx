import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Progress from "../../packages/Components/Progress/Progress";

describe("Progress", () => {
  it("renders a progressbar role with value bounds", () => {
    render(<Progress value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
  });

  it("clamps the value within min and max", () => {
    render(<Progress value={200} min={0} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("respects a custom min/max range", () => {
    render(<Progress value={5} min={0} max={10} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "10");
    expect(bar).toHaveAttribute("aria-valuenow", "5");
  });

  it("renders a spinner when indeterminate", () => {
    const { container } = render(<Progress indeterminate />);
    expect(container.querySelector("svg, [role]")).toBeTruthy();
  });

  it("sets --progress-percent to the resolved percentage", () => {
    const { container } = render(<Progress value={25} />);
    const track = container.querySelector(
      '[style*="--progress-percent"]',
    ) as HTMLElement;
    expect(track.style.getPropertyValue("--progress-percent")).toBe("25%");
  });

  it("renders the indicator at the resolved percentage", () => {
    const { container } = render(<Progress value={10} />);
    const track = container.querySelector(
      '[style*="--progress-percent"]',
    ) as HTMLElement;
    expect(track.style.getPropertyValue("--progress-percent")).toBe("10%");
  });

  it("is full width via the FullWidth class", () => {
    const { container } = render(<Progress value={10} />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "FullWidth",
    );
  });

  it("forwards a className", () => {
    const { container } = render(<Progress value={10} className="my-prog" />);
    expect(container.querySelector(".my-prog")).toBeTruthy();
  });

  it("applies a circular radius to the track", () => {
    const { container } = render(<Progress value={10} />);
    expect((container.firstChild as HTMLElement).style.borderRadius).toContain(
      "var(--radius-circle)",
    );
  });
});
