import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IconGroup from "../../packages/Components/Icon/Icon.group";

vi.mock("../../packages/Frameworks/Pressable/Pressable", () => ({
  default: ({ children, ...rest }: any) => (
    <button type="button" {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("../../packages/Frameworks/View/View", () => ({
  default: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
}));

vi.mock("../../packages/Components/Icon/Icon", () => ({
  default: ({ icon }: { icon?: string }) => (
    <span data-testid="mock-icon">{icon}</span>
  ),
}));

describe("IconGroup", () => {
  it("renders icons in a group", () => {
    render(<IconGroup icons={[{ icon: "iStar" }, { icon: "iHeart" }]} />);
    const icons = screen.getAllByTestId("mock-icon");
    expect(icons).toHaveLength(2);
  });

  it("renders with padding", () => {
    const { container } = render(
      <IconGroup icons={[{ icon: "iStar" }]} padding={8} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
