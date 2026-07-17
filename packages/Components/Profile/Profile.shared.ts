import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import type { ProfileAvatarOptions } from "@/packages/Components/Profile/Profile.types";
import {
  Size,
  type UIKitSizeValue,
} from "@/packages/Frameworks/_shared/sizing";

const resolveFallbackAvatarIconSize = (
  outerSize: UIKitSizeValue,
  padding?: UIKitSizeValue,
): UIKitSizeValue => {
  if (padding === undefined || padding === null || padding === "") {
    return outerSize;
  }

  if (
    typeof outerSize === "number" &&
    Number.isFinite(outerSize) &&
    typeof padding === "number" &&
    Number.isFinite(padding)
  ) {
    return Math.max(0, outerSize - padding * 2);
  }

  const resolvedOuterSize = Size(outerSize);
  const resolvedPadding = Size(padding);

  if (!resolvedOuterSize || !resolvedPadding) {
    return outerSize;
  }

  return `calc(${resolvedOuterSize} - (${resolvedPadding} * 2))`;
};

export const getProfileAvatarIconProps = ({
  avatar,
  avatarLoading,
  size,
  imageWidth,
  imageHeight,
  fallbackPadding,
  border,
  background,
}: ProfileAvatarOptions): IconProps => {
  if (avatar) {
    return {
      image: avatar,
      imageLoading: avatarLoading,
      box: true,
      border: border ?? "None",
      width: imageWidth || size,
      height: imageHeight || size,
      boxOptions: {
        padding: 0,
      },
    };
  }

  const fallbackWidth = imageWidth || size;
  const fallbackHeight = imageHeight || size;

  return {
    icon: "iPerson",
    box: true,
    border,
    width: fallbackWidth,
    height: fallbackHeight,
    size: resolveFallbackAvatarIconSize(fallbackWidth, fallbackPadding),
    boxOptions: {
      padding: fallbackPadding,
    },
    background,
  };
};
