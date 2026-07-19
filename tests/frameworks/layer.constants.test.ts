import { describe, expect, it } from "vitest";
import { LAYER_Z_INDEX } from "../../packages/frameworks/shared/layer.constants";

describe("LAYER_Z_INDEX", () => {
  it("has expected z-index values", () => {
    expect(LAYER_Z_INDEX.popover).toBe(99000);
    expect(LAYER_Z_INDEX.modal).toBe(99900);
    expect(LAYER_Z_INDEX.modalStackStep).toBe(20);
    expect(LAYER_Z_INDEX.localRaisedOffset).toBe(2);
  });
});
