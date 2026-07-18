"use client";

import { getSvgPath } from "figma-squircle";
import { motion } from "motion/react";
import {
  forwardRef,
  type Ref,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getComputedPixelValue,
  SizePX,
} from "../_shared/sizing";
import type { SquircleProps } from "./Squircle.types";
import { Radius as resolveRadius } from "../Theme/Radius.types";

function resolveCornerRadius(
  radius: SquircleProps["radius"],
  fallback: number,
) {
  if (Array.isArray(radius)) return undefined;
  if (typeof radius === "number") return SizePX(radius, fallback);
  if (typeof radius === "string") return SizePX(radius, fallback);
  return fallback;
}

function resolveCornerRadiusValue(
  radius: SquircleProps["radius"],
  fallback: number,
) {
  return resolveCornerRadius(radius, fallback) ?? fallback;
}

function resolveCornerRadii(radius: SquircleProps["radius"], fallback: number) {
  if (!Array.isArray(radius)) {
    const value = resolveCornerRadiusValue(radius, fallback);

    return {
      topLeft: value,
      topRight: value,
      bottomRight: value,
      bottomLeft: value,
    };
  }

  const topLeft = resolveCornerRadiusValue(radius[0], fallback);
  const topRight = resolveCornerRadiusValue(radius[1] ?? radius[0], fallback);
  const bottomRight = resolveCornerRadiusValue(
    radius[2] ?? radius[0],
    fallback,
  );
  const bottomLeft = resolveCornerRadiusValue(
    radius[3] ?? radius[1] ?? radius[0],
    fallback,
  );

  return {
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
  };
}

function resolvePathCornerRadius(
  cornerRadius: number | undefined,
  computedCornerRadius: number | undefined,
  fallbackCornerRadius: number,
) {
  return cornerRadius ?? computedCornerRadius ?? fallbackCornerRadius;
}

function setRef(ref: Ref<HTMLElement> | undefined, value: HTMLElement | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  (ref as any).current = value;
}

function getElementSize(
  element: HTMLElement,
  defaultWidth?: number,
  defaultHeight?: number,
) {
  const rect = element.getBoundingClientRect();

  return {
    width:
      element.offsetWidth ||
      element.clientWidth ||
      element.scrollWidth ||
      rect.width ||
      defaultWidth ||
      0,
    height:
      element.offsetHeight ||
      element.clientHeight ||
      element.scrollHeight ||
      rect.height ||
      defaultHeight ||
      0,
  };
}

const Squircle = forwardRef<HTMLElement, SquircleProps>(function Squircle(
  {
    as: Component = "div",
    radius,
    cornerRadius,
    cornerSmoothing,
    defaultWidth,
    defaultHeight,
    preserveSmoothing,
    motion: motionProps,
    children,
    style,
    ...props
  },
  ref,
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [size, setSize] = useState({
    width: defaultWidth ?? 0,
    height: defaultHeight ?? 0,
  });
  const [computedCornerRadius, setComputedCornerRadius] = useState<{
    topLeft?: number;
    topRight?: number;
    bottomRight?: number;
    bottomLeft?: number;
  }>({});

  const resolvedRadius = resolveRadius(radius);
  const _fallbackCornerRadius = resolveCornerRadius(radius, 8) ?? 8;
  const fallbackCornerRadii = resolveCornerRadii(radius, 8);
  const resolvedCornerRadii = {
    topLeft: resolvePathCornerRadius(
      cornerRadius,
      computedCornerRadius.topLeft,
      fallbackCornerRadii.topLeft,
    ),
    topRight: resolvePathCornerRadius(
      cornerRadius,
      computedCornerRadius.topRight,
      fallbackCornerRadii.topRight,
    ),
    bottomRight: resolvePathCornerRadius(
      cornerRadius,
      computedCornerRadius.bottomRight,
      fallbackCornerRadii.bottomRight,
    ),
    bottomLeft: resolvePathCornerRadius(
      cornerRadius,
      computedCornerRadius.bottomLeft,
      fallbackCornerRadii.bottomLeft,
    ),
  };
  const setElementRef = useCallback(
    (element: HTMLElement | null) => {
      elementRef.current = element;
      setRef(ref, element);
    },
    [ref],
  );

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateSize = () => {
      setSize(getElementSize(element, defaultWidth, defaultHeight));
      setComputedCornerRadius({
        topLeft: getComputedPixelValue(element, "borderTopLeftRadius") ?? 0,
        topRight: getComputedPixelValue(element, "borderTopRightRadius") ?? 0,
        bottomRight:
          getComputedPixelValue(element, "borderBottomRightRadius") ?? 0,
        bottomLeft:
          getComputedPixelValue(element, "borderBottomLeftRadius") ?? 0,
      });
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [defaultHeight, defaultWidth]);

  const clipPath =
    size.width && size.height
      ? `path('${getSvgPath({
          width: size.width,
          height: size.height,
          topLeftCornerRadius: resolvedCornerRadii.topLeft,
          topRightCornerRadius: resolvedCornerRadii.topRight,
          bottomRightCornerRadius: resolvedCornerRadii.bottomRight,
          bottomLeftCornerRadius: resolvedCornerRadii.bottomLeft,
          cornerSmoothing: 0.6,
          preserveSmoothing,
        })}')`
      : undefined;

  const motionEnabled = Boolean(motionProps);
  const MotionElement = useMemo(() => {
    if (!motionEnabled) return null;
    if (typeof Component === "string") return (motion as any)[Component];
    return motion.create(Component);
  }, [Component, motionEnabled]);

  const {
    background,
    backgroundColor,
    backdropFilter,
    WebkitBackdropFilter,
    ...restStyle
  } = style || {};

  const sharedStyle = {
    borderRadius: resolvedRadius ?? resolvedCornerRadii.topLeft,
    "--squircle-clip": clipPath,
    ...(background !== undefined ? { "--theme-bg": background } : {}),
    ...(backgroundColor !== undefined ? { "--theme-bg": backgroundColor } : {}),
    ...(backdropFilter !== undefined
      ? { "--theme-backdrop-filter": backdropFilter }
      : {}),
    ...(WebkitBackdropFilter !== undefined
      ? { "--theme-backdrop-filter": WebkitBackdropFilter }
      : {}),
    ...restStyle,
  } as any;

  if (MotionElement) {
    return (
      <MotionElement
        {...(motionProps as any)}
        {...(props as any)}
        ref={setElementRef as any}
        data-squircle={resolvedCornerRadii.topLeft}
        style={sharedStyle}
      >
        {children}
      </MotionElement>
    );
  }

  return (
    <Component
      {...props}
      ref={setElementRef as any}
      data-squircle={resolvedCornerRadii.topLeft}
      style={sharedStyle}
    >
      {children}
    </Component>
  );
});

export default Squircle;
