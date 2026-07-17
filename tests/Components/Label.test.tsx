import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Label from "@/packages/Components/Label/Label";

vi.mock("@/packages/Components/Icon/Icon", () => ({
  default: ({ icon, color }: { icon?: string; color?: string }) => (
    <span data-testid="icon" data-icon={icon} data-color={color} />
  ),
}));

vi.mock("@/packages/Components/Text/Text", () => ({
  default: ({
    children,
    color,
  }: {
    children?: React.ReactNode;
    color?: string;
  }) => (
    <span data-testid="text" data-color={color}>
      {children}
    </span>
  ),
}));

vi.mock("@/packages/Frameworks/View/View", () => ({
  default: ({
    children,
    ...rest
  }: {
    children?: React.ReactNode;
    [k: string]: unknown;
  }) => (
    <div data-testid="view" {...rest}>
      {children}
    </div>
  ),
}));

vi.mock("@/packages/Frameworks/Pressable/Pressable", () => ({
  default: ({ children, ...rest }: any) => (
    <button type="button" data-testid="pressable" {...rest}>
      {children}
    </button>
  ),
}));

describe("Label", () => {
  it("renders the title text", () => {
    render(<Label title="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders a required marker", () => {
    render(<Label title="Email" required />);
    expect(screen.getByText(/\*/)).toBeInTheDocument();
  });

  it("associates the label with the input via htmlFor", () => {
    render(<Label htmlFor="email-input" title="Email" />);
    expect(screen.getByText("Email").closest("label")).toHaveAttribute(
      "for",
      "email-input",
    );
  });

  it("renders children inside the pressable", () => {
    render(
      <Label title="Field">
        <input data-testid="child-input" />
      </Label>,
    );
    expect(screen.getByTestId("child-input")).toBeInTheDocument();
  });

  it("renders an error hint with an error icon", () => {
    render(<Label hint={{ type: "error", text: "Invalid value" }} />);
    expect(screen.getByText("Invalid value")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toHaveAttribute(
      "data-icon",
      "iCloseCircle",
    );
  });

  it("renders a warning hint with a warning icon", () => {
    render(<Label hint={{ type: "warning", text: "Be careful" }} />);
    expect(screen.getByTestId("icon")).toHaveAttribute(
      "data-icon",
      "iWarningCircle",
    );
  });

  it("renders an info hint with an info icon", () => {
    render(<Label hint={{ type: "info", text: "Details" }} />);
    expect(screen.getByTestId("icon")).toHaveAttribute(
      "data-icon",
      "iInfoCircle",
    );
  });

  it("renders a success hint with a check icon", () => {
    render(<Label hint={{ type: "success", text: "Looks good" }} />);
    expect(screen.getByTestId("icon")).toHaveAttribute(
      "data-icon",
      "iCheckCircle",
    );
  });

  it("links the hint via hintId", () => {
    render(<Label hintId="field-hint" hint={{ type: "info", text: "Help" }} />);
    expect(document.getElementById("field-hint")).toBeTruthy();
  });

  it("marks the pressable disabled", () => {
    render(<Label disabled />);
    expect(screen.getByTestId("pressable")).toHaveAttribute("disabled");
  });

  it("marks the pressable readonly", () => {
    render(<Label readOnly />);
    expect(screen.getByTestId("pressable")).toHaveAttribute("readonly");
  });

  it("uses Regular radius by default", () => {
    render(<Label title="Field" />);
    expect(screen.getByTestId("pressable")).toHaveAttribute(
      "radius",
      "Regular",
    );
  });

  it("forwards a custom className", () => {
    const { container } = render(<Label className="custom-label" title="X" />);
    expect(container.querySelector(".custom-label")).toBeTruthy();
  });
});
