import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import Nav from "../../packages/Components/Nav/Nav";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("Nav Component", () => {
  it("renders nav items correctly", () => {
    render(
      <Nav
        items={[
          { title: "Home", value: "home" },
          { title: "Profile", value: "profile" },
        ]}
      />,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("handles item selection", () => {
    const onChange = vi.fn();
    render(
      <Nav
        radio={true}
        items={[
          { title: "Home", value: "home" },
          { title: "Profile", value: "profile" },
        ]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByText("Profile"));
    expect(onChange).toHaveBeenCalledWith("profile");
  });
});
