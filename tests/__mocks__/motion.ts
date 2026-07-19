import React from "react";

const PRESERVED_PROPS = ["className", "role", "id", "style", "key"];
type MotionMockProps = React.HTMLAttributes<HTMLElement>;

export const motion = new Proxy(
  {},
  {
    get: (_, tag: string) => {
      const MotionComponent = React.forwardRef(
        ({ children, ...props }: MotionMockProps, ref) => {
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

          return React.createElement(tag, { ...filteredProps, ref }, children);
        },
      );
      MotionComponent.displayName = `motion.${tag}`;
      return MotionComponent;
    },
  },
);

export const AnimatePresence = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "animate-presence" }, children);

export const useAnimationControls = () => ({ start: () => {} });
export const useMotionValue = (initial: number) => ({
  get: () => initial,
  set: () => {},
});
export const useTransform = (
  _value: unknown,
  _input: number[],
  output: number[],
) => ({ get: () => output[0] ?? 0 });
