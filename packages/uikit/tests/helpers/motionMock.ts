import React from "react";

const PRESERVED_PROPS = ["className", "role", "id", "style", "key"];

export function createMotionMock() {
  const motion = new Proxy(
    {},
    {
      get: (_, tag: string) => {
        const MotionComponent = React.forwardRef(
          ({ children, ...props }: any, ref: any) => {
            const filteredProps = Object.entries(props).reduce(
              (acc: Record<string, unknown>, [key, value]) => {
                if (
                  typeof value === "string" &&
                  (key.startsWith("data-") || PRESERVED_PROPS.includes(key))
                ) {
                  acc[key] = value;
                } else if (
                  !PRESERVED_PROPS.includes(key) &&
                  !key.startsWith("aria-") &&
                  !key.startsWith("data-")
                ) {
                  acc[`data-${key.toLowerCase()}`] =
                    typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value ?? "");
                } else {
                  acc[key] = value;
                }
                return acc;
              },
              {} as Record<string, unknown>,
            );

            return React.createElement(
              tag,
              { ...filteredProps, ref },
              children,
            );
          },
        );
        MotionComponent.displayName = `motion.${tag}`;
        return MotionComponent;
      },
    },
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        "div",
        { "data-testid": "animate-presence" },
        children,
      ),
    useAnimationControls: () => ({ start: vi.fn() }),
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: vi.fn(),
      on: vi.fn(),
    }),
    useTransform: (value: any, _input: number[], output: number[]) => ({
      get: () => output[0] ?? 0,
      onChange: vi.fn(),
    }),
    useSpring: (value: any) => ({
      get: () => 0,
      set: vi.fn(),
    }),
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useMotionTemplate: (...args: any[]) => String(args[0] ?? ""),
    useWillChange: () => ({ add: vi.fn(), remove: vi.fn() }),
    usePresence: () => [true, vi.fn()],
    useIsPresent: () => true,
    MotionConfig: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", null, children),
    LayoutGroup: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", null, children),
    Reorder: {
      Group: ({ children }: { children: React.ReactNode }) =>
        React.createElement("div", null, children),
      Item: ({ children }: { children: React.ReactNode }) =>
        React.createElement("div", null, children),
    },
  };
}
