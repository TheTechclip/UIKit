import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ImageView from "../../packages/frameworks/View/ImageView/Image";
import { resolveOverlay } from "../../packages/frameworks/View/ImageView/Image.resolve";

vi.mock("../../packages/frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

vi.mock("../../packages/frameworks/Pressable/Pressable", () => ({
  default: ({ children, ...rest }: any) => (
    <button type="button" {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("../../packages/frameworks/View/HScrollView/HScrollView", () => ({
  default: ({ children }: any) => <div data-testid="hscroll">{children}</div>,
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: any) => <img alt={alt} src={src} />,
}));

describe("ImageView", () => {
  it("renders single image", () => {
    const { container } = render(<ImageView src="test.jpg" alt="Test" />);
    expect(container).toBeInTheDocument();
  });

  it("returns null for empty src array", () => {
    const { container } = render(<ImageView src={[]} alt="" />);
    expect(container.innerHTML).toBe("");
  });
});

describe("resolveOverlay", () => {
  it("returns null for undefined overlay", () => {
    expect(resolveOverlay(undefined, 0)).toBeNull();
  });
});
