import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Box from "../../packages/Components/Box/Box";
import Divider from "../../packages/Components/Divider/Divider";
import Icon from "../../packages/Components/Icon/Icon";
import Spinner from "../../packages/Components/Spinner/Spinner";
import Text from "../../packages/Components/Text/Text";
import Pressable from "../../packages/Frameworks/Pressable/Pressable";
import View from "../../packages/Frameworks/View/View";

vi.mock("../../packages/Components/Divider/Divider.tsx", () => ({
  default: () => <span data-testid="divider" />,
}));
vi.mock("../../packages/Components/Icon/Icon.tsx", () => ({
  default: ({ icon }: { icon?: string }) => (
    <span data-testid="icon" data-icon={icon} />
  ),
}));
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
vi.mock("../../packages/Frameworks/View/View.tsx", () => ({
  default: ({ children, ...rest }: any) => (
    <div data-testid="view" {...rest}>
      {children}
    </div>
  ),
}));

describe("Box", () => {
  it("renders children inside a column view", () => {
    render(<Box>content</Box>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("forwards a custom className", () => {
    const { container } = render(<Box className="my-box">x</Box>);
    expect(container.querySelector(".my-box")).toBeTruthy();
  });

  it("renders Box.Content with a title", () => {
    render(
      <Box>
        <Box.Content title="Section">body</Box.Content>
      </Box>,
    );
    expect(screen.getByTestId("text")).toHaveTextContent("Section");
  });

  it("renders a spinner when Box.Content is loading", () => {
    render(
      <Box>
        <Box.Content title="Section" loading>
          body
        </Box.Content>
      </Box>,
    );
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders an icon when Box.Content has an icon prop", () => {
    render(
      <Box>
        <Box.Content title="Section" icon={{ icon: "iStar" }}>
          body
        </Box.Content>
      </Box>,
    );
    expect(screen.getByTestId("icon")).toHaveAttribute("data-icon", "iStar");
  });

  it("fires the footer pressable onClick", () => {
    const onClick = vi.fn();
    render(
      <Box>
        <Box.Footer title="More" pressable={{ onClick }} />
      </Box>,
    );
    fireEvent.click(screen.getByTestId("pressable"));
    expect(onClick).toHaveBeenCalled();
  });

  it("renders the footer title text", () => {
    render(
      <Box>
        <Box.Footer title="More" />
      </Box>,
    );
    expect(screen.getByTestId("text")).toHaveTextContent("More");
  });

  it("renders a divider inside the footer", () => {
    render(
      <Box>
        <Box.Footer title="More" />
      </Box>,
    );
    expect(screen.getByTestId("divider")).toBeInTheDocument();
  });

  it("renders Box.Content children only when provided", () => {
    const { container } = render(
      <Box>
        <Box.Content title="Empty" />
      </Box>,
    );
    expect(container.querySelector('[data-testid="text"]')).toBeTruthy();
  });
});
