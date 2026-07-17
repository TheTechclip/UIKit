import { describe, expect, it } from "vitest";
import {
  motionPresets,
  motionTransitions,
} from "../../packages/Frameworks/Motion/Motion.presets";

describe("motionTransitions", () => {
  it("has sheet transitions defined", () => {
    expect(motionTransitions.sheet).toBeDefined();
    expect(motionTransitions.sheet.snap.type).toBe("spring");
  });

  it("has modal transition defined", () => {
    expect(motionTransitions.modal).toBeDefined();
    expect(motionTransitions.modal.transition.type).toBe("spring");
  });

  it("has popover transition defined", () => {
    expect(motionTransitions.popover).toBeDefined();
    expect(motionTransitions.popover.transition.duration).toBe(0.16);
  });
});

describe("motionPresets", () => {
  it("has modal preset", () => {
    expect(motionPresets.modal).toBeDefined();
    expect(motionPresets.modal.initial.opacity).toBe(0);
  });

  it("has popover preset function", () => {
    const preset = motionPresets.popover(true);
    expect(preset).toBeDefined();
    expect(preset.initial.opacity).toBe(0);
  });
});
