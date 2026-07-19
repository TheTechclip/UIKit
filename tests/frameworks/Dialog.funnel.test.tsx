import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Dialog from "../../packages/frameworks/Dialog/Dialog";
import type { DialogFunnelProp } from "../../packages/frameworks/Dialog/funnel/DialogFunnel.types";
import DialogFunnelShell from "../../packages/frameworks/Dialog/funnel/DialogFunnelShell";
import { useDialogFunnel } from "../../packages/frameworks/Dialog/funnel/useDialogFunnel";

type TestSteps = {
  Start: { value?: string };
  Hidden: { value?: string };
  Confirm: { value?: string };
};

function StatefulStart({
  value,
  setContext,
  history,
}: {
  value?: string;
  setContext: (patch: { value: string }) => void;
  history: {
    push: (
      step: "Confirm",
      context: { value: string },
    ) => Promise<{ value?: string }>;
  };
}) {
  const [count, setCount] = useState(0);
  return (
    <>
      <output data-testid="value">{value ?? "empty"}</output>
      <output data-testid="local-count">{count}</output>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        increment local state
      </button>
      <button type="button" onClick={() => setContext({ value: "saved" })}>
        save context
      </button>
      <button
        type="button"
        onClick={() => history.push("Confirm", { value: "branched" })}
      >
        branch to confirm
      </button>
    </>
  );
}

function FunnelHarness({
  id,
  validate,
  onFinish,
}: {
  id: string;
  validate?: boolean;
  onFinish?: () => void;
}) {
  const funnel = useDialogFunnel<TestSteps>({
    id,
    initial: { step: "Start", context: {} },
    steps: {
      Start: {
        validate: validate ? () => "Enter a value first" : undefined,
        render: ({ context, setContext, history }) => (
          <StatefulStart
            value={context.value}
            setContext={setContext}
            history={history}
          />
        ),
      },
      Hidden: { hidden: true, render: () => <div>hidden step</div> },
      Confirm: {
        render: ({ context }) => (
          <output data-testid="confirm">{context.value}</output>
        ),
      },
    },
    onFinish,
  });

  return (
    <>
      <output data-testid="step">{funnel.current.name}</output>
      <output data-testid="position">
        {funnel.current.index}/{funnel.current.total}/
        {String(funnel.current.isLast)}
      </output>
      <output data-testid="validation-error">{funnel.error ?? ""}</output>
      <button type="button" onClick={() => void funnel.advance()}>
        advance
      </button>
      <funnel.Content />
    </>
  );
}

function createFunnel(
  overrides: Partial<DialogFunnelProp> = {},
): DialogFunnelProp {
  return {
    id: "stable-funnel",
    Content: () => <div>content</div>,
    current: {
      name: "Start",
      index: 0,
      total: 2,
      isFirst: true,
      isLast: false,
      nextDisabled: false,
      meta: {},
    },
    error: null,
    goBack: vi.fn(),
    advance: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("useDialogFunnel", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("preserves the active step component while context is replaced", async () => {
    render(<FunnelHarness id="preserve-context" />);

    fireEvent.click(
      screen.getByRole("button", { name: "increment local state" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "save context" }));

    await waitFor(() =>
      expect(screen.getByTestId("value")).toHaveTextContent("saved"),
    );
    expect(screen.getByTestId("local-count")).toHaveTextContent("1");
  });

  it("uses declared step order after an explicit branch, not history position", async () => {
    const onFinish = vi.fn();
    render(<FunnelHarness id="branch-order" onFinish={onFinish} />);

    fireEvent.click(screen.getByRole("button", { name: "branch to confirm" }));
    await waitFor(() =>
      expect(screen.getByTestId("step")).toHaveTextContent("Confirm"),
    );
    expect(screen.getByTestId("position")).toHaveTextContent("1/2/true");

    fireEvent.click(screen.getByRole("button", { name: "advance" }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("confirm")).toHaveTextContent("branched");
  });

  it("skips hidden steps during default forward navigation", async () => {
    render(<FunnelHarness id="skip-hidden" />);

    fireEvent.click(screen.getByRole("button", { name: "advance" }));
    await waitFor(() =>
      expect(screen.getByTestId("step")).toHaveTextContent("Confirm"),
    );
    expect(screen.queryByText("hidden step")).not.toBeInTheDocument();
  });

  it("keeps the user on the step and exposes validation failures", async () => {
    render(<FunnelHarness id="validation" validate />);

    fireEvent.click(screen.getByRole("button", { name: "advance" }));
    await waitFor(() =>
      expect(screen.getByTestId("validation-error")).toHaveTextContent(
        "Enter a value first",
      ),
    );
    expect(screen.getByTestId("step")).toHaveTextContent("Start");
  });
});

describe("DialogFunnelShell", () => {
  it("passes behavior and disabled state to a custom navigation renderer", () => {
    const advance = vi.fn().mockResolvedValue(undefined);
    const customNext = vi.fn(({ onClick, disabled }) => (
      <button type="button" disabled={disabled} onClick={onClick}>
        custom next
      </button>
    ));
    const funnel = createFunnel({
      loading: true,
      advance,
      navigation: { next: customNext },
    });

    render(
      <DialogFunnelShell funnel={funnel} onClose={vi.fn()} isMobile={false} />,
    );

    expect(screen.getByRole("button", { name: "custom next" })).toBeDisabled();
    expect(customNext).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true }),
    );
    fireEvent.click(screen.getByRole("button", { name: "custom next" }));
    expect(advance).not.toHaveBeenCalled();
  });

  it("prevents concurrent next actions while an async transition is pending", async () => {
    let resolveAdvance: (() => void) | undefined;
    const advance = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAdvance = resolve;
        }),
    );
    const funnel = createFunnel({ advance });
    render(
      <DialogFunnelShell funnel={funnel} onClose={vi.fn()} isMobile={false} />,
    );

    const next = screen.getByRole("button", { name: "다음" });
    fireEvent.click(next);
    fireEvent.click(next);
    expect(advance).toHaveBeenCalledTimes(1);

    await act(async () => resolveAdvance?.());
    await waitFor(() => expect(next).not.toBeDisabled());
  });

  it("renders the external loading state as a disabled pending action", () => {
    render(
      <DialogFunnelShell
        funnel={createFunnel({ loading: true })}
        onClose={vi.fn()}
        isMobile={false}
      />,
    );

    expect(screen.getByRole("button", { name: "처리 중.." })).toBeDisabled();
  });

  it("honors the Dialog exit confirmation before closing a funnel", () => {
    const onOpenChange = vi.fn();
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    const funnel = createFunnel({
      current: {
        ...createFunnel().current,
        isLast: true,
      },
    });

    render(
      <Dialog
        mode="modal"
        open
        onOpenChange={onOpenChange}
        exit={{ confirm: { title: "Leave?" } }}
        funnel={funnel}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(confirm).toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
