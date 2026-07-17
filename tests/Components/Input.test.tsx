import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Input from "@/packages/Components/Input/Input";
import Label from "@/packages/Components/Label/Label";
import Text from "@/packages/Components/Text/Text";
import View from "@/packages/Frameworks/View/View";

vi.mock("@/packages/Components/Label/Label", () => ({
  default: ({ children, htmlFor, required, disabled, readOnly, hint, title }: any) => (
    <label htmlFor={htmlFor} data-required={required ? "true" : undefined} data-disabled={disabled ? "true" : undefined} data-readonly={readOnly ? "true" : undefined}>
      {title ? <span data-testid="label-title">{title}</span> : null}
      {children}
      {hint ? (
        <span data-testid="label-hint" data-hint-type={hint.type}>
          {hint.text}
        </span>
      ) : null}
    </label>
  ),
}));

vi.mock("@/packages/Components/Text/Text", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <span data-testid="text">{children}</span>
  ),
}));

vi.mock("@/packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: { children?: React.ReactNode; [k: string]: unknown }) => (
    <div data-testid="view" {...rest}>
      {children}
    </div>
  ),
}));

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe("text");
  });

  it("forwards the type prop", () => {
    render(<Input type="email" />);
    expect((screen.getByRole("textbox") as HTMLInputElement).type).toBe("email");
  });

  it("associates the input with the label via id", () => {
    render(<Input id="email-field" title="Email" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "email-field");
  });

  it("uses a generated id when none provided", () => {
    render(<Input title="Name" />);
    const input = screen.getByRole("textbox");
    expect(input.id).toBeTruthy();
  });

  it("renders the title in the label", () => {
    render(<Input title="Username" />);
    expect(screen.getByTestId("label-title")).toHaveTextContent("Username");
  });

  it("marks the input required", () => {
    render(<Input required />);
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("marks the input disabled", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("marks the input readonly", () => {
    render(<Input readOnly />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("renders a placeholder", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Enter text",
    );
  });

  it("renders a prefix text", () => {
    render(<Input prefix="https://" />);
    expect(screen.getByTestId("text")).toHaveTextContent("https://");
  });

  it("fires onChange when typing", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" },
    });
    expect(onChange).toHaveBeenCalled();
  });

  it("reflects controlled value", () => {
    render(<Input value="fixed" readOnly />);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
      "fixed",
    );
  });

  it("renders an error hint and sets aria-invalid", () => {
    render(<Input hint={{ type: "error", text: "Required field" }} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByTestId("label-hint")).toHaveTextContent("Required field");
  });

  it("links the hint via aria-describedby", () => {
    render(<Input id="x" hint={{ type: "info", text: "Helpful" }} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "x-hint");
  });

  it("does not set aria-invalid for non-error hints", () => {
    render(<Input hint={{ type: "info", text: "Helpful" }} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });
});
