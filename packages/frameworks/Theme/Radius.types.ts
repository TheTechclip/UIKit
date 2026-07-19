import { Size, type UIKitSizeValue } from "../shared/sizing";

export type RadiusScale =
  | "None"
  | "ExtraLight"
  | "Light"
  | "Regular"
  | "Bold"
  | "ExtraBold"
  | "Heavy"
  | "Circle";
export type RadiusUnitValue = RadiusScale | UIKitSizeValue;
type RadiusArrayValue = RadiusUnitValue;

export type RadiusValue =
  | RadiusUnitValue
  | readonly [RadiusUnitValue]
  | readonly [RadiusArrayValue, RadiusArrayValue]
  | readonly [RadiusArrayValue, RadiusArrayValue, RadiusArrayValue]
  | readonly [
      RadiusArrayValue,
      RadiusArrayValue,
      RadiusArrayValue,
      RadiusArrayValue,
    ];
export interface RadiusProps {
  radius?: RadiusValue;
}

const RADIUS_TOKEN: Partial<Record<RadiusScale, string | number>> = {
  None: 0,
  ExtraLight: "var(--radius-system-extra-light)",
  Light: "var(--radius-system-light)",
  Regular: "var(--radius-system)",
  Bold: "var(--radius-system-bold)",
  ExtraBold: "var(--radius-system-extra-bold)",
  Heavy: "var(--radius-system-heavy)",
  Circle: "var(--radius-circle)",
};

export function Radius(radius?: RadiusValue): string | number | undefined {
  if (Array.isArray(radius)) {
    return radius.map((value) => Radius(value)).join(" ");
  }

  if (typeof radius === "string") {
    return RADIUS_TOKEN[radius as RadiusScale] ?? Size(radius);
  }
  if (typeof radius === "number") {
    return Size(radius);
  }
}
