import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Icon from "../../packages/Components/Icon/Icon";
import Spinner from "../../packages/Components/Spinner/Spinner";
import Text from "../../packages/Components/Text/Text";
import Pressable from "../../packages/Frameworks/Pressable/Pressable";

vi.mock("../../packages/Components/Spinner/Spinner.tsx", () => ({
  default: () => <span data-testid="spinner" />,
}));

vi.mock("../../packages/Components/Text/Text.tsx", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <span data-testid="text">{children}</span>
  ),
}));

vi.mock("../../packages/Frameworks/Pressable/Pressable.tsx", () => ({
  default: ({ children, onClick, ...rest }: any) => (
    <button type="button" data-testid="pressable" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt?: string; src?: string }) => (
    <img data-testid="next-image" alt={alt} src={src} />
  ),
}));

describe("Icon", () => {
  it("renders an icon font element for the icon prop", () => {
    render(<Icon icon="iStar" />);
    expect(document.querySelector(".iStar")).toBeTruthy();
  });

  it("renders a spinner branch", () => {
    render(<Icon spinner />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders an svg branch when svg prop is given", () => {
    const { container } = render(<Icon svg="Checkbox" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders an image branch for string image src", () => {
    render(<Icon image="/cat.png" />);
    expect(screen.getByTestId("next-image")).toHaveAttribute("src", "/cat.png");
  });

  it("renders a title alongside the icon", () => {
    render(<Icon icon="iStar" title="Star" />);
    expect(screen.getByTestId("text")).toHaveTextContent("Star");
  });

  it("wraps the icon in a pressable when pressable is provided", () => {
    const onClick = vi.fn();
    render(<Icon icon="iStar" pressable={{ onClick }} />);
    const pressable = screen.getByTestId("pressable");
    expect(pressable).toBeInTheDocument();
    pressable.click();
    expect(onClick).toHaveBeenCalled();
  });

  it("applies the icon font weight", () => {
    render(<Icon icon="iStar" weight={700} />);
    const icon = document.querySelector(".iStar") as HTMLElement;
    expect(icon.style.getPropertyValue("--uikit-icon-font-weight")).toBe("700");
  });

  it("renders an accessible title as an image role for svg", () => {
    const { container } = render(<Icon svg="Checkbox" title="Close" />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Close");
  });

  it("sets aria-hidden on decorative svg icons", () => {
    const { container } = render(<Icon svg="Checkbox" />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("applies opacity to the icon font", () => {
    render(<Icon icon="iStar" opacity={0.5} />);
    const icon = document.querySelector(".iStar") as HTMLElement;
    expect(icon.style.opacity).toBe("0.5");
  });

  it("renders a brand icon class for iconBrand", () => {
    render(<Icon iconBrand="fa-apple" />);
    expect(document.querySelector(".iBrandfa-apple")).toBeTruthy();
  });
});
