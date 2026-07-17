import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ImageLeftControl,
  ImageRightControl,
} from "@/packages/Frameworks/View/ImageView/Image.controls";

vi.mock("@/packages/Frameworks/Pressable/Pressable", () => ({
  default: ({ children, onClick, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

describe("ImageLeftControl", () => {
  it("renders left control", () => {
    const { container } = render(<ImageLeftControl onClick={() => {}} />);
    expect(container).toBeInTheDocument();
  });

  it("renders disabled", () => {
    const { container } = render(
      <ImageLeftControl onClick={() => {}} disabled />,
    );
    expect(container).toBeInTheDocument();
  });
});

describe("ImageRightControl", () => {
  it("renders right control", () => {
    const { container } = render(<ImageRightControl onClick={() => {}} />);
    expect(container).toBeInTheDocument();
  });
});
