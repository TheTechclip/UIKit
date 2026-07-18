import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  resolveInitialSnapIndex,
  toPx,
  useSheetGeometry,
} from "../../packages/Frameworks/Dialog/hooks/useSheetGeometry";

describe("toPx", () => {
  it("converts undefined to fallback", () => {
    expect(toPx(undefined, 800, 100)).toBe(100);
  });

  it("converts ratio (0-1) to viewport percentage", () => {
    expect(toPx(0.5, 800, 100)).toBe(400);
  });

  it("converts absolute number to px", () => {
    expect(toPx(200, 800, 100)).toBe(200);
  });

  it("parses rem values", () => {
    expect(toPx("10rem", 800, 100)).toBe(160);
  });

  it("parses px values", () => {
    expect(toPx("50px", 800, 100)).toBe(50);
  });

  it("returns fallback for invalid strings", () => {
    expect(toPx("invalid", 800, 100)).toBe(100);
  });
});

describe("resolveInitialSnapIndex", () => {
  it("returns last index when defaultSnap > points length", () => {
    expect(resolveInitialSnapIndex([0.3, 0.6, 1], 5)).toBe(2);
  });

  it("finds exact match", () => {
    expect(resolveInitialSnapIndex([0.3, 0.5, 1], 0.5)).toBe(1);
  });
});

describe("useSheetGeometry", () => {
  it("returns default values when closed", () => {
    const { result } = renderHook(() =>
      useSheetGeometry({
        config: undefined,
        height: undefined,
        sheetHeightPx: 0,
        open: false,
        rendered: false,
      }),
    );
    expect(result.current.viewportHeight).toBe(0);
    expect(result.current.isFreeDrag).toBe(false);
  });
});
