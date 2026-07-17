import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Divider from "../../packages/Components/Divider/Divider";

describe("Divider", () => {
  it("renders an hr element", () => {
    render(<Divider />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("defaults to a horizontal orientation", () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector("hr") as HTMLElement;
    expect(hr).toHaveStyle({ width: "100%", height: ".1rem" });
  });

  it("renders a vertical divider when vertical is set", () => {
    render(<Divider vertical />);
    const hr = screen.getByRole("separator");
    expect(hr).toHaveAttribute("aria-orientation", "vertical");
    expect(hr).toHaveStyle({ width: ".15rem" });
  });

  it("applies a gradient background when gradient is set", () => {
    const { container } = render(<Divider gradient />);
    const hr = container.querySelector("hr") as HTMLElement;
    expect(hr.style.background).toContain("linear-gradient");
  });

  it("applies vertical margin from marginVertical", () => {
    const { container } = render(<Divider marginVertical={8} />);
    const hr = container.querySelector("hr") as HTMLElement;
    expect(hr.style.marginTop).toBeTruthy();
  });

  it("applies horizontal margin from marginHorizontal", () => {
    const { container } = render(<Divider marginHorizontal={12} />);
    const hr = container.querySelector("hr") as HTMLElement;
    expect(hr.style.marginLeft).toBeTruthy();
  });

  it("applies a unified margin from margin", () => {
    const { container } = render(<Divider margin={4} />);
    const hr = container.querySelector("hr") as HTMLElement;
    expect(hr.style.marginTop).toBeTruthy();
    expect(hr.style.marginRight).toBeTruthy();
  });

  it("forwards a className", () => {
    const { container } = render(<Divider className="my-divider" />);
    expect(container.querySelector(".my-divider")).toBeTruthy();
  });

  it("sets data-color-mode when provided", () => {
    const { container } = render(<Divider data-color-mode="dark" />);
    expect(container.querySelector('[data-color-mode="dark"]')).toBeTruthy();
  });

  it("merges inline style overrides", () => {
    const { container } = render(<Divider style={{ opacity: 0.5 }} />);
    expect((container.querySelector("hr") as HTMLElement).style.opacity).toBe(
      "0.5",
    );
  });
});
