"use client";

import type { ReactNode } from "react";
import ThemeBootstrapper, {
  type ThemeBootstrapperProps,
} from "./Theme/Theme.boot";
import DialogBootstrap from "./Dialog/Dialog.boot";
import ToasterBootstrap from "./Toaster/Toaster.boot";

export interface UIKitProviderProps {
  children: ReactNode;
  theme?: ThemeBootstrapperProps["initialTheme"];
}

export default function UIKitProvider({
  children,
  theme = "system",
}: UIKitProviderProps) {
  return (
    <ThemeBootstrapper initialTheme={theme}>
      {children}
      <DialogBootstrap />
      <ToasterBootstrap />
    </ThemeBootstrapper>
  );
}
