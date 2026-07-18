import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import HScrollView from "../../packages/Frameworks/View/HScrollView/HScrollView";

beforeAll(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

vi.mock("../../packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

vi.mock("../../packages/Frameworks/EdgeEffect/EdgeEffect", () => ({
  default: () => null,
}));

describe("HScrollView", () => {
  it("renders children", () => {
    render(
      <HScrollView>
        <span data-testid="child">item</span>
      </HScrollView>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders without gap", () => {
    const { container } = render(
      <HScrollView>
        <span>A</span>
        <span>B</span>
      </HScrollView>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders without edge effect", () => {
    const { container } = render(
      <HScrollView showEdgeEffect={false}>
        <span>item</span>
      </HScrollView>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
