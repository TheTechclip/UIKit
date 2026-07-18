import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// renderSheet is a complex component. Test its pure utility functions.
describe("renderSheet utilities", () => {
  it("can import renderSheet module", async () => {
    const mod = await import(
      "../../packages/Frameworks/Dialog/renderers/renderSheet"
    );
    expect(mod.default).toBeDefined();
  });
});
