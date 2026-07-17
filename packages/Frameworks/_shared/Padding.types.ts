import {
  Size,
  type UIKitSizeValue,
} from "./sizing";

type PaddingUnitValue = UIKitSizeValue;

export type PaddingValue =
  | PaddingUnitValue
  | readonly [PaddingUnitValue]
  | readonly [PaddingUnitValue, PaddingUnitValue]
  | readonly [PaddingUnitValue, PaddingUnitValue, PaddingUnitValue]
  | readonly [
      PaddingUnitValue,
      PaddingUnitValue,
      PaddingUnitValue,
      PaddingUnitValue,
    ];

export interface PaddingProps {
  padding?: PaddingValue;
  paddingHorizontal?: UIKitSizeValue;
  paddingVertical?: UIKitSizeValue;
}

function PaddingValue(
  padding?: PaddingValue,
): string | number | undefined {
  if (padding === undefined || padding === null) {
    return undefined;
  }

  if (Array.isArray(padding)) {
    return padding.map((value) => Size(value)).join(" ");
  }

  return Size(padding as UIKitSizeValue);
}

export function resolvePadding(
  padding?: PaddingValue,
  paddingHorizontal?: UIKitSizeValue,
  paddingVertical?: UIKitSizeValue,
): string | number | undefined {
  if (paddingHorizontal !== undefined || paddingVertical !== undefined) {
    const vertical = Size(paddingVertical);
    const horizontal = Size(paddingHorizontal);
    return `${vertical ?? 0} ${horizontal ?? 0}`;
  }

  return PaddingValue(padding);
}
