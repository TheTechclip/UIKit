import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Select from "../../packages/components/Select/Select";

vi.mock("../../packages/components/ContextMenu/ContextMenu.tsx", () => ({
  default: ({ open, contents, listId }: any) =>
    open ? (
      <div role="listbox" id={listId}>
        {contents.length === 0 ? (
          <span>No results</span>
        ) : (
          contents.map((item: any, index: number) => (
            <button
              type="button"
              key={String(item.value)}
              role="option"
              id={`${listId}-${index}`}
              data-selected={item.selected ? "true" : undefined}
              data-disabled={item.disabled ? "true" : undefined}
              onClick={item.onClick}
            >
              {item.label}
              {item.description ? (
                <span data-testid="option-desc">{item.description}</span>
              ) : null}
            </button>
          ))
        )}
      </div>
    ) : null,
}));

vi.mock("../../packages/components/Label/Label.tsx", () => ({
  default: ({ children, htmlFor, title }: any) => (
    <label htmlFor={htmlFor}>
      {title ? <span>{title}</span> : null}
      {children}
    </label>
  ),
}));

vi.mock("../../packages/components/Icon/Icon.tsx", () => ({
  default: ({ icon }: { icon?: string }) => (
    <span data-testid="icon" data-icon={icon} />
  ),
}));

vi.mock("../../packages/components/Text/Text.tsx", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <span data-testid="text">{children}</span>
  ),
}));

vi.mock("../../packages/frameworks/Pressable/Pressable.tsx", () => ({
  default: ({ children, onClick, role, ...rest }: any) => (
    <button
      type="button"
      data-testid="pressable"
      role={role}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  ),
}));

vi.mock("../../packages/frameworks/View/View.tsx", () => ({
  default: ({ children, ...rest }: any) => (
    <div data-testid="view" {...rest}>
      {children}
    </div>
  ),
}));

const options = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "gamma", label: "Gamma" },
];

describe("Select", () => {
  it("renders a combobox trigger", () => {
    render(<Select options={options} placeholder="Pick" />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("opens the option listbox when the trigger is clicked", () => {
    render(<Select options={options} placeholder="Pick" />);
    fireEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("selects an option and reports it via onChange", () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} placeholder="Pick" />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Beta" }));
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.target.value).toBe("beta");
  });

  it("renders option descriptions", () => {
    render(
      <Select
        options={[{ value: "a", label: "A", description: "The A option" }]}
        placeholder="Pick"
      />,
    );
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByTestId("option-desc")).toHaveTextContent("The A option");
  });

  it("filters typeable search by label", () => {
    render(<Select combobox options={options} placeholder="Search" />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Ga" } });
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Gamma" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Alpha" }),
    ).not.toBeInTheDocument();
  });

  it("does not open when disabled", () => {
    render(<Select options={options} disabled placeholder="Pick" />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not open when readOnly", () => {
    render(<Select options={options} readOnly combobox placeholder="Search" />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Alpha" } });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows the translated empty state when no options match", () => {
    render(<Select combobox options={options} placeholder="Search" />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByRole("listbox")).toHaveTextContent(/no results/i);
  });

  it("supports multiple selection", () => {
    const onChange = vi.fn();
    render(
      <Select
        multiple
        options={options}
        onChange={onChange}
        placeholder="Pick"
      />,
    );
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Alpha" }));
    fireEvent.click(screen.getByRole("option", { name: "Beta" }));
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.target.value).toEqual(["alpha", "beta"]);
  });

  it("marks the selected multiselect option as selected in the listbox", () => {
    render(<Select multiple options={options} placeholder="Pick" />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Alpha" }));
    const alpha = screen.getByRole("option", { name: "Alpha" });
    expect(alpha).toHaveAttribute("data-selected", "true");
  });

  it("flattens grouped options into selectable entries", () => {
    render(
      <Select
        multiple
        placeholder="Pick"
        options={[
          {
            label: "Seoul",
            options: [
              { value: "line-2", label: "Line 2" },
              { value: "line-7", label: "Line 7" },
            ],
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Line 2" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Line 7" })).toBeInTheDocument();
  });

  it("keeps the placeholder after a multiselect selection is made", () => {
    render(<Select multiple options={options} placeholder="Pick" />);
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("option", { name: "Alpha" }));
    expect(trigger).toHaveTextContent("Pick");
  });

  it("forwards the title to the label", () => {
    render(<Select title="City" options={options} placeholder="Pick" />);
    expect(screen.getByText("City")).toBeInTheDocument();
  });
});
