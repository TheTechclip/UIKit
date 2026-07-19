import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const imageDialog = {
  canScrollNext: true,
  canScrollPrev: false,
  galleryRef: { current: null },
  scrollNext: vi.fn(),
  scrollPrev: vi.fn(),
  scrollTo: vi.fn(),
  selectedIndex: 1,
};

vi.mock("../../packages/frameworks/View/View", () => ({
  default: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  ),
}));
vi.mock("../../packages/frameworks/View/ImageView/Image.useDialog", () => ({
  useImageDialog: () => imageDialog,
}));
vi.mock("../../packages/frameworks/View/ImageView/Image.controls", () => ({
  ImageLeftControl: ({
    onClick,
    disabled,
  }: {
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button
      aria-label="previous"
      disabled={disabled}
      onClick={onClick}
      type="button"
    />
  ),
  ImageRightControl: ({
    className,
    onClick,
    disabled,
  }: {
    className?: string;
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button
      aria-label="next"
      className={className}
      disabled={disabled}
      onClick={onClick}
      type="button"
    />
  ),
}));
vi.mock(
  "../../packages/frameworks/View/ImageView/Dialog/ImageDialog.header",
  () => ({
    DialogImageHeader: ({ onClose }: { onClose: () => void }) => (
      <button onClick={onClose} type="button">
        close
      </button>
    ),
  }),
);
vi.mock(
  "../../packages/frameworks/View/ImageView/Dialog/ImageDialog.footer",
  () => ({
    DialogImageFooter: ({ selectedIndex }: { selectedIndex: number }) => (
      <output>{selectedIndex}</output>
    ),
  }),
);
vi.mock(
  "../../packages/frameworks/View/ImageView/Dialog/ImageDialog.slide",
  () => ({
    DialogImageSlide: ({ index }: { index: number }) => (
      <div data-testid={`slide-${index}`} />
    ),
  }),
);

import ImageDialog from "../../packages/frameworks/View/ImageView/Dialog/ImageDialog";

const items = [
  { alt: "first", id: 1, src: "/first.png" },
  { alt: "second", id: 2, src: "/second.png" },
];

describe("ImageDialog", () => {
  it("renders its gallery and boolean navigation controls", () => {
    const onClose = vi.fn();
    render(
      <ImageDialog
        dialog={{ control: true }}
        initialIndex={0}
        items={items}
        onClose={onClose}
      />,
    );

    expect(screen.getAllByTestId(/slide-/)).toHaveLength(2);
    expect(screen.getByRole("button", { name: "previous" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "next" }));
    fireEvent.click(screen.getByRole("button", { name: "close" }));
    expect(imageDialog.scrollNext).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("honors per-side control configuration", () => {
    render(
      <ImageDialog
        dialog={{ control: { left: false, right: { className: "right" } } }}
        initialIndex={1}
        items={items}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "previous" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "next" })).toHaveClass("right");
  });

  it("accepts explicit object-side controls", () => {
    render(
      <ImageDialog
        dialog={{ control: { left: true, right: true } }}
        initialIndex={0}
        items={items}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "previous" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "next" })).toBeInTheDocument();
  });

  it("does not infer an omitted object-side control", () => {
    render(
      <ImageDialog
        dialog={{ control: { left: true } }}
        initialIndex={0}
        items={items}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "previous" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "next" }),
    ).not.toBeInTheDocument();
  });

  it("renders without controls", () => {
    render(
      <ImageDialog
        dialog={{}}
        initialIndex={0}
        items={items}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "next" }),
    ).not.toBeInTheDocument();
  });
});
