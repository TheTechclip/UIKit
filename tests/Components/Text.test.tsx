import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Text from "../../packages/Components/Text/Text";

describe("Text", () => {
  it("renders children inside a span", () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies the type class", () => {
    const { container } = render(<Text type="Title1">Heading</Text>);
    expect(container.querySelector(".Title1")).toBeTruthy();
  });

  it("applies the serif font class", () => {
    const { container } = render(<Text fontType="serif">S</Text>);
    expect(container.querySelector(".FontSerif")).toBeTruthy();
  });

  it("applies the code font class", () => {
    const { container } = render(<Text fontType="code">S</Text>);
    expect(container.querySelector(".FontCode")).toBeTruthy();
  });

  it("sets the font size from the size prop", () => {
    render(<Text size={16}>Sized</Text>);
    expect(screen.getByText("Sized")).toHaveStyle({ fontSize: "1.6rem" });
  });

  it("clamps opacity to a maximum of 1", () => {
    render(<Text opacity={2}>Clamped</Text>);
    expect(screen.getByText("Clamped")).toHaveStyle({ opacity: "1" });
  });

  it("clamps opacity to a minimum of 0", () => {
    render(<Text opacity={-1}>Clamped</Text>);
    expect(screen.getByText("Clamped")).toHaveStyle({ opacity: "0" });
  });

  it("passes fontWeight through", () => {
    render(<Text weight={700}>Bold</Text>);
    expect(screen.getByText("Bold")).toHaveStyle({ fontWeight: "700" });
  });

  it("sets textAlign", () => {
    render(<Text textAlign="center">Center</Text>);
    expect(screen.getByText("Center")).toHaveStyle({ textAlign: "center" });
  });

  it("sets a numeric id", () => {
    render(<Text id="my-text">Id</Text>);
    expect(screen.getByText("Id")).toHaveAttribute("id", "my-text");
  });

  it("uses lineHeight 1 when verticalTrim is set", () => {
    render(<Text verticalTrim>Trim</Text>);
    expect(screen.getByText("Trim")).toHaveStyle({ lineHeight: "1" });
  });
});
