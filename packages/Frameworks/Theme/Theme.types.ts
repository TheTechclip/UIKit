export type ThemePreset =
  | `${ThemeBaseColor}Full`
  | `${ThemeBaseColor}Soft`
  | `${ThemePaletteColor}Full`
  | `${ThemePaletteColor}Soft`
  | "UIPrimary"
  | "UISecondary"
  | "UIPrimaryReversed"
  | "UISecondaryReversed"
  | "ReversedUIPrimary"
  | "ReversedUISecondary";

export type ThemePaletteColor =
  | "Pink"
  | "Red"
  | "Brown"
  | "Orange"
  | "Yellow"
  | "Green"
  | "Mint"
  | "Cyan"
  | "Blue"
  | "Indigo"
  | "Purple"
  | "Magenta";

export type ThemeBaseColor = "Base" | "BaseLight" | "BaseDark" | "Reversed";
export type ThemeColorName = ThemeBaseColor | ThemePaletteColor;

export type ThemeLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ThemeTPScale = 1 | 2 | 3 | 4 | 5 | 6;

export type ThemePaint =
  | `${ThemeColorName}${ThemeLevel}`
  | `${ThemeColorName}${ThemeLevel}TP${ThemeTPScale}`;
export type ThemeBackgroundPaint =
  | ThemePaint
  | readonly [ThemePaint]
  | readonly [ThemePaint, ThemePaint, ThemePaint];
export type ThemeBorderWidth = "None" | "Light" | "Regular" | "Bold";

export type BlurScale =
  | "ExtraLight"
  | "Light"
  | "Regular"
  | "Bold"
  | "ExtraBold"
  | "Heavy";
export type BackgroundBlurValue = BlurScale | "None";
export type ThemeBorderWidthTuple =
  | readonly [ThemeBorderWidth]
  | readonly [ThemeBorderWidth, ThemeBorderWidth]
  | readonly [ThemeBorderWidth, ThemeBorderWidth, ThemeBorderWidth]
  | readonly [
      ThemeBorderWidth,
      ThemeBorderWidth,
      ThemeBorderWidth,
      ThemeBorderWidth,
    ];
export type ThemeBorderPaint =
  | "None"
  | ThemeBorderWidth
  | ThemeBorderWidthTuple
  | ThemePaint
  | readonly [ThemePaint, ThemeBorderWidth | ThemeBorderWidthTuple];

export type ShadowScale = "Light" | "Regular" | "Bold";
export type ThemeShadow = ShadowScale | "None";

export interface BorderProps {
  border?: ThemeBorderPaint;
}

export interface ThemeSystemProps {
  themePreset?: ThemePreset;
  background?: ThemeBackgroundPaint;
  color?: ThemePaint;
  border?: ThemeBorderPaint;
  shadow?: ThemeShadow;
  themeInteractive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  backgroundBlur?: BackgroundBlurValue;
}

const TOKEN_PATTERN =
  /^(BaseLight|BaseDark|Base|Reversed|Pink|Red|Brown|Orange|Yellow|Green|Mint|Cyan|Blue|Indigo|Purple|Magenta)([1-6])(?:TP([1-6]))?$/;

function resolvePaintClass(
  prefix: "ThemeBg" | "ThemeColor",
  paint?: ThemePaint,
) {
  if (!paint) return undefined;
  const match = TOKEN_PATTERN.exec(paint);
  if (!match) return undefined;

  const [, colorName, level, tp] = match;
  return `${prefix}-${colorName}${level}${tp ? `TP${tp}` : ""}`;
}

function isBorderWidth(value: unknown): value is ThemeBorderWidth {
  return (
    value === "None" ||
    value === "Light" ||
    value === "Regular" ||
    value === "Bold"
  );
}

const BLUR_MAP: Record<BlurScale, string> = {
  ExtraLight: "BackgroundBlur-ExtraLight",
  Light: "BackgroundBlur-Light",
  Regular: "BackgroundBlur-Regular",
  Bold: "BackgroundBlur-Bold",
  ExtraBold: "BackgroundBlur-ExtraBold",
  Heavy: "BackgroundBlur-Heavy",
};

const SHADOW_MAP: Record<ShadowScale, string> = {
  Light: "ThemeShadow-1",
  Regular: "ThemeShadow-2",
  Bold: "ThemeShadow-3",
};

export function Shadow(shadow?: ThemeShadow) {
  if (!shadow || shadow === "None") return undefined;
  return SHADOW_MAP[shadow];
}

export function BackgroundBlur(value?: BackgroundBlurValue) {
  if (!value || value === "None") return undefined;
  return BLUR_MAP[value];
}

export function Border(
  border?: ThemeBorderPaint,
  basePaint: ThemePaint = "Base6TP1",
) {
  if (!border) return undefined;
  if (border === "None") return `ThemeBorder-${basePaint}-None`;

  const [paint, widthValue] = Array.isArray(border)
    ? isBorderWidth(border[0])
      ? [basePaint, border]
      : border
    : isBorderWidth(border)
      ? [basePaint, border]
      : [border, "Regular"];
  const borderClass = resolvePaintClass("ThemeColor", paint);
  if (!borderClass) return undefined;

  const paintClass = borderClass.replace("ThemeColor-", "");
  if (!Array.isArray(widthValue)) {
    return `ThemeBorder-${paintClass}-${widthValue}`;
  }

  return widthValue
    .map((width, index) => `ThemeBorder${index + 1}-${paintClass}-${width}`)
    .join(" ");
}

