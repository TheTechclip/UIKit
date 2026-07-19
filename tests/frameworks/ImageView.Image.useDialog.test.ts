import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useImageDialog } from "../../packages/frameworks/View/ImageView/Image.useDialog";

describe("useImageDialog", () => {
  it("returns initial index and controls", () => {
    const { result } = renderHook(() => useImageDialog(2));
    expect(result.current.selectedIndex).toBe(2);
  });
});
