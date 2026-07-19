import { describe, expect, it } from "vitest";
import {
  getComputedPixelValue,
  Size,
  SizePX,
} from "../../packages/frameworks/shared/sizing";

describe("Size", () => {
  it("returns undefined for null/undefined/empty", () => {
    expect(Size(undefined)).toBeUndefined();
    expect(Size(null)).toBeUndefined();
    expect(Size("")).toBeUndefined();
  });

  it("converts number to rem", () => {
    expect(Size(10)).toBe("1rem");
    expect(Size(20)).toBe("2rem");
    expect(Size(5)).toBe("0.5rem");
  });

  it("returns string values as-is", () => {
    expect(Size("100%")).toBe("100%");
    expect(Size("auto")).toBe("auto");
    expect(Size("2rem")).toBe("2rem");
  });
});

describe("SizePX", () => {
  it("converts number to px", () => {
    expect(SizePX(10, 0)).toBe(16);
    expect(SizePX(20, 0)).toBe(32);
  });

  it("handles string values", () => {
    expect(SizePX("16px", 0)).toBe(16);
    expect(SizePX("1rem", 0)).toBe(16);
    expect(SizePX("2rem", 0)).toBe(32);
  });

  it("returns fallback for invalid values", () => {
    expect(SizePX(undefined, 100)).toBe(100);
    expect(SizePX("invalid", 42)).toBe(42);
  });
});

describe("getComputedPixelValue", () => {
  it("returns parsed pixel value", () => {
    document.body.style.width = "100px";
    const result = getComputedPixelValue(document.body, "width" as any);
    expect(result).toBe(100);
  });
});
