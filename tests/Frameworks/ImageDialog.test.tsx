import { describe, expect, it } from "vitest";

describe("ImageDialog module", () => {
  it("exports ImageDialog", async () => {
    const mod = await import(
      "@/packages/Frameworks/View/ImageView/Dialog/ImageDialog"
    );
    expect(mod.default).toBeDefined();
  });

  it("exports DialogImageFooter", async () => {
    const mod = await import(
      "@/packages/Frameworks/View/ImageView/Dialog/ImageDialog.footer"
    );
    expect(mod.DialogImageFooter).toBeDefined();
  });

  it("exports DialogImageList", async () => {
    const mod = await import(
      "@/packages/Frameworks/View/ImageView/Dialog/ImageDialog.list"
    );
    expect(mod.DialogImageList).toBeDefined();
  });

  it("exports DialogImageSlide", async () => {
    const mod = await import(
      "@/packages/Frameworks/View/ImageView/Dialog/ImageDialog.slide"
    );
    expect(mod.DialogImageSlide).toBeDefined();
  });
});
