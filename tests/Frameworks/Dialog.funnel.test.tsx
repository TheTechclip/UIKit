import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DialogFunnel from "../../packages/Frameworks/Dialog/contents/Dialog.funnel";

vi.mock("../../packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

describe("DialogFunnel", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <DialogFunnel
        config={
          {
            id: "test",
            steps: ["a"],
            render: { a: () => <span>Step A</span> },
            step: "a",
          } as any
        }
        onClose={() => {}}
        isMobile={false}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
