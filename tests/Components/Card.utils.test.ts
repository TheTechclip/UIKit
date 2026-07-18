import { describe, expect, it } from "vitest";
import { resolveState } from "../../packages/Components/Card/Card.types";

describe("resolveState", () => {
  it("returns value directly when not Stateful", () => {
    expect(resolveState("hello", false)).toBe("hello");
    expect(resolveState(42, true)).toBe(42);
  });

  it("returns normal value when not activated", () => {
    const result = resolveState(
      { normal: "normal", activated: "active" },
      false,
    );
    expect(result).toBe("normal");
  });

  it("returns activated value when activated", () => {
    const result = resolveState(
      { normal: "normal", activated: "active" },
      true,
    );
    expect(result).toBe("active");
  });

  it("returns undefined for undefined input", () => {
    expect(resolveState(undefined, false)).toBeUndefined();
  });
});
