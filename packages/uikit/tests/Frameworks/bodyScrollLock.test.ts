import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useScrollLock } from "../../packages/Frameworks/_shared/bodyScrollLock";

describe("useScrollLock", () => {
  it("locks body when locked is true", () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("does not lock body when locked is false", () => {
    renderHook(() => useScrollLock(false));
    expect(document.body.style.overflow).toBe("");
  });

  it("unlocks on cleanup", () => {
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
