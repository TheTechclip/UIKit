import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DialogImageSlide } from "../../packages/frameworks/View/ImageView/Dialog/ImageDialog.slide";

vi.mock("../../packages/frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

describe("DialogImageSlide", () => {
  it("renders image", () => {
    const { container } = render(
      <DialogImageSlide
        item={{ id: 1, src: "/a.jpg", alt: "A" }}
        index={0}
        initialIndex={0}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
