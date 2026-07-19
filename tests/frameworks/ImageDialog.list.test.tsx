import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DialogImageList } from "../../packages/frameworks/View/ImageView/Dialog/ImageDialog.list";

vi.mock("../../packages/frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

describe("DialogImageList", () => {
  it("renders thumbnail list", () => {
    const refs = { current: [] } as React.MutableRefObject<
      (HTMLElement | null)[]
    >;
    const { container } = render(
      <DialogImageList
        items={[{ id: 1, src: "/a.jpg", alt: "A" }]}
        selectedIndex={0}
        thumbnailRefs={refs}
        onThumbnailClick={() => {}}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
