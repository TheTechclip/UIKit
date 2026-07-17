import { describe, expect, it } from "vitest";
import {
  resolveAtIndex,
  resolveBlurDataURL,
  resolveImageSrc,
  resolveItems,
} from "../../packages/Frameworks/View/ImageView/Image.utils";

describe("resolveItems", () => {
  it("converts string src to item", () => {
    const items = resolveItems("photo.jpg", "Photo");
    expect(items).toHaveLength(1);
    expect(items[0]!.src).toBe("photo.jpg");
    expect(items[0]!.alt).toBe("Photo");
  });

  it("converts string array to items", () => {
    const items = resolveItems(["a.jpg", "b.jpg"], ["A", "B"]);
    expect(items).toHaveLength(2);
  });
});

describe("resolveImageSrc", () => {
  it("returns src for inline mode", () => {
    const result = resolveImageSrc(
      { id: 1, src: "test.jpg", alt: "" },
      "inline",
    );
    expect(result).toBe("test.jpg");
  });
});

describe("resolveAtIndex", () => {
  it("returns single value at index", () => {
    expect(resolveAtIndex(10, 0)).toBe(10);
    expect(resolveAtIndex([10, 20], 0)).toBe(10);
    expect(resolveAtIndex([10, 20], 1)).toBe(20);
  });
});

describe("resolveBlurDataURL", () => {
  it("returns item blurDataURL if available", () => {
    const result = resolveBlurDataURL(
      { id: 1, src: "a.jpg", alt: "", blurDataURL: "data:blur" },
      0,
    );
    expect(result).toBe("data:blur");
  });

  it("returns fallback for missing blurDataURL", () => {
    const result = resolveBlurDataURL({ id: 1, src: "a.jpg", alt: "" }, 0);
    expect(typeof result).toBe("string");
  });
});
