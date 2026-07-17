import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Squircle from "@/packages/Frameworks/Squircle/Squircle";

vi.mock("figma-squircle", () => ({
  getSvgPath: () => "M0 0 L100 0 L100 100 L0 100 Z",
}));
vi.mock("motion/react", () => ({
  motion: { div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>, a: ({ children, ...rest }: any) => <a {...rest}>{children}</a>, button: ({ children, ...rest }: any) => <button {...rest}>{children}</button> },
}));

describe("Squircle", () => {
  it("renders children as a div", () => {
    const { container } = render(<Squircle>content</Squircle>);
    expect(container.textContent).toBe("content");
  });

  it("renders as a different component when as prop is set", () => {
    const { container } = render(<Squircle as="button">click</Squircle>);
    expect(container.querySelector("button")).toBeInTheDocument();
  });

  it("sets data-squircle attribute with the radius value", () => {
    const { container } = render(<Squircle radius="Regular">x</Squircle>);
    expect(container.querySelector("[data-squircle]")).toBeInTheDocument();
  });

  it("applies a clip path style from getSvgPath when the element has size", () => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 100,
    });
    const { container } = render(<Squircle radius="Bold">x</Squircle>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--squircle-clip")).toContain("M0 0");
  });
});
