import type { CSSProperties } from "react";
import type { UIKitSizeValue } from "../../frameworks/shared/sizing";
import type { ViewProps } from "../../frameworks/View/View.types";
import type { TextProps } from "../Text/Text.types";
import type { TitleProps } from "../Title/Title.types";

type BackgroundMarginUnitValue = UIKitSizeValue;

type BackgroundMarginValue =
  | BackgroundMarginUnitValue
  | readonly [BackgroundMarginUnitValue]
  | readonly [BackgroundMarginUnitValue, BackgroundMarginUnitValue]
  | readonly [
      BackgroundMarginUnitValue,
      BackgroundMarginUnitValue,
      BackgroundMarginUnitValue,
    ]
  | readonly [
      BackgroundMarginUnitValue,
      BackgroundMarginUnitValue,
      BackgroundMarginUnitValue,
      BackgroundMarginUnitValue,
    ];

export interface BackgroundImageValue {
  height?: UIKitSizeValue;
  src?: string;
  filter?: CSSProperties["filter"];
  margin?: BackgroundMarginValue;
}

export interface LayoutProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  title?: React.ReactNode;
  caption?: React.ReactNode;
  titleType?: TitleProps["titleType"];
  titleFontType?: TextProps["fontType"];
  mobileTitleShown?: boolean;
  onlyHeaderTitleShown?: boolean;
  header?: React.ReactNode;
  titleContext?: React.ReactNode;
  goTop?: boolean;
  backgroundImage?: string | BackgroundImageValue;
}

export interface LayoutGridViewProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ratio?: string;
  gap?: ViewProps["gap"];
  groupGap?: ViewProps["gap"];
}

export interface LayoutSectionProps
  extends Omit<
    ViewProps,
    "caption" | "column" | "mobileOrder" | "order" | "title"
  > {
  group?: "BaseFull" | "BaseSoft" | "BaseSoft" | (string & {});
  mobileOrder?: number;
  title?: React.ReactNode | TitleProps["title"];
  titleProps?: TitleProps | TitleProps[];
  titleType?: TitleProps["titleType"];
  caption?: TitleProps["caption"];
  suffix?: TitleProps["suffix"];
  meta?: TitleProps["meta"];
  actions?: TitleProps["actions"];
}
