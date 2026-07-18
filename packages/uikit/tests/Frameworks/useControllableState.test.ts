import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useControllableState } from "../../packages/Frameworks/_shared/useControllableState";

describe("useControllableState", () => {
  it("uses controlled value when provided", () => {
    const { result } = renderHook(() =>
      useControllableState({ value: "controlled", defaultValue: "fallback" }),
    );
    expect(result.current[0]).toBe("controlled");
  });

  it("uses default value when no controlled value", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: "default" }),
    );
    expect(result.current[0]).toBe("default");
  });

  it("allows state change via setter", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: "initial" }),
    );
    act(() => result.current[1]("updated"));
    expect(result.current[0]).toBe("updated");
  });

  it("returns isControlled flag", () => {
    const { result: controlled } = renderHook(() =>
      useControllableState({ value: "v", defaultValue: "d" }),
    );
    expect(controlled.current[2]).toBe(true);

    const { result: uncontrolled } = renderHook(() =>
      useControllableState({ defaultValue: "d" }),
    );
    expect(uncontrolled.current[2]).toBe(false);
  });
});
