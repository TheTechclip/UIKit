export type UIKitSizeValue = number | string;

function normalizeNumericSize(value: number) {
  const remValue = value / 10;
  return `${Number.isInteger(remValue) ? remValue.toFixed(0) : remValue}rem`;
}

export function Size(value?: UIKitSizeValue | null) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return normalizeNumericSize(value);
  }

  return value;
}

export function SizePX(
  value: UIKitSizeValue | undefined,
  fallback: number,
  rootFontSize = 16,
) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value * 0.1 * rootFontSize;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    const numeric = parsePixelValue(normalized);

    if (numeric === undefined) return fallback;
    if (normalized.endsWith("px")) return numeric;
    if (normalized.endsWith("rem")) return numeric * rootFontSize;
  }

  return fallback;
}

function parsePixelValue(value?: string | null) {
  if (!value) return undefined;

  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return undefined;

  return numeric;
}

export function getComputedPixelValue(
  element: Element,
  property: keyof CSSStyleDeclaration,
) {
  return parsePixelValue(window.getComputedStyle(element)[property] as string);
}
