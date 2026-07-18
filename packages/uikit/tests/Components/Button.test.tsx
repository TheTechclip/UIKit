import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../../packages/Components/Button/Button";

describe("Button Component", () => {
  it("renders text correctly", () => {
    render(<Button text="Click Me" />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button text="Click Me" pressable={{ onClick: handleClick }} />);
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when promise is loading", () => {
    render(<Button text="Click Me" promise={{ type: "loading" }} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows success state when promise is success", () => {
    render(<Button text="Click Me" promise={{ type: "success" }} />);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("shows error state when promise is error", () => {
    render(<Button text="Click Me" promise={{ type: "error" }} />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("disables button when loading", () => {
    const handleClick = vi.fn();
    render(
      <Button
        text="Click Me"
        promise={{ type: "loading" }}
        pressable={{ onClick: handleClick }}
      />,
    );
    fireEvent.click(screen.getByText("Loading..."));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders with custom class and style", () => {
    const { container } = render(
      <Button text="Styled" className="custom-btn" style={{ color: "red" }} />,
    );
    const button = container.firstChild;
    expect(button).toHaveClass("custom-btn");
    expect(button).toHaveStyle("color: rgb(255, 0, 0)");
  });
});
