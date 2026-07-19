import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DocsLayout from "../../packages/components/Layout/Layout.docs";

vi.mock("../../packages/frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

describe("DocsLayout", () => {
  it("renders children", () => {
    render(
      <DocsLayout>
        <span data-testid="child" />
      </DocsLayout>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
