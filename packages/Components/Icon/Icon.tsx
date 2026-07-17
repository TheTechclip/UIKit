import clsx from "clsx";
import Image from "next/image";
import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import SVGData from "@/packages/Components/Icon/SVG/data";
import Spinner from "@/packages/Components/Spinner/Spinner";
import Text from "@/packages/Components/Text/Text";
import {
  normalizeBrandIconClass as _normalizeBrandIconClass,
  normalizeUIKitImageSrc as _normalizeUIKitImageSrc,
} from "@/packages/Frameworks/_shared/normalize";
import { Size, SizePX } from "@/packages/Frameworks/_shared/sizing";
import Pressable from "@/packages/Frameworks/Pressable/Pressable";
import View from "@/packages/Frameworks/View/View";

const normalizeUIKitImageSrc = _normalizeUIKitImageSrc;
const normalizeBrandIconClass = _normalizeBrandIconClass;

function normalizeDToArray(d: string | (string | string[])[]): string[] {
  if (Array.isArray(d)) {
    return d.flat();
  }
  return [d];
}

const buildRenderKeys = (items: string[], prefix: string) => {
  const counts = new Map<string, number>();

  return items.map((item) => {
    const base = item || prefix;
    const nextCount = (counts.get(base) ?? 0) + 1;
    counts.set(base, nextCount);
    return `${prefix}-${base}-${nextCount}`;
  });
};

export function IconInner({
  innerClassName,
  size,
  width,
  height,
  iconFill,
  weight,
  icon,
  iconBrand,
  svg,
  svgBordered,
  spinner,
  spinnerOptions,
  image,
  imageLoading,
  title,
  opacity,
  box,
  titleType,
  reversed,
}: IconProps) {
  const dArray = svg ? normalizeDToArray(SVGData[svg].d) : [];
  const pathKeys = buildRenderKeys(dArray, svg ?? "svg");
  const resolvedSize = Size(size) ?? "2.4rem";
  const resolvedWidth = Size(width) ?? resolvedSize;
  const resolvedHeight = Size(height) ?? resolvedSize;
  const svgBorderOptions =
    typeof svgBordered === "object" ? svgBordered : undefined;
  const svgBorderFill = svgBorderOptions?.fill ?? "None";
  const svgBorderStroke = svgBorderOptions?.stroke ?? "currentColor";
  const svgBorderStrokeWidth = svgBorderOptions?.strokeWidth ?? 1;
  const imageWidth = SizePX(width ?? size, 64);
  const imageHeight = SizePX(height ?? size, 64);
  const resolvedImage = typeof image === "string" ? image.trim() : "";
  const imageSrc = normalizeUIKitImageSrc(resolvedImage);
  const accessibleTitle = typeof title === "string" ? title : undefined;
  const brandIconClass = normalizeBrandIconClass(iconBrand);

  if (spinner) {
    return (
      <View
        alignItems="center"
        justifyContent="center"
        gap={4}
        width={resolvedWidth}
        height={resolvedHeight}
        style={{ minWidth: "max-content", minHeight: "max-content" }}
      >
        <Spinner
          {...spinnerOptions}
          size={spinnerOptions?.size ?? size}
          color={spinnerOptions?.color}
          opacity={spinnerOptions?.opacity ?? opacity}
        />
        {title && (
          <Text
            type={titleType || "Subheadline"}
            opacity={opacity}
            style={{ order: reversed ? -1 : undefined }}
          >
            {title}
          </Text>
        )}
      </View>
    );
  }

  if (icon || iconBrand) {
    return (
      <View
        alignItems="center"
        justifyContent="center"
        gap={4}
        style={{
          width: "max-content",
          height: "max-content",
          minWidth: "max-content",
          minHeight: "max-content",
        }}
      >
        <i
          className={clsx(
            icon,
            brandIconClass,
            { iFill: iconFill },
            innerClassName,
          )}
          style={
            {
              fontSize: resolvedSize,
              "--uikit-icon-font-weight": weight,
              color: "var(--color-icon)",
              opacity,
            } as React.CSSProperties
          }
        />
        {title && (
          <Text
            type={titleType || "Subheadline"}
            style={{ order: reversed ? -1 : undefined }}
          >
            {title}
          </Text>
        )}
      </View>
    );
  }

  if (imageSrc) {
    return (
      <View
        className={innerClassName}
        width={resolvedWidth}
        height={resolvedHeight}
        opacity={opacity}
        padding={box ? 0 : 2}
        style={{ position: "relative" }}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
            objectPosition: "center",
            objectFit: "cover",
          }}
          alt={accessibleTitle || ""}
          src={imageSrc}
          width={imageWidth}
          height={imageHeight}
          loading={imageLoading}
          unoptimized
        />
      </View>
    );
  }

  if (svg) {
    return (
      <View
        width={resolvedWidth}
        height={resolvedHeight}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          className={innerClassName}
          aria-hidden={accessibleTitle ? undefined : true}
          aria-label={accessibleTitle}
          role={accessibleTitle ? "img" : undefined}
          style={{
            width: `calc(${resolvedWidth} * 0.75)`,
            height: `calc(${resolvedHeight} * 0.75)`,
            color: "var(--color-icon)",
            opacity,
          }}
          viewBox={SVGData[svg].viewBox}
        >
          {accessibleTitle ? <title>{accessibleTitle}</title> : null}
          {svgBordered
            ? dArray.map((d, index) => (
                <path
                  key={`${pathKeys[index]}-border`}
                  d={d}
                  fill={svgBorderFill}
                  stroke={svgBorderStroke}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={svgBorderStrokeWidth}
                  vectorEffect="non-scaling-stroke"
                />
              ))
            : dArray.map((d, index) => (
                <path key={pathKeys[index]} d={d} fill="currentColor" />
              ))}
        </svg>
      </View>
    );
  }

  return null;
}

