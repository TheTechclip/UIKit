import type { ProfileProps } from "@/packages/Components/Profile/Profile.types";
import type { TextProps } from "@/packages/Components/Text/Text.types";

export interface DocsLayoutProps {
  children?: React.ReactNode;
  "data-color-mode"?: string;
  image?: string;
  header?: React.ReactNode;
  author?: ProfileProps;
  createdBy?: string;
  caption?: React.ReactNode;
  title?: React.ReactNode;
  mobileTitleShown?: boolean;
  onlyHeaderTitleShown?: boolean;
  fontType?: TextProps["fontType"];
  bodyClassName?: string;
  goTop?: boolean;
}
