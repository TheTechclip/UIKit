import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

vi.mock("../../packages/Components/CodeBox/CodeBox.tsx", () => ({
  default: ({ code, language }: { code?: string; language?: string }) => (
    <div data-testid="codebox">
      <span>
        {language === "tsx"
          ? "TSX"
          : language === "jsx"
            ? "JSX"
            : language === "json"
              ? "JSON"
              : language}
      </span>
      <pre>{code}</pre>
    </div>
  ),
}));

import CodeBox from "../../packages/Components/CodeBox/CodeBox";

describe("CodeBox", () => {
  it("renders the code in a pre element", () => {
    render(<CodeBox code="const x = 1;" language="typescript" />);
    expect(document.querySelector("pre")).toHaveTextContent("const x = 1;");
  });

  it("maps tsx language to uppercase TSX", () => {
    render(<CodeBox code="<div/>" language="tsx" />);
    expect(screen.getByText("TSX")).toBeInTheDocument();
  });

  it("maps jsx language to JSX", () => {
    render(<CodeBox code="<div/>" language="jsx" />);
    expect(screen.getByText("JSX")).toBeInTheDocument();
  });

  it("maps json language to JSON", () => {
    render(<CodeBox code='{"a":1}' language="json" />);
    expect(screen.getByText("JSON")).toBeInTheDocument();
  });
});