function resolveBackgroundClasses(
  background?: ThemeBackgroundPaint,
  canBeInteractive?: boolean,
) {
  if (!background) return [];
  if (typeof background === "string") {
    const backgroundClass = resolvePaintClass("ThemeBg", background);
    return backgroundClass ? [backgroundClass] : [];
  }

  if (!Array.isArray(background)) return [];

  const [idle, hover, active] = background;
  const classes: string[] = [];
  const idleClass = resolvePaintClass("ThemeBg", idle);
  const hasForcedStates = background.length === 3 && canBeInteractive;
  const hoverClass = hasForcedStates
    ? resolvePaintClass("ThemeBg", hover)
    : undefined;
  const activeClass = hasForcedStates
    ? resolvePaintClass("ThemeBg", active)
    : undefined;

  if (idleClass) classes.push(idleClass);
  if (hoverClass) classes.push(hoverClass.replace("ThemeBg-", "ThemeBgHover-"));
  if (activeClass)
    classes.push(activeClass.replace("ThemeBg-", "ThemeBgActive-"));

  return classes;
}

type ResolvedPreset = {
  background: ThemeBackgroundPaint;
  color: ThemePaint;
};

const PRESET_PATTERN =
  /^(BaseLight|BaseDark|Base|Reversed|Pink|Red|Brown|Orange|Yellow|Green|Mint|Cyan|Blue|Indigo|Purple|Magenta)(Full|Soft)$/;

function resolvePreset(preset?: ThemePreset): ResolvedPreset | undefined {
  if (!preset) return undefined;

  if (preset === "UIPrimary") {
    return {
      background: ["Base1", "Base2", "Base3"],
      color: "Base1",
    };
  }

  if (preset === "UIPrimaryReversed" || preset === "ReversedUIPrimary") {
    return {
      background: ["Reversed1", "Reversed2", "Reversed3"],
      color: "Reversed1",
    };
  }

  if (preset === "UISecondary") {
    return {
      background: ["Base4", "Base5", "Base6"],
      color: "Base1",
    };
  }

  if (preset === "UISecondaryReversed" || preset === "ReversedUISecondary") {
    return {
      background: ["Reversed4", "Reversed5", "Reversed6"],
      color: "Reversed1",
    };
  }

  const match = PRESET_PATTERN.exec(preset);
  if (!match) return undefined;

  const colorName = match[1] as ThemeColorName;
  const tone = match[2] as "Full" | "Soft";

  if (tone === "Full") {
    const fullColor =
      colorName === "BaseDark" || !colorName.startsWith("Base")
        ? "BaseLight1"
        : "BaseDark1";

    return {
      background: [`${colorName}4TP1`, `${colorName}5TP1`, `${colorName}6TP1`],
      color: fullColor,
    };
  }

  return {
    background: [`${colorName}1TP6`, `${colorName}2TP6`, `${colorName}3TP6`],
    color: `${colorName}1TP1`,
  };
}

export function resolveThemeClasses(
  props: ThemeSystemProps & {
    selected?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    isInteractive?: boolean;
  },
) {
  const {
    themePreset,
    background,
    color,
    border,
    shadow,
    themeInteractive,
    selected,
    disabled,
    readOnly,
    isInteractive,
  } = props;

  const classes: string[] = [];

  const resolvedPreset = selected && !themePreset ? "UISecondary" : themePreset;
  const preset = resolvePreset(resolvedPreset);
  const resolvedBackground = background ?? preset?.background;
  const resolvedColor = color ?? preset?.color;
  const resolvedBorder = border;

  const canBeInteractive =
    (isInteractive || themeInteractive === true) && !disabled && !readOnly;
  const isThemeInteractiveActive = themeInteractive ?? isInteractive;

  const colorClass = resolvePaintClass("ThemeColor", resolvedColor);
  classes.push(
    ...resolveBackgroundClasses(resolvedBackground, canBeInteractive),
  );
  if (colorClass) classes.push(colorClass);
  if (resolvedBorder) classes.push(Border(resolvedBorder) ?? "");
  if (shadow) classes.push(Shadow(shadow) ?? "");

  if (canBeInteractive && isThemeInteractiveActive) {
    classes.push("ThemeInteractive");
  }

  if (disabled) {
    classes.push("ThemeDisabled");
  }

  if (readOnly) {
    classes.push("ThemeReadonly");
  }

  if (selected && themePreset) {
    classes.push("ThemeSelected");
  }

  return classes;
}

export function resolveThemeHasBorder(props: {
  border?: ThemeBorderPaint;
  themePreset?: ThemePreset;
}): boolean {
  const { border } = props;
  if (!border || border === "None") return false;
  return true;
}
