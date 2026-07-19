import type { IconProps } from "../Icon/Icon.types";

const DEFAULT_CARD_BOX_ICON_OUTER_SIZE = 40;

export function normalizeCardIcon(icon?: IconProps) {
  if (!icon) {
    return undefined;
  }

  const hasExplicitSize =
    icon.size !== undefined ||
    icon.width !== undefined ||
    icon.height !== undefined;
  const normalizedIcon =
    !icon.box && !hasExplicitSize
      ? {
          ...icon,
          size: 20,
        }
      : icon;

  if (!normalizedIcon.box || !normalizedIcon.image) return normalizedIcon;

  const hasDirectionalPadding =
    normalizedIcon.boxOptions?.paddingHorizontal !== undefined ||
    normalizedIcon.boxOptions?.paddingVertical !== undefined;
  if (hasDirectionalPadding) return normalizedIcon;

  const contentSize =
    typeof normalizedIcon.width === "number"
      ? normalizedIcon.width
      : typeof normalizedIcon.height === "number"
        ? normalizedIcon.height
        : typeof normalizedIcon.size === "number"
          ? normalizedIcon.size
          : 24;

  const shouldNormalizePadding =
    normalizedIcon.boxOptions?.padding === undefined;
  if (!shouldNormalizePadding) return normalizedIcon;

  return {
    ...normalizedIcon,
    boxOptions: {
      ...normalizedIcon.boxOptions,
      padding: Math.max(
        0,
        (DEFAULT_CARD_BOX_ICON_OUTER_SIZE - contentSize) / 2,
      ),
    },
  };
}

export const buildRenderKeys = <T>(
  items: T[],
  resolveBase: (item: T, index: number) => string,
): string[] => {
  const counts = new Map<string, number>();

  return items.map((item, index) => {
    const base = resolveBase(item, index) || "item";
    const nextCount = (counts.get(base) ?? 0) + 1;
    counts.set(base, nextCount);
    return `${base}-${nextCount}`;
  });
};
