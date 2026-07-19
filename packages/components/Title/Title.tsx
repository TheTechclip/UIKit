import clsx from "clsx";
import Pressable from "../../frameworks/Pressable/Pressable";
import View from "../../frameworks/View/View";
import { IconInner } from "../Icon/Icon";
import IconGroup from "../Icon/Icon.group";
import Pill from "../Pill/Pill";
import Text from "../Text/Text";
import type {
  TitleContextItem,
  TitleContextProps,
  TitleProps,
} from "./Title.types";

const buildRenderKeys = <T,>(
  items: T[],
  resolveBase: (item: T) => string,
): string[] => {
  const counts = new Map<string, number>();

  return items.map((item) => {
    const base = resolveBase(item) || "item";
    const nextCount = (counts.get(base) ?? 0) + 1;
    counts.set(base, nextCount);
    return `${base}-${nextCount}`;
  });
};

function TitleRoot({
  title,
  titleType,
  titleClassName,
  titleGap,
  leftGap,
  rightGap,
  fontType,
  titleLineHeight,
  titleVerticalTrim,
  caption,
  suffix,
  meta,
  actions,
  captionOpacity,
  context,
  className,
  style,
  "data-color-mode": dataTheme,
}: TitleProps) {
  const titleItems = Array.isArray(title) ? title : title ? [title] : [];
  const hasActive = titleItems.some((item) => item?.active);
  const hasTitleCluster = titleItems.length > 0 || Boolean(suffix);
  const hasRightCluster = Boolean(meta || actions);

  const titleKeys = buildRenderKeys(
    titleItems,
    (item) => item?.text?.toString() ?? "",
  );

  return (
    <View
      column
      gap={16}
      className={className}
      data-color-mode={dataTheme}
      style={style}
    >
      <View column gap={4}>
        <View
          alignItems="center"
          justifyContent={
            hasTitleCluster && hasRightCluster ? "space-between" : undefined
          }
          gap={6}
        >
          {hasTitleCluster && (
            <View gap={leftGap ?? 8} alignItems="center">
              {titleItems.length > 0 && (
                <View gap={titleGap ?? 8}>
                  {titleItems.map((item, index) => (
                    <Pressable
                      radius="Regular"
                      key={titleKeys[index]}
                      data-color-mode={item?.["data-color-mode"] ?? dataTheme}
                      padding={[2, 4]}
                      style={{
                        margin: "-.2rem -.4rem",
                        maxWidth: "max-content",
                      }}
                      {...item?.pressable}
                    >
                      <Text
                        type={titleType || "Title3"}
                        className={titleClassName}
                        fontType={fontType}
                        lineHeight={titleLineHeight}
                        verticalTrim={titleVerticalTrim}
                        opacity={hasActive && !item?.active ? 0.4 : 1}
                      >
                        {item?.text}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
              {suffix && (
                <View alignItems="center">
                  <Pill padding={6} {...suffix} />
                </View>
              )}
            </View>
          )}
          {hasRightCluster && (
            <View
              alignItems="center"
              gap={rightGap ?? 8}
              justifyContent="flex-end"
            >
              {meta && <Text type="Footnote">{meta}</Text>}
              {actions && (
                <IconGroup
                  iconSize={20}
                  iconBoxOptions={{
                    padding: 4,
                  }}
                  icons={actions}
                />
              )}
            </View>
          )}
        </View>
        {caption && (
          <Text
            type="Footnote"
            fontType={fontType}
            opacity={captionOpacity ?? 0.6}
          >
            {caption}
          </Text>
        )}
      </View>
      {context && <View fullWidth>{context}</View>}
    </View>
  );
}

function toContextItems(items?: TitleContextItem | TitleContextItem[]) {
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function getContextItemKey(
  item: TitleContextItem,
  side: "start" | "end",
  index: number,
) {
  return item.key ?? `${side}-${index}`;
}

function TitleContextItemView({ item }: { item: TitleContextItem }) {
  const {
    content,
    leadingIcon,
    trailingIcon,
    leadingIconProps,
    trailingIconProps,
    pressable,
    key: _key,
    className: itemDesignClassName,
    style: itemDesignStyle,
    ...designProps
  } = item;
  const {
    className: pressableClassName,
    style: pressableStyle,
    type,
    ...pressableProps
  } = pressable ?? {};
  const itemClassName = clsx(itemDesignClassName, pressableClassName);
  const itemStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: ".4rem",
    minWidth: 0,
    minHeight: "2.6rem",
    padding: ".4rem .6rem",
    margin: "-.4rem -.6rem",
    whiteSpace: "nowrap",
    transition: "var(--transition-surface)",
    ...itemDesignStyle,
    ...pressableStyle,
  } as React.CSSProperties;
  const itemContent = (
    <>
      {leadingIcon && (
        <IconInner
          {...leadingIconProps}
          icon={leadingIcon}
          size={leadingIconProps?.size ?? 18}
        />
      )}
      <Text
        type="Footnote"
        style={{
          display: "inline-flex",
          alignItems: "center",
          whiteSpace: "nowrap",
        }}
      >
        {content}
      </Text>
      {trailingIcon && (
        <IconInner
          {...trailingIconProps}
          icon={trailingIcon}
          size={trailingIconProps?.size ?? 18}
        />
      )}
    </>
  );

  if (!pressable) {
    return (
      <Text className={itemClassName} style={itemStyle}>
        {itemContent}
      </Text>
    );
  }

  return (
    <Pressable
      {...designProps}
      {...pressableProps}
      className={itemClassName}
      radius="Circle"
      alignItems="center"
      gap={4}
      padding={[4, 6]}
      style={{
        display: "inline-flex",
        minWidth: 0,
        minHeight: "2.6rem",
        margin: "-.4rem -.6rem",
        whiteSpace: "nowrap",
        transition: "var(--transition-surface)",
        ...itemDesignStyle,
        ...pressableStyle,
      }}
    >
      {itemContent}
    </Pressable>
  );
}

export function TitleContext({
  start,
  end,
  startGap,
  endGap,
  className,
  style,
}: TitleContextProps) {
  const startItems = toContextItems(start);
  const endItems = toContextItems(end);

  if (startItems.length === 0 && endItems.length === 0) {
    return null;
  }

  return (
    <View
      gap={6}
      className={className}
      fullWidth
      style={{ minHeight: "2.8rem", ...style }}
      alignItems="center"
      justifyContent="space-between"
    >
      {startItems.length > 0 && (
        <View gap={startGap ?? 16} alignItems="center">
          {startItems.map((item, index) => (
            <TitleContextItemView
              key={getContextItemKey(item, "start", index)}
              item={item}
            />
          ))}
        </View>
      )}
      {endItems.length > 0 && (
        <View gap={endGap ?? 16} justifyContent="flex-end" alignItems="center">
          {endItems.map((item, index) => (
            <TitleContextItemView
              key={getContextItemKey(item, "end", index)}
              item={item}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const Title = Object.assign(TitleRoot, {
  ContextBar: TitleContext,
});

export default Title;
