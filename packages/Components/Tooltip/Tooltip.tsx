"use client";

import clsx from "clsx";
import {
  type CSSProperties,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./Tooltip.module.scss";
import type {
  TooltipPlacement,
  TooltipProps,
} from "./Tooltip.types";
import View from "../../Frameworks/View/View";

const TOOLTIP_GAP = 8;
const TOOLTIP_MARGIN = 4;

function getOppositePlacement(placement: TooltipPlacement): TooltipPlacement {
  const side = getBaseSide(placement);
  const align = placement.includes("-")
    ? (`-${placement.split("-")[1]}` as string)
    : "";
  const opposite = side === "top" ? "bottom" : "top";
  return `${opposite}${align}` as TooltipPlacement;
}

interface ClampShift {
  x: number;
  y: number;
}

function computeClampShift(
  placement: TooltipPlacement,
  wrapperRect: DOMRect,
  bubbleW: number,
  bubbleH: number,
  vw: number,
  vh: number,
): ClampShift {
  const side = getBaseSide(placement);
  const start = placement.endsWith("-start");
  const end = placement.endsWith("-end");

  let idealLeft: number;
  const idealTop =
    side === "top"
      ? wrapperRect.top - TOOLTIP_GAP - bubbleH
      : wrapperRect.bottom + TOOLTIP_GAP;

  if (start) idealLeft = wrapperRect.left;
  else if (end) idealLeft = wrapperRect.right - bubbleW;
  else idealLeft = wrapperRect.left + wrapperRect.width / 2 - bubbleW / 2;

  const minLeft = TOOLTIP_MARGIN;
  const maxLeft = vw - TOOLTIP_MARGIN - bubbleW;
  const minTop = TOOLTIP_MARGIN;
  const maxTop = vh - TOOLTIP_MARGIN - bubbleH;

  const clampedLeft = Math.max(minLeft, Math.min(maxLeft, idealLeft));
  const clampedTop = Math.max(minTop, Math.min(maxTop, idealTop));

  return { x: clampedLeft - idealLeft, y: clampedTop - idealTop };
}

const FOCUSABLE_TAGS = new Set([
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "summary",
]);

function isTriggerFocusable(trigger: React.ReactNode): boolean {
  if (!isValidElement(trigger)) return false;
  const tag = trigger.type;
  if (typeof tag === "string" && FOCUSABLE_TAGS.has(tag)) return true;
  const props = trigger.props as {
    tabIndex?: number;
    onClick?: unknown;
  } | null;
  if (props && (props.tabIndex !== undefined || props.onClick !== undefined)) {
    return true;
  }
  return false;
}

function getBaseSide(placement: TooltipPlacement): "top" | "bottom" {
  return placement.split("-")[0] as "top" | "bottom";
}

function computePlacementStyle(placement: TooltipPlacement): CSSProperties {
  const offset = `calc(100% + ${TOOLTIP_GAP}px)`;
  const start = placement.endsWith("-start");
  const end = placement.endsWith("-end");

  if (getBaseSide(placement) === "top") {
    return {
      bottom: offset,
      left: start ? 0 : end ? undefined : "50%",
      right: end ? 0 : undefined,
      transform: start || end ? undefined : "translateX(-50%)",
    };
  }
  return {
    top: offset,
    left: start ? 0 : end ? undefined : "50%",
    right: end ? 0 : undefined,
    transform: start || end ? undefined : "translateX(-50%)",
  };
}

const Tooltip = memo(function Tooltip({
  trigger,
  content,
  placement = "top",
  open,
  defaultOpen = false,
  onOpenChange,
  delay = 200,
  disabled = false,
  interactive = false,
  flip = true,
  className,
  contentClassName,
  maxWidth = 280,
  themePreset,
  background = "Base1",
  color = "Base6",
  radius = "Regular",
  border = "None",
  "data-color-mode": dataColorMode,
}: TooltipProps) {
  const contentId = useId();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(open) : internalOpen;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [effectivePlacement, setEffectivePlacement] =
    useState<TooltipPlacement>(placement);
  const [clampShift, setClampShift] = useState<ClampShift>({ x: 0, y: 0 });

  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if ((isControlled ? Boolean(open) : internalOpen) === next) return;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, open, internalOpen, onOpenChange],
  );

  useEffect(() => {
    return () => {
      clearTimeout(openTimer.current ?? undefined);
      clearTimeout(closeTimer.current ?? undefined);
    };
  }, []);

  const scheduleOpen = useCallback(() => {
    if (disabled) return;
    clearTimeout(closeTimer.current ?? undefined);
    openTimer.current = window.setTimeout(() => setOpen(true), delay);
  }, [disabled, delay, setOpen]);

  const scheduleClose = useCallback(() => {
    clearTimeout(openTimer.current ?? undefined);
    if (interactive) {
      closeTimer.current = window.setTimeout(() => setOpen(false), 120);
    } else {
      setOpen(false);
    }
  }, [interactive, setOpen]);

  const toggle = useCallback(() => {
    if (disabled) return;
    setOpen(!isOpen);
  }, [disabled, isOpen, setOpen]);

  const resolvePlacement = useCallback(() => {
    const wrapperEl = wrapperRef.current;
    const bubbleEl = bubbleRef.current;
    if (!wrapperEl || !bubbleEl) return placement;

    const rect = wrapperEl.getBoundingClientRect();
    const bubbleHeight = bubbleEl.offsetHeight;
    const _bubbleWidth = bubbleEl.offsetWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const _vw = window.visualViewport?.width ?? window.innerWidth;

    const fits = (side: "top" | "bottom") => {
      if (side === "top")
        return rect.top - TOOLTIP_GAP - bubbleHeight >= TOOLTIP_MARGIN;
      return rect.bottom + TOOLTIP_GAP + bubbleHeight <= vh - TOOLTIP_MARGIN;
    };

    const preferred = placement;
    if (flip && !fits(getBaseSide(preferred))) {
      const flipped = getOppositePlacement(preferred);
      if (fits(getBaseSide(flipped))) return flipped;
      return flipped;
    }
    return preferred;
  }, [placement, flip]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const apply = () => setEffectivePlacement(resolvePlacement());
    apply();

    window.addEventListener("resize", apply);
    window.addEventListener("scroll", apply, true);
    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("scroll", apply, true);
    };
  }, [isOpen, resolvePlacement]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const wrapperEl = wrapperRef.current;
    const bubbleEl = bubbleRef.current;
    if (!wrapperEl || !bubbleEl) return;

    const rect = wrapperEl.getBoundingClientRect();
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const vw = window.visualViewport?.width ?? window.innerWidth;
    setClampShift(
      computeClampShift(
        effectivePlacement,
        rect,
        bubbleEl.offsetWidth,
        bubbleEl.offsetHeight,
        vw,
        vh,
      ),
    );
  }, [isOpen, effectivePlacement]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
      }
    },
    [isOpen, setOpen],
  );

  const bubbleFocusable = isTriggerFocusable(trigger);

  const placementStyle = computePlacementStyle(effectivePlacement);
  const arrowClass =
    styles[`Arrow_${getBaseSide(effectivePlacement)}` as keyof typeof styles];

  const clampTransform =
    clampShift.x === 0 && clampShift.y === 0
      ? undefined
      : `translate(${clampShift.x}px, ${clampShift.y}px)`;

  const bubbleStyle: CSSProperties = {
    ...placementStyle,
    ...(clampTransform
      ? {
          transform: placementStyle.transform
            ? `${placementStyle.transform} ${clampTransform}`
            : clampTransform,
        }
      : null),
  };

  return (
    <View
      ref={wrapperRef}
      className={clsx(styles.Wrapper, className)}
      data-color-mode={dataColorMode}
      data-tooltip-open={isOpen ? "" : undefined}
      tabIndex={bubbleFocusable ? undefined : 0}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={scheduleOpen}
      onBlur={scheduleClose}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      aria-describedby={isOpen ? contentId : undefined}
    >
      {trigger}
      <View
        ref={bubbleRef}
        id={contentId}
        role="tooltip"
        radius={radius}
        noSquircle
        themePreset={themePreset}
        background={background}
        color={color}
        border={border}
        className={clsx(
          styles.Bubble,
          !isOpen && styles.BubbleClosed,
          contentClassName,
        )}
        padding={[6, 8]}
        style={{
          width: "max-content",
          ...bubbleStyle,
          maxWidth,
          zIndex: 1300,
        }}
        onMouseEnter={() => clearTimeout(closeTimer.current ?? undefined)}
        onMouseLeave={scheduleClose}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
        <span
          className={clsx(styles.Arrow, arrowClass)}
          aria-hidden
          style={{
            ["--tooltip-clamp-x" as string]: `${clampShift.x}px`,
            ["--tooltip-clamp-y" as string]: `${clampShift.y}px`,
          }}
        />
      </View>
    </View>
  );
});

Tooltip.displayName = "Tooltip";

export default Tooltip;
