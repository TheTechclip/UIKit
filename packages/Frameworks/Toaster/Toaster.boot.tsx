"use client";

import clsx from "clsx";
import { Toaster, toast } from "sonner";
import Icon from "@/packages/Components/Icon/Icon";
import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import styles from "@/packages/Frameworks/Toaster/Toaster.module.scss";
import type { ToasterBootstrapProps } from "@/packages/Frameworks/Toaster/Toaster.types";

export type { ToasterBootstrapProps };
export { toast };

const getToastIcon = (color: IconProps["color"]) => (
  <Icon icon="iCircle" iconFill size={10} color={color} />
);

export default function ToasterBootstrap({
  theme,
  icon: _icon,
  title: _title,
  storage: _storage,
  "data-color-mode": dataTheme,
}: ToasterBootstrapProps) {
  return (
    <Toaster
      theme={theme}
      toastOptions={{
        unstyled: true,
        className: clsx(
          styles.Toaster,
          "Footnote",
          dataTheme && `color-mode-${dataTheme}`,
        ),
        classNames: {
          loading: styles.Loading,
        },
      }}
      icons={{
        success: getToastIcon("Green1"),
        error: getToastIcon("Red1"),
        info: getToastIcon("Blue1"),
        warning: getToastIcon("Yellow1"),
        loading: getToastIcon("Yellow1"),
      }}
    />
  );
}
