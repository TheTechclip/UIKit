import clsx from "clsx";
import Image from "next/image";
import { Children, isValidElement } from "react";
import styles from "@/packages/Components/Layout/Layout.module.scss";
import type {
  BackgroundImageValue,
  LayoutGridViewProps,
  LayoutProps,
  LayoutSectionProps,
} from "@/packages/Components/Layout/Layout.types";
import Title from "@/packages/Components/Title/Title";
import type { TitleProps } from "@/packages/Components/Title/Title.types";
import { normalizeUIKitImageSrc } from "@/packages/Frameworks/_shared/normalize";
import {
  Size,
  type UIKitSizeValue,
} from "@/packages/Frameworks/_shared/sizing";
import View from "@/packages/Frameworks/View/View";

function resolveBgMargin(
  margin: NonNullable<BackgroundImageValue["margin"]>,
): string | number | undefined {
  if (Array.isArray(margin)) {
    return margin.map((v) => Size(v)).join(" ");
  }
  return Size(margin as UIKitSizeValue);
}

export default function Layout({
  children,
  title,
  caption,
  titleType,
  titleFontType,
  mobileTitleShown,
  onlyHeaderTitleShown,
  header,
  titleContext,
  backgroundImage,
  "data-color-mode": dataTheme,
}: LayoutProps) {
  const layoutChildren = Children.toArray(children);
  const hasLayoutTitle = Boolean(title || caption);
  const showLayoutTitle = hasLayoutTitle && !onlyHeaderTitleShown;

  const bgConfig: BackgroundImageValue | undefined =
    typeof backgroundImage === "string"
      ? { src: backgroundImage }
      : backgroundImage;

  const bgSrc = bgConfig?.src ? normalizeUIKitImageSrc(bgConfig.src) : "";

  const bgHeight =
    bgConfig?.height ??
    (typeof backgroundImage === "string" ? "100vh" : undefined);

  const layoutContent = (
    <View
      width="100%"
      height="100%"
      style={{
        position: "relative",
        minWidth: 0,
        overflowX: "hidden",
        overflowY: "auto",
      }}
      fullWidth
      data-color-mode={dataTheme}
      column
      alignItems="center"
    >
      {bgConfig && bgSrc && (
        <View
          height={bgHeight ?? "100vh"}
          style={
            {
              position: "fixed",
              inset: 0,
              width: "100%",
              overflow: "hidden",
              zIndex: 0,
              margin: bgConfig.margin
                ? resolveBgMargin(bgConfig.margin)
                : undefined,
            } as React.CSSProperties
          }
        >
          <Image
            alt=""
            src={bgSrc}
            fill
            sizes="100vw"
            style={
              {
                objectFit: "cover",
                filter: bgConfig.filter,
              } as React.CSSProperties
            }
          />
        </View>
      )}
      <View className={styles.LayoutInner} column gap={36}>
        <View column gap={0} fullWidth style={{ minWidth: 0 }}>
          {showLayoutTitle && (
            <Title
              className={clsx(
                styles.LayoutTitleWrapper,
                mobileTitleShown && styles.LayoutTitleMobileOnly,
              )}
              title={title ? { text: title } : undefined}
              titleType={titleType ?? "LargeTitle"}
              titleClassName={styles.LayoutTitleText}
              fontType={titleFontType}
              caption={caption}
              captionOpacity={0.8}
              context={titleContext}
            />
          )}
          <View column gap={36} fullWidth style={{ minWidth: 0 }}>
            {layoutChildren}
          </View>
        </View>
      </View>
    </View>
  );
  return (
    <>
      {header}
      {layoutContent}
    </>
  );
}

function getLayoutSectionGroup(child: React.ReactNode) {
  if (!isValidElement<Pick<LayoutSectionProps, "group">>(child)) {
    return undefined;
  }

  if (child.type === LayoutSection || child.props.group !== undefined) {
    return child.props.group ?? "BaseFull";
  }

  return undefined;
}

export function LayoutGrid({
  children,
  className,
  style,
  ratio,
  gap,
  groupGap,
  "data-color-mode": dataTheme,
}: LayoutGridViewProps) {
  const layoutChildren = Children.toArray(children);
  const groups = new Map<string, React.ReactNode[]>();
  const standaloneChildren: React.ReactNode[] = [];

  for (const child of layoutChildren) {
    const group = getLayoutSectionGroup(child);

    if (!group) {
      standaloneChildren.push(child);
      continue;
    }

    groups.set(group, [...(groups.get(group) ?? []), child]);
  }

  return (
    <View
      data-color-mode={dataTheme}
      alignItems="start"
      className={clsx(styles.LayoutGrid, className)}
      style={
        {
          "--layout-grid-ratio": ratio,
          ...style,
        } as React.CSSProperties
      }
      gap={gap}
      gridTemplateColumns="var(--layout-grid-active-ratio)"
    >
      {[...groups.entries()].map(([group, groupChildren]) => (
        <View
          key={group}
          column
          gap={groupGap}
          className={styles.LayoutGridGroup}
        >
          {groupChildren}
        </View>
      ))}
      {standaloneChildren}
    </View>
  );
}

function resolveSectionTitle(title: LayoutSectionProps["title"]) {
  if (!title) {
    return undefined;
  }

  if (Array.isArray(title) || (typeof title === "object" && "text" in title)) {
    return title as TitleProps["title"];
  }

  return { text: title as React.ReactNode };
}

function resolveSectionTitleProps({
  title,
  titleProps,
  titleType,
  caption,
  suffix,
  meta,
  actions,
}: Pick<
  LayoutSectionProps,
  | "actions"
  | "caption"
  | "meta"
  | "suffix"
  | "title"
  | "titleProps"
  | "titleType"
>): TitleProps[] {
  if (titleProps) {
    return Array.isArray(titleProps) ? titleProps : [titleProps];
  }

  const sectionTitle = resolveSectionTitle(title);

  return sectionTitle
    ? [
        {
          title: sectionTitle,
          titleType: titleType ?? "Title1",
          caption,
          suffix,
          meta,
          actions,
        },
      ]
    : [];
}

function getSectionTitleKey(item: TitleProps) {
  return [
    item.className,
    item.titleType,
    Array.isArray(item.title)
      ? item.title.map((t) => t.text).join("/")
      : item.title?.text,
    item.caption,
  ]
    .filter(Boolean)
    .join(":");
}

export function LayoutSection({
  children,
  className,
  gap,
  group: _group,
  mobileOrder,
  title,
  titleProps,
  titleType = "Title1",
  caption,
  suffix,
  meta,
  actions,
  ...props
}: LayoutSectionProps) {
  const sectionTitleProps = resolveSectionTitleProps({
    actions,
    caption,
    meta,
    suffix,
    title,
    titleProps,
    titleType,
  });

  return (
    <View
      {...props}
      column
      gap={gap ?? 12}
      mobileOrder={mobileOrder}
      className={className}
      fullWidth
      style={{ minWidth: 0 }}
    >
      {sectionTitleProps.map((item) => (
        <Title key={getSectionTitleKey(item)} {...item} />
      ))}
      {children}
    </View>
  );
}

Layout.Grid = LayoutGrid;
Layout.Section = LayoutSection;
