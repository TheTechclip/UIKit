import clsx from "clsx";
import StopParentInteraction from "../../Frameworks/_shared/StopParentInteraction";
import Pressable from "../../Frameworks/Pressable/Pressable";
import View from "../../Frameworks/View/View";
import { useInBoxContent } from "../Box/Box";
import Icon from "../Icon/Icon";
import Pill from "../Pill/Pill";
import Text from "../Text/Text";
import styles from "./Card.module.scss";
import type { CardDefaultProps } from "./Card.types";
import { buildRenderKeys, normalizeCardIcon } from "./Card.utils";

export default function CardDefault({
  themePreset,
  background,
  color,
  themeInteractive,
  selected,
  border,
  shadow,
  vertical,
  contained,
  radius,
  pressable,
  style,
  className,
  title,
  caption,
  titleReversed,
  icon,
  arrow,
  pill,
  customRight,
  customRightAllowDefault,
  "data-color-mode": dataTheme,
}: CardDefaultProps) {
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

  const { disabled: pressableDisabled, ...restPressable } = pressable ?? {};

  return (
    <Pressable
      alignItems="center"
      justifyContent="space-between"
      gap={12}
      data-color-mode={dataTheme}
      themePreset={themePreset ?? "UIPrimary"}
      background={background}
      color={color}
      shadow={shadow}
      themeInteractive={themeInteractive}
      selected={selected}
      border={border}
      radius={radius ?? "Regular"}
      {...restPressable}
      disabled={pressableDisabled}
      fullWidth
      className={clsx(
        styles.Card,
        resolvedContained && styles.Contained,
        className,
      )}
      style={style}
    >
      <View
        gap={12}
        fullWidth
        style={{ minWidth: 0 }}
        column={vertical}
        alignItems={vertical ? "flex-start" : undefined}
        justifyContent={vertical ? "flex-start" : undefined}
      >
        {resolvedIcon && <Icon {...resolvedIcon} />}
        {(title || caption) && (
          <View
            column
            justifyContent="center"
            gap={2}
            style={
              titleReversed ? { flexDirection: "column-reverse" } : undefined
            }
          >
            {title && (
              <Text type="Subheadline" weight={500}>
                {title}
              </Text>
            )}
            {caption && (
              <Text type="Footnote" opacity={0.6}>
                {caption}
              </Text>
            )}
          </View>
        )}
      </View>

      {}
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
                themePreset={pillItem.themePreset ? themePreset : "BaseFull"}
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
              return <Icon icon="iArrowKeyRight" size={24} opacity={0.6} />;
            }

            const { filled, degree, ...iconProps } = arrow;
            return (
              <Icon
                icon="iArrowKeyRight"
                size={18}
                {...iconProps}
                box={iconProps.box ?? true}
                boxOptions={iconProps.boxOptions ?? { padding: 6 }}
                background={iconProps.background}
                themePreset={
                  filled
                    ? iconProps.themePreset
                      ? themePreset
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
  );
}
