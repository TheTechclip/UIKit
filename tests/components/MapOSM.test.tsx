import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MapOSM from "../../packages/components/maps/OSM/MapOSM";

vi.mock("maplibre-gl", () => ({
  default: class {
    on() {}
    remove() {}
  },
  Map: class {
    on() {}
    remove() {}
  },
}));

vi.mock("../../packages/frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

describe("MapOSM", () => {
  it("renders container", () => {
    const { container } = render(<MapOSM lat={37.5665} lon={126.978} />);
    expect(container).toBeInTheDocument();
  });
});
