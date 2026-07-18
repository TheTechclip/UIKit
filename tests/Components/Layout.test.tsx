import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import Layout from "../../packages/Components/Layout/Layout";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Layout Component", () => {
  it("renders children correctly", () => {
    render(<Layout>Layout Content</Layout>);
    expect(screen.getByText("Layout Content")).toBeInTheDocument();
  });

  it("renders title", () => {
    render(<Layout title="My Title">Content</Layout>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders caption", () => {
    render(<Layout caption="My Caption">Content</Layout>);
    expect(screen.getByText("My Caption")).toBeInTheDocument();
  });

  it("renders header", () => {
    render(<Layout header={<div data-testid="test-header" />}>Content</Layout>);
    expect(screen.getByTestId("test-header")).toBeInTheDocument();
  });

  it("renders Layout.Section with title", () => {
    render(
      <Layout.Section title="Section Title">Section Content</Layout.Section>,
    );
    expect(screen.getByText("Section Title")).toBeInTheDocument();
    expect(screen.getByText("Section Content")).toBeInTheDocument();
  });

  it("renders Layout.Grid correctly", () => {
    render(
      <Layout.Grid>
        <Layout.Section group="Group1" title="Group Title">
          Grid Item
        </Layout.Section>
      </Layout.Grid>,
    );
    expect(screen.getByText("Group Title")).toBeInTheDocument();
    expect(screen.getByText("Grid Item")).toBeInTheDocument();
  });
});
