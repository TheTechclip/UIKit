import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Spinner from "../../packages/components/Spinner/Spinner";

describe("Spinner", () => {
  it("renders a wheel spinner (progressbar) by default", () => {
    render(<Spinner />);
    expect(
      screen.getByRole("progressbar", { hidden: true }),
    ).toBeInTheDocument();
  });

  it("renders an svg for the material type", () => {
    const { container } = render(<Spinner type="material" />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelector("circle")).toBeTruthy();
  });

  it("renders an svg with segments for the apple type", () => {
    const { container } = render(<Spinner type="apple" />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelectorAll("line").length).toBe(12);
  });

  it("is aria-hidden by default", () => {
    render(<Spinner />);
    expect(screen.getByRole("progressbar", { hidden: true })).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("exposes an accessible label when provided", () => {
    render(<Spinner aria-label="Loading" />);
    expect(screen.getByRole("progressbar", { hidden: true })).toHaveAttribute(
      "aria-label",
      "Loading",
    );
  });

  it("uses a custom role when provided", () => {
    const { container } = render(<Spinner role="status" aria-label="X" />);
    expect(container.querySelector('[role="status"]')).toBeTruthy();
  });

  it("applies a custom size", () => {
    const { container } = render(<Spinner size={32} />);
    expect(
      (container.firstChild as HTMLElement).style.getPropertyValue(
        "--spinner-size",
      ),
    ).toBeTruthy();
  });

  it("forwards a className", () => {
    const { container } = render(<Spinner className="my-spin" />);
    expect(container.querySelector(".my-spin")).toBeTruthy();
  });

  it("sets data-color-mode when provided", () => {
    const { container } = render(<Spinner data-color-mode="dark" />);
    expect(container.querySelector('[data-color-mode="dark"]')).toBeTruthy();
  });
});
