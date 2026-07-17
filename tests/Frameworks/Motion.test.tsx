import { describe, expect, test } from "vitest";
import { motionPresets, motionTransitions } from "../../packages/Frameworks/Motion/Motion.presets";

describe("Motion presets", () => {
  test("motionTransitions are defined", () => {
    expect(motionTransitions.sheet).toBeDefined();
    expect(motionTransitions.modal).toBeDefined();
    expect(motionTransitions.popover).toBeDefined();
  });

  test("motionPresets are defined and return expected structure", () => {
    expect(motionPresets.modal.initial).toBeDefined();
    
    const popoverReady = motionPresets.popover(true);
    expect(popoverReady.animate).toEqual({ opacity: 1, scale: 1 });

    const popoverNotReady = motionPresets.popover(false);
    expect(popoverNotReady.animate).toEqual({ opacity: 0, scale: 0.96 });

    const backdropOpen = motionPresets.backdrop(true);
    expect(backdropOpen.animate).toEqual({ opacity: 1 });
  });
});
