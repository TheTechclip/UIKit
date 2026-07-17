"use client";

import clsx from "clsx";
import { animate, useMotionValue } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInBoxContent } from "../Box/Box";
import styles from "./Card.module.scss";
import type { CardFoldableProps } from "./Card.types";
import { resolveState } from "./Card.types";
import { buildRenderKeys } from "./Card.utils";
import Icon from "../Icon/Icon";
import Pill from "../Pill/Pill";
import Text from "../Text/Text";
import { normalizeCardIcon } from "./Card.utils";
import StopParentInteraction from "../../Frameworks/_shared/StopParentInteraction";
import {
  getComputedPixelValue,
  SizePX,
  type UIKitSizeValue,
} from "../../Frameworks/_shared/sizing";
import Pressable from "../../Frameworks/Pressable/Pressable";
import type { RadiusValue } from "../../Frameworks/Theme/Radius.types";
import View from "../../Frameworks/View/View";

function useFoldProgress(
  activated: boolean,
  enabled: boolean,
  duration = 0.28,
) {
  const [progress, setProgress] = useState(activated ? 1 : 0);
  const mv = useMotionValue(activated ? 1 : 0);

  useEffect(() => {
    if (!enabled) {
      setProgress(activated ? 1 : 0);
      return;
    }
    const controls = animate(mv, activated ? 1 : 0, {
      duration,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (value) => setProgress(value),
    });
    return () => controls.stop();
  }, [activated, enabled, duration, mv]);

  return enabled ? progress : activated ? 1 : 0;
}

const CARD_ACCORDION_EVENT = "uikit-card-accordion-change";

type RadiusTupleValue = Extract<RadiusValue, readonly unknown[]>;

const isRadiusArrayValue = (radius: RadiusValue): radius is RadiusTupleValue =>
  Array.isArray(radius);

const resolveFoldableHeaderRadius = (
  radius: RadiusValue | undefined,
  activated: boolean,
): RadiusValue => {
  if (!activated) return radius ?? "Regular";
  if (!radius) return ["Regular", "Regular", "None", "None"];

  if (isRadiusArrayValue(radius)) {
    return [radius[0] ?? "Regular", radius[1] ?? radius[0], "None", "None"];
  }

  return [radius, radius, "None", "None"];
};

const resolveFoldableBodyRadius = (
  radius: RadiusValue | undefined,
): RadiusValue => {
  if (!radius) return ["None", "None", "Regular", "Regular"];

  if (isRadiusArrayValue(radius)) {
    return [
      "None",
      "None",
      radius[2] ?? radius[0] ?? "Regular",
      radius[3] ?? radius[1] ?? radius[0] ?? "Regular",
    ];
  }

  return ["None", "None", radius, radius];
};

