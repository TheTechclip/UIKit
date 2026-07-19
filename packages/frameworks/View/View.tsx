import clsx from "clsx";
import { motion } from "motion/react";
import { type CSSProperties, forwardRef } from "react";
import Squircle from "../Squircle/Squircle";
import { resolvePadding } from "../shared/Padding.types";
import { Size } from "../shared/sizing";
import { Radius } from "../Theme/Radius.types";
import {
  BackgroundBlur,
  Border,
  resolveThemeClasses,
  resolveThemeHasBorder,
  Shadow,
} from "../Theme/Theme.types";
import DNDView from "./DNDView/DNDView";
import styles from "./View.module.scss";
import type { ViewProps } from "./View.types";

type ViewStyle = CSSProperties & {
  "--view-default-gap"?: string | number;
  "--view-mobile-order"?: string | number;
};

type ViewComponent = ReturnType<
  typeof forwardRef<HTMLDivElement, ViewProps>
> & {
  DND: typeof DNDView;
};

const ViewBase = forwardRef<HTMLDivElement, ViewProps>(function View(
  {
    children,
    themePreset,
    background,
    color,
    themeInteractive,
    selected,
    disabled,
    readOnly,
    border,
    className,
    style,
    alignItems,
    justifyContent,
    alignSelf,
    wrap,
    order,
    opacity,
    gridTemplateColumns,
    gridTemplateRows,
    gridAutoFlow,
    column,
    row,
    inline,
    gap,
    mobileStrict,
    mobileOrder,
    fullWidth,
    width,
    height,
    padding,
    paddingHorizontal,
    paddingVertical,
    margin,
    radius,
    sticky,
    top,
    bottom,
    backgroundBlur,
    shadow,
    motion: motionProps,
    "data-color-mode": dataColorMode,
    noSquircle,
    ...rest
  }: ViewProps,
  ref,
) {
  const isGrid = Boolean(
    gridTemplateColumns || gridTemplateRows || gridAutoFlow,
  );
  const defaultGap = 24;
  const resolvedDefaultGap = Size(defaultGap);
  const resolvedGap = gap === undefined ? undefined : Size(gap);

  const themeClasses = resolveThemeClasses({
    themePreset,
    background,
    color,
    shadow,
    themeInteractive,
    selected,
    disabled,
    readOnly,
    isInteractive: false,
  });

  const viewClassName = clsx(
    styles.View,
    ...themeClasses,
    Border(border),
    Shadow(shadow),
    BackgroundBlur(backgroundBlur),
    fullWidth && styles.FullWidth,
    mobileStrict && styles.MobileStrict,
    mobileOrder !== undefined && styles.MobileOrder,
    className,
  );

  const rootStyle: ViewStyle = {
    "--view-default-gap": resolvedDefaultGap,
    "--view-mobile-order": mobileOrder,
    alignSelf,
    order,
    ...(opacity !== undefined ? { opacity } : {}),
    width: Size(width),
    height: Size(height),
    padding: resolvePadding(padding, paddingHorizontal, paddingVertical),
    margin: Size(margin),
    borderRadius: Radius(radius),
    position: sticky ? "sticky" : undefined,
    top: sticky === true ? 0 : sticky ? Size(sticky) : Size(top),
    bottom: Size(bottom),
    ...style,
  };

  const layoutStyle: CSSProperties = {
    display: isGrid ? "grid" : inline ? "inline-flex" : "flex",
    alignItems,
    justifyContent,
    flexDirection: !isGrid && column ? "column" : row ? "row" : undefined,
    flexWrap: !isGrid ? wrap : undefined,
    gridTemplateColumns,
    gridTemplateRows,
    gridAutoFlow,
    gap: resolvedGap,
  };

  const hasRadius = Boolean(radius && radius !== "None");
  const hasBorder = resolveThemeHasBorder({ border, themePreset });
  const _hasShadow = Boolean(shadow && shadow !== "None");
  const isSquircle = hasRadius && !hasBorder && !noSquircle;

  if (isSquircle) {
    return (
      <Squircle
        ref={ref}
        radius={radius}
        motion={motionProps}
        data-color-mode={dataColorMode}
        {...rest}
        className={viewClassName}
        style={{
          ...layoutStyle,
          ...rootStyle,
        }}
      >
        {children}
      </Squircle>
    );
  }

  if (motionProps) {
    return (
      <motion.div
        ref={ref}
        data-color-mode={dataColorMode}
        {...(rest as any)}
        {...(motionProps as any)}
        className={viewClassName}
        style={{
          ...layoutStyle,
          ...rootStyle,
          ...motionProps.style,
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      ref={ref}
      data-color-mode={dataColorMode}
      {...rest}
      className={viewClassName}
      style={{
        ...layoutStyle,
        ...rootStyle,
      }}
    >
      {children}
    </div>
  );
});

const View = ViewBase as ViewComponent;
View.DND = DNDView;

export default View;
