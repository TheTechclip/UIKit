import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MapOSM from "../../packages/Components/Maps/OSM/MapOSM";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock("maplibre-gl", () => {
  return {
    default: {
      Map: vi.fn(() => ({
        on: vi.fn(),
        off: vi.fn(),
        remove: vi.fn(),
        addControl: vi.fn(),
        removeControl: vi.fn(),
        hasImage: vi.fn(),
        addImage: vi.fn(),
        once: vi.fn(),
        easeTo: vi.fn(),
        resize: vi.fn(),
        jumpTo: vi.fn(),
        setTerrain: vi.fn(),
        setPitch: vi.fn(),
        setMaxPitch: vi.fn(),
        scrollZoom: { enable: vi.fn(), disable: vi.fn() },
        boxZoom: { enable: vi.fn(), disable: vi.fn() },
        dragRotate: { enable: vi.fn(), disable: vi.fn() },
        dragPan: { enable: vi.fn(), disable: vi.fn() },
        keyboard: { enable: vi.fn(), disable: vi.fn() },
        doubleClickZoom: { enable: vi.fn(), disable: vi.fn() },
        touchZoomRotate: { enable: vi.fn(), disable: vi.fn() },
      })),
      Marker: vi.fn(() => ({
        setLngLat: vi.fn().mockReturnThis(),
        addTo: vi.fn().mockReturnThis(),
      })),
      NavigationControl: vi.fn(),
    },
  };
});

describe("Maps/OSM Component", () => {
  it("renders map wrapper correctly", () => {
    const { container } = render(<MapOSM lat={37.5326} lon={127.0246} />);
    // The MapOSM renders a couple of View components. We can just verify it mounted.
    expect(container.firstChild).toBeInTheDocument();
  });
});
