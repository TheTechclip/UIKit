import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DialogImageFooter } from "@/packages/Frameworks/View/ImageView/Dialog/ImageDialog.footer";

vi.mock("@/packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

describe("DialogImageFooter", () => {
  it("returns null when dialog has no footer", () => {
    const { container } = render(
      <DialogImageFooter
        dialog={{} as any}
        items={[]}
        selectedIndex={0}
        thumbnailRefs={{ current: [] }}
        scrollTo={() => {}}
        scrollPrev={() => {}}
        scrollNext={() => {}}
        canScrollPrev={false}
        canScrollNext={false}
      />,
    );
    expect(container.innerHTML).toBe("");
  });
});
