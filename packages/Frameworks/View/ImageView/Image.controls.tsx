import type { CSSProperties } from "react";
import Icon from "@/packages/Components/Icon/Icon";

export type ImageControlProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
};

function ImageControl({
  icon,
  onClick,
  disabled,
  className,
  style,
}: ImageControlProps & { icon: string }) {
  return (
    <Icon
      themePreset="BaseSoft"
      icon={icon}
      className={className}
      backgroundBlur="ExtraLight"
      shadow="Regular"
      size={20}
      box
      boxOptions={{ padding: 6, style }}
      pressable={{ onClick, disabled }}
    />
  );
}

export function ImageLeftControl(props: ImageControlProps) {
  return <ImageControl {...props} icon="iArrowLeft" />;
}

export function ImageRightControl(props: ImageControlProps) {
  return <ImageControl {...props} icon="iArrowRight" />;
}
