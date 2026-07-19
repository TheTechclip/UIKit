import { describe, expect, it } from "vitest";
import {
  resolveSafeMapStyle,
  sanitizeStyleFilterExpression,
} from "../../packages/components/maps/OSM/MapOSM.style";

describe("sanitizeStyleFilterExpression", () => {
  it("returns undefined for undefined input", () => {
    expect(sanitizeStyleFilterExpression(undefined)).toBeUndefined();
  });

  it("handles non-array expression", () => {
    expect(sanitizeStyleFilterExpression(true)).toBe(true);
  });

  it("sanitizes numeric comparison filters", () => {
    const result = sanitizeStyleFilterExpression([
      "==",
      ["get", "type"],
      "park",
    ]);
    expect(result).toBeDefined();
  });
});

describe("resolveSafeMapStyle", () => {
  it("returns style spec with sanitized layers", () => {
    const style: any = {
      version: 8,
      name: "test",
      sources: {},
      layers: [
        { id: "bg", type: "background", paint: {} },
        { id: "3d", type: "fill-extrusion", paint: {}, source: "a" },
      ],
    };
    const result = resolveSafeMapStyle(style, true);
    expect(result.layers).toHaveLength(1);
    expect(result.layers![0]!.id).toBe("bg");
  });

  it("keeps 3d layers when disable3D is false", () => {
    const style: any = {
      version: 8,
      name: "test",
      sources: {},
      layers: [{ id: "3d", type: "fill-extrusion", paint: {}, source: "a" }],
    };
    const result = resolveSafeMapStyle(style, false);
    expect(result.layers).toHaveLength(1);
  });
});