export function Icon({
  themePreset,
  background,
  color,
  themeInteractive,
  selected,
  border,
  radius,
  shadow,
  pressable,
  box,
  boxOptions,
  title,
  className,
  style,
  innerClassName,
  size,
  width,
  height,
  iconFill,
  weight,
  icon,
  iconBrand,
  spinner,
  spinnerOptions,
  svg,
  svgBordered,
  image,
  imageLoading,
  opacity,
  backgroundBlur,
  "data-color-mode": dataColorMode,
  titleType,
  reversed,
}: IconProps) {
  const resolvedBackground = background ?? boxOptions?.background;
  const resolvedBorder = border ?? (box ? undefined : undefined);
  const resolvedRadius = radius ?? (box ? "Circle" : undefined);
  const accessibleTitle = typeof title === "string" ? title : undefined;

  const {
    className: pressableClassName,
    style: pressableStyle,
    title: pressableTitle,
    disabled: pressableDisabled,
    ...restPressable
  } = pressable ?? {};

  return (
    <Pressable
      data-color-mode={dataColorMode}
      {...restPressable}
      themePreset={themePreset}
      background={resolvedBackground}
      color={color}
      themeInteractive={themeInteractive}
      selected={selected}
      border={resolvedBorder}
      backgroundBlur={backgroundBlur}
      radius={resolvedRadius}
      shadow={shadow}
      opacity={opacity}
      className={clsx(className, pressableClassName)}
      alignItems="center"
      justifyContent="center"
      width={Size(width) ?? "max-content"}
      height={Size(height) ?? "max-content"}
      padding={
        boxOptions?.padding !== undefined
          ? Size(boxOptions.padding)
          : box
            ? ".8rem"
            : image
              ? 0
              : undefined
      }
      gap={box ? undefined : 4}
      style={{
        minWidth: "max-content",
        minHeight: "max-content",
        paddingInline: Size(boxOptions?.paddingHorizontal),
        paddingBlock: Size(boxOptions?.paddingVertical),
        overflow: "hidden",
        margin: Size(boxOptions?.margin),
        marginInline: Size(boxOptions?.marginHorizontal),
        marginBlock: Size(boxOptions?.marginVertical),
        ...boxOptions?.style,
        ...style,
        ...pressableStyle,
      }}
      title={accessibleTitle ?? pressableTitle}
      disabled={pressableDisabled}
    >
      <IconInner
        className={className}
        innerClassName={innerClassName}
        size={size}
        width={width}
        height={height}
        iconFill={iconFill}
        weight={weight}
        icon={icon}
        iconBrand={iconBrand}
        spinner={spinner}
        spinnerOptions={spinnerOptions}
        svg={svg}
        svgBordered={svgBordered}
        image={image}
        imageLoading={imageLoading}
        box={box}
        boxOptions={boxOptions}
        title={title}
        opacity={opacity}
        titleType={titleType}
        reversed={reversed}
      />
    </Pressable>
  );
}

export default Icon;
