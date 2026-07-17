import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSheetProgressive } from "@/packages/Frameworks/Dialog/hooks/useSheetProgressive";

describe("useSheetProgressive", () => {
  it("returns default state", () => {
    const y = {
      get: () => 0,
      on: () => vi.fn(),
    };
    const { result } = renderHook(() =>
      useSheetProgressive({
        y: y as any,
        normalizedSnapPoints: [0, 0.5, 1],
        viewportHeight: 800,
        maxSnap: 1,
        isFreeDrag: false,
        hasExplicitSnapPoints: true,
      }),
    );
    expect(result.current).toBeDefined();
  });
});
