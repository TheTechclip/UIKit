import type { SpinnerProps } from "@/packages/Components/Spinner/Spinner.types";
import type { TextProps } from "@/packages/Components/Text/Text.types";
import type { TitleProps } from "@/packages/Components/Title/Title.types";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { PressableProps } from "@/packages/Frameworks/Pressable/Pressable.types";
import type { RadiusProps } from "@/packages/Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemePaint,
  ThemeSystemProps,
} from "@/packages/Frameworks/Theme/Theme.types";

type SVGPathPaint = React.SVGProps<SVGPathElement>["fill"];
type SVGPathStrokeWidth = React.SVGProps<SVGPathElement>["strokeWidth"];

interface SVGBorderedOptions {
  fill?: SVGPathPaint;
  stroke?: SVGPathPaint;
  strokeWidth?: SVGPathStrokeWidth;
}

export interface IconProps extends ThemeSystemProps, RadiusProps, BorderProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  box?: boolean;
  boxOptions?: {
    padding?: UIKitSizeValue;
    paddingHorizontal?: UIKitSizeValue;
    paddingVertical?: UIKitSizeValue;
    background?: ThemePaint;
    style?: React.CSSProperties;
    margin?: UIKitSizeValue;
    marginHorizontal?: UIKitSizeValue;
    marginVertical?: UIKitSizeValue;
  };
  innerClassName?: string;
  size?: UIKitSizeValue;
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;
  image?: string;
  imageLoading?: "eager" | "lazy";
  icon?: string;
  iconBrand?: string;
  iconFill?: boolean;
  spinner?: boolean;
  spinnerOptions?: Omit<SpinnerProps, "color" | "data-color-mode" | "size"> & {
    color?: SpinnerProps["color"];
    size?: SpinnerProps["size"];
  };
  weight?: TextProps["weight"];
  svg?: string;
  svgBordered?: boolean | SVGBorderedOptions;
  pressable?: PressableProps;
  opacity?: number;
  titleType?: TitleProps["titleType"];
  reversed?: boolean;
}
