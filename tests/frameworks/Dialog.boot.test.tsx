import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DialogBootstrap from "../../packages/frameworks/Dialog/Dialog.boot";

describe("DialogBootstrap", () => {
  it("renders without crashing", () => {
    const { container } = render(<DialogBootstrap />);
    expect(container).not.toBeNull();
  });
});