export default function CardFoldable({
  themePreset,
  background,
  color,
  border,
  shadow,
  contained,
  radius,
  pressable,
  style,
  className,
  title,
  caption,
  icon,
  arrow,
  pill,
  customRight,
  customRightAllowDefault,
  accordion,
  children,
  "data-color-mode": dataTheme,
}: CardFoldableProps) {
  const shouldBlockHostDefault = Boolean(pressable) && !customRightAllowDefault;
  const inBoxContent = useInBoxContent();
  const resolvedContained = contained ?? !inBoxContent;
  const resolvedIcon = normalizeCardIcon(icon);
  const pillItems = Array.isArray(pill) ? pill : pill ? [pill] : [];
  const pillKeys = buildRenderKeys(
    pillItems,
    (pillItem, index) =>
      pillItem.renderKey ||
      [
        pillItem.pressable?.href,
        pillItem.icon?.icon,
        pillItem.icon?.svg,
        pillItem.rightIcon?.icon,
        index,
      ]
        .filter(Boolean)
        .join("-"),
  );

  const [activated, setActivated] = useState(
    accordion.activated ?? accordion.defaultActivated ?? false,
  );
  const {
    name: accordionName,
    value: accordionValue,
    onActivatedChange,
  } = accordion;
  const animateRadius = accordion.animateRadius ?? true;

  const {
    disabled: pressableDisabled,
    onClick: pressableOnClick,
    ...restPressable
  } = pressable ?? {};
  const isInteractionDisabled = Boolean(pressableDisabled);

  const headerRef = useRef<HTMLElement | null>(null);
  const [_measuredR, setMeasuredR] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!animateRadius || !headerRef.current) return;
    const val = getComputedPixelValue(headerRef.current, "borderTopLeftRadius");
    if (val !== undefined && val > 0) setMeasuredR(val);
  }, [animateRadius]);

  useEffect(() => {
    if (accordion.activated === undefined) return;
    setActivated(accordion.activated);
  }, [accordion.activated]);

  useEffect(() => {
    const { name, value, onActivatedChange } = accordion;
    if (!name || !value) return;

    const handleAccordionChange = (event: Event) => {
      const detail =
        (
          event as CustomEvent<{
            name?: string;
            value?: string;
          }>
        ).detail ?? {};

      if (detail.name !== name || detail.value === value) return;

      queueMicrotask(() => {
        setActivated(false);
        onActivatedChange?.(false);
      });
    };

    window.addEventListener(CARD_ACCORDION_EVENT, handleAccordionChange);
    return () => {
      window.removeEventListener(CARD_ACCORDION_EVENT, handleAccordionChange);
    };
  }, [accordion]);

  const resolvedTitle = resolveState(title, activated);
  const resolvedCaption = resolveState(caption, activated);
  const resolvedThemePreset = resolveState(themePreset, activated);
  const showCaption = Boolean(resolvedCaption);
  const showTitleGroup = Boolean(resolvedTitle) || showCaption;

  const progress = useFoldProgress(activated, animateRadius);

  const radiusUnit = isRadiusArrayValue(radius ?? "Regular")
    ? (radius as RadiusTupleValue)[0]
    : (radius as UIKitSizeValue | undefined);
  const cornerUnit = SizePX(radiusUnit as UIKitSizeValue | undefined, 8);
  const _headerRadius: RadiusValue = animateRadius
    ? ([
        cornerUnit,
        cornerUnit,
        cornerUnit * (1 - progress),
        cornerUnit * (1 - progress),
      ] as RadiusValue)
    : resolveFoldableHeaderRadius(radius, activated);
  const _bodyRadius = resolveFoldableBodyRadius(radius);

  const handleToggle = (event: React.MouseEvent) => {
    pressableOnClick?.(event);
    if (isInteractionDisabled) return;

    setActivated((prev) => {
      const nextActivated = !prev;
      onActivatedChange?.(nextActivated);

      if (nextActivated && accordionName && accordionValue) {
        window.dispatchEvent(
          new CustomEvent(CARD_ACCORDION_EVENT, {
            detail: {
              name: accordionName,
              value: accordionValue,
            },
          }),
        );
      }

      return nextActivated;
    });
  };

  return (
    <View
      column
      gap={0}
      data-color-mode={dataTheme}
      radius={radius ?? "Regular"}
      themePreset={
        resolveState(themePreset, activated) ??
        (activated ? "BaseFull" : "UIPrimary")
      }
      background={resolveState(background, activated)}
      color={resolveState(color, activated)}
      selected={activated}
      disabled={isInteractionDisabled}
      border={border}
      shadow={shadow}
      style={{ overflow: "hidden" }}
    >
      {}
      <Pressable
        gap={12}
        alignItems="center"
        justifyContent="space-between"
        data-color-mode={dataTheme}
        {...restPressable}
        onClick={handleToggle}
        fullWidth
        className={clsx(
          styles.Card,
          resolvedContained && styles.Contained,
          className,
        )}
        style={style}
      >
        <View gap={12} fullWidth style={{ minWidth: 0 }}>
          {resolvedIcon && <Icon {...resolvedIcon} />}
          {showTitleGroup && (
            <View column justifyContent="center" gap={2} fullWidth>
              {resolvedTitle && (
                <Text type="Subheadline" weight={500}>
                  {resolvedTitle}
                </Text>
              )}
              {showCaption && (
                <Text type="Footnote" opacity={0.6}>
                  {resolvedCaption}
                </Text>
              )}
            </View>
          )}
        </View>

        <View gap={8}>
          {pillItems.length > 0 && (
            <StopParentInteraction
              alignItems="center"
              gap={6}
              style={{ width: "max-content", maxWidth: "100%" }}
              blockDefault={shouldBlockHostDefault}
              data-stop-parent-interaction-state
            >
              {pillItems.map((pillItem, index) => (
                <Pill
                  key={pillKeys[index]}
                  themePreset={
                    pillItem.themePreset ? resolvedThemePreset : "BaseFull"
                  }
                  padding={8}
                  {...pillItem}
                />
              ))}
            </StopParentInteraction>
          )}
          {customRight && (
            <StopParentInteraction
              alignItems="center"
              gap={12}
              blockDefault={shouldBlockHostDefault}
              data-stop-parent-interaction-state
            >
              {customRight}
            </StopParentInteraction>
          )}

          {arrow &&
            (() => {
              if (typeof arrow === "boolean") {
                return (
                  <Icon
                    icon={activated ? "iArrowKeyUp" : "iArrowKeyDown"}
                    iconFill
                    size={20}
                    opacity={0.6}
                  />
                );
              }
              const { filled, degree, ...iconProps } = arrow;
              return (
                <Icon
                  icon={activated ? "iArrowKeyUp" : "iArrowKeyDown"}
                  iconFill
                  size={18}
                  {...iconProps}
                  box={iconProps.box ?? true}
                  boxOptions={iconProps.boxOptions ?? { padding: 6 }}
                  background={iconProps.background}
                  themePreset={
                    filled
                      ? iconProps.themePreset
                        ? resolvedThemePreset
                        : "BaseFull"
                      : iconProps.themePreset
                  }
                  style={{
                    transform: degree ? `rotate(${degree}deg)` : undefined,
                    ...iconProps.style,
                  }}
                />
              );
            })()}
        </View>
      </Pressable>

      <View
        motion={{
          initial: false,
          animate: {
            height: activated ? "auto" : 0,
            opacity: activated ? 1 : 0,
          },
          transition: {
            duration: 0.28,
            ease: [0.4, 0, 0.2, 1],
          },
        }}
        fullWidth
      >
        <View
          column
          gap={12}
          className={clsx(
            contained ? styles.containedInnerChildren : styles.InnerChildren,
            accordion.innerClassName,
          )}
          style={accordion.innerStyle}
        >
          {children}
        </View>
      </View>
    </View>
  );
}
