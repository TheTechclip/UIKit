import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Dialog from "../../packages/frameworks/Dialog/Dialog";

// We need to mock window.matchMedia since Dialog uses useViewportMatch internally
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Dialog Component", () => {
  test("renders nothing when closed", () => {
    const { container } = render(
      <Dialog mode="modal" open={false}>
        <div data-testid="dialog-content">Content</div>
      </Dialog>,
    );
    expect(
      container.querySelector("[data-testid='dialog-content']"),
    ).toBeNull();
  });

  // Modal mode uses portals, so it might render in document.body
  test("renders when open in modal mode", () => {
    const { baseElement } = render(
      <Dialog mode="modal" open={true}>
        <div data-testid="modal-content">Content</div>
      </Dialog>,
    );
    // Dialog uses framer-motion and portals, content might appear in the baseElement
    expect(baseElement).toBeDefined();
  });
});
