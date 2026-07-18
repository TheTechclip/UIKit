"use client";

import { AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useScrollLock } from "../../_shared/bodyScrollLock";
import { LAYER_Z_INDEX } from "../../_shared/layer.constants";
import DialogFooter from "../contents/Dialog.footer";
import DialogHeader from "../contents/Dialog.header";
import BackgroundWrapper from "../Dialog.background";
import type {
  DialogOutsideOptions,
  ModalConfig,
} from "../Dialog.types";
import {
  DialogPortal,
  useEscapeClose,
} from "../Dialog.utils";
import { motionPresets } from "../../Motion/Motion.presets";
import View from "../../View/View";

interface RenderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: ModalConfig;
  id?: string;
  zIndex?: number;
  width?: string | number;
  height?: string | number;
  children?: ReactNode;
  role?: string;
  "data-color-mode"?: string;
}

export default function RenderModal({
  open,
  onOpenChange,
  config,
  id,
  zIndex,
  width,
  height,
  children,
  role = "dialog",
  "data-color-mode": dataColorMode,
}: RenderModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const resolvedZIndex = zIndex ?? LAYER_Z_INDEX.modal;

  const isOutsideConfig = config?.outside !== false;
  const outsideOptions: DialogOutsideOptions =
    config?.outside && typeof config.outside === "object" ? config.outside : {};
  const lockBodyScroll = outsideOptions.lockBodyScroll !== false;

  useScrollLock(open && lockBodyScroll);

  useEffect(() => {
    if (!open) return;

    const modalEl = modalRef.current;
    if (!modalEl) return;

    const focusableElements = modalEl.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement | undefined;
    const lastElement = focusableElements[focusableElements.length - 1] as
      | HTMLElement
      | undefined;

    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    modalEl.addEventListener("keydown", handleTab);
    return () => modalEl.removeEventListener("keydown", handleTab);
  }, [open]);

  const closeWithConfirm = useCallback(() => {
    if (config?.exit?.confirm) {
      const { title, caption } = config.exit.confirm;
      const isConfirmed = window.confirm(
        `${title ?? "확인"}\n\n${caption ?? "작업을 중단하시겠습니까?"}`,
      );
      if (!isConfirmed) return;
    }
    onOpenChange(false);
  }, [config?.exit?.confirm, onOpenChange]);

  useEscapeClose(open && config?.exit?.escape !== false, closeWithConfirm);

  const modalNode = (
    <AnimatePresence>
      {open ? (
        <View
          data-open="true"
          data-color-mode={dataColorMode}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: resolvedZIndex,
            pointerEvents: "none",
          }}
        >
          <BackgroundWrapper
            open={open}
            showBackdrop={isOutsideConfig}
            background={outsideOptions.background}
            backgroundBlur={outsideOptions.backgroundBlur}
            className={outsideOptions.className}
            style={outsideOptions.style}
            zIndex={resolvedZIndex - 1}
            onClick={
              config?.exit?.overlay !== false ? closeWithConfirm : undefined
            }
          />
          <View
            row
            alignItems="center"
            justifyContent="center"
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: resolvedZIndex,
            }}
          >
            <View
              id={id}
              ref={modalRef}
              data-popover-owner={config?.popoverOwnerId}
              className={config?.className}
              role={role}
              aria-modal="true"
              tabIndex={-1}
              motion={motionPresets.modal}
              themePreset={
                config?.immersive ? "UISecondary" : config?.themePreset
              }
              background={
                config?.immersive
                  ? undefined
                  : (config?.background ??
                    (config?.themePreset ? undefined : "Base1TP1"))
              }
              color={config?.color}
              border={config?.immersive ? "None" : config?.border}
              radius={
                config?.immersive ? "None" : (config?.radius ?? "ExtraBold")
              }
              shadow={
                config?.immersive ? "None" : (config?.shadow ?? "Regular")
              }
              backgroundBlur={
                config?.immersive ? "None" : (config?.backgroundBlur ?? "Light")
              }
              width={
                config?.immersive
                  ? "100vw"
                  : (width ?? "min(100% - 3.2rem, 48rem)")
              }
              height={config?.immersive ? "100vh" : height}
              column
              style={{
                maxHeight: config?.immersive ? "100vh" : "calc(100% - 3.2rem)",
                pointerEvents: "auto",
                overflow: "hidden",
                margin: config?.immersive ? 0 : undefined,
                ...config?.style,
              }}
            >
              {config?.custom ? (
                config.custom
              ) : (
                <>
                  <View padding={16}>
                    <DialogHeader
                      config={config?.header}
                      exitIcon={config?.exit?.icon}
                      onExit={closeWithConfirm}
                    />
                  </View>

                  <View
                    padding={16}
                    column
                    style={{
                      flex: "1 1 auto",
                      overflowY: "auto",
                      minHeight: 0,
                    }}
                  >
                    {children}
                  </View>

                  <View padding={16}>
                    <DialogFooter
                      config={config?.footer}
                      exitButton={config?.exit?.footerButton}
                      onExit={closeWithConfirm}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      ) : null}
    </AnimatePresence>
  );

  return <DialogPortal>{modalNode}</DialogPortal>;
}
