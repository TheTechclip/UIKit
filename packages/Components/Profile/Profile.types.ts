import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import type { TextProps } from "@/packages/Components/Text/Text.types";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { ThemePaint } from "@/packages/Frameworks/Theme/Theme.types";

export type ProfileAvatarLoading = "eager" | "lazy";

export type ProfileRole = {
  label: string;
  color?: ThemePaint;
  icon?: string;
  iconFill?: boolean;
};

export interface ProfileAvatarOptions {
  avatar?: string | null;
  avatarLoading?: ProfileAvatarLoading;
  size: number;
  imageWidth?: UIKitSizeValue;
  imageHeight?: UIKitSizeValue;
  fallbackPadding?: UIKitSizeValue;
  border?: IconProps["border"];
  background?: IconProps["background"];
}

export type ProfileSizeOptions = {
  avatar?: number;
  textType?: TextProps["type"];
  textSize?: UIKitSizeValue;
  badge?: number;
  gap?: UIKitSizeValue;
  fallbackPadding?: UIKitSizeValue;
};

export interface ProfileProps {
  "data-color-mode"?: string;
  id?: string;
  displayName: string;
  username?: string;
  avatarUrl?: string | null;
  avatarLoading?: ProfileAvatarLoading;
  bio?: string;
  isCertified?: boolean;
  certifiedAt?: string;
  roles?: ProfileRole[];
  joinedAtText?: string;
  profileHref?: string | null;
  canReport?: boolean;
  reportHref?: string | null;
  reportLabel?: string;
  onReport?: () => void;
  extended?: boolean;
  size?: ProfileSizeOptions;
  popover?: React.ReactNode;
}
