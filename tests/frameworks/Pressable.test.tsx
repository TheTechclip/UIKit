import { fireEvent, render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Pressable from "../../packages/frameworks/Pressable/Pressable";

describe("Pressable Component", () => {
  test("renders without crashing", () => {
    const { container } = render(<Pressable>Click me</Pressable>);
    expect(container.textContent).toBe("Click me");
  });

  test("renders as button when onClick is provided", () => {
    const handleClick = vi.fn();
    const { getByRole } = render(
      <Pressable onClick={handleClick}>Click me</Pressable>,
    );
    const button = getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders as link when href is provided", () => {
    const { container } = render(
      <Pressable href="https://example.com">Link</Pressable>,
    );
    const a = container.querySelector("a");
    expect(a).not.toBeNull();
    expect(a?.getAttribute("href")).toBe("https://example.com");
  });

  test("handles disabled state", () => {
    const handleClick = vi.fn();
    const { getByRole } = render(
      <Pressable onClick={handleClick} disabled>
        Disabled Button
      </Pressable>,
    );
    const button = getByRole("button");
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
