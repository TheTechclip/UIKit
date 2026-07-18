import type { SpinnerProps } from "../Spinner/Spinner.types";
import type { TextProps } from "../Text/Text.types";
import type { TitleProps } from "../Title/Title.types";
import type { UIKitSizeValue } from "../../Frameworks/_shared/sizing";
import type { PressableProps } from "../../Frameworks/Pressable/Pressable.types";
import type { RadiusProps } from "../../Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemePaint,
  ThemeSystemProps,
} from "../../Frameworks/Theme/Theme.types";

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
