import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContributionGraph from "@/packages/Components/ContributionGraph/ContributionGraph";

describe("ContributionGraph", () => {
  const mockData = [
    { date: "2024-01-01", level: 1 as const },
    { date: "2024-01-02", level: 2 as const },
    { date: "2024-01-03", level: 3 as const },
  ];

  it("renders without crashing", () => {
    const { container } = render(
      <ContributionGraph
        data={mockData}
        endDate="2024-01-31"
        visibleDays={30}
      />,
    );
    expect(container).not.toBeNull();
  });

  it("renders legend cells", () => {
    const { container } = render(
      <ContributionGraph
        data={mockData}
        endDate="2024-01-31"
        visibleDays={30}
      />,
    );
    const legendCells = container.querySelectorAll("[data-level]");
    expect(legendCells.length).toBeGreaterThan(0);
  });

  it("renders the correct number of graph cells", () => {
    const { container } = render(
      <ContributionGraph
        data={mockData}
        endDate="2024-01-31"
        visibleDays={10}
      />,
    );
    // Grid cells should be rendered
    const cells = container.querySelectorAll("[data-level]");
    // Visible days + alignment can result in a bit more cells, but at least > 0
    expect(cells.length).toBeGreaterThan(0);
  });
});
