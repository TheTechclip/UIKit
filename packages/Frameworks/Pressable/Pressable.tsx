"use client";
import clsx from "clsx";
import { motion } from "motion/react";
import Link from "next/link";
import {
  type CSSProperties,
  createContext,
  forwardRef,
  type KeyboardEvent,
  type MutableRefObject,
  type Ref,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { resolvePadding } from "../_shared/Padding.types";
import { Size } from "../_shared/sizing";
import Dialog from "../Dialog/Dialog";
import styles from "./Pressable.module.scss";
import type { PressableProps } from "./Pressable.types";
import Squircle from "../Squircle/Squircle";
import { Radius } from "../Theme/Radius.types";
import {
  BackgroundBlur,
  Border,
  resolveThemeClasses,
  resolveThemeHasBorder,
  Shadow,
} from "../Theme/Theme.types";
import View from "../View/View";

export const ButtonNestingContext = createContext(false);
export const PopoverContext = createContext<{
  close: () => void;
} | null>(null);
const isButtonType = (type?: string) =>
  type === "button" || type === "submit" || type === "reset";
const hasExternalScheme = (href: string) =>
  /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href);
const MotionLink = motion.create(Link);

const setRefValue = (
  ref: Ref<HTMLElement> | undefined,
  value: HTMLElement | null,
) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as MutableRefObject<HTMLElement | null>).current = value;
  }
};
const getFormProps = (form: PressableProps["form"]) => {
  if (!form || form === true) return undefined;
  return form;
};
const Pressable = forwardRef<HTMLElement, PressableProps>((props, ref) => {
  const {
    href,
    onClick,
    target,
    rel,
    download,
    children,
    className,
    themePreset,
    background,
    color,
    themeInteractive,
    selected,
    border,
    radius,
    backgroundBlur,
    shadow,
    width,
    height,
    margin,
    gap,
    alignItems,
    justifyContent,
    alignSelf,
    column,
    row,
    fullWidth,
    opacity,
    padding,
    paddingHorizontal,
    paddingVertical,
    style,
    title,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-controls": ariaControls,
    "aria-expanded": ariaExpanded,
    "aria-haspopup": ariaHasPopup,
    type,
    disabled,
    onChange,
    checked,
    value,
    name,
    form,
    readOnly,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    onContextMenu,
    onKeyDown,
    onKeyUp,
    tabIndex,
    motion: motionProps,
    popover,
    "data-color-mode": dataColorMode,
    noSquircle,
    ...restProps
  } = props;
  const insideButton = useContext(ButtonNestingContext);
  const isControlType = type === "checkbox" || type === "radio";
  const shouldRenderButton = !!(popover || onClick || isButtonType(type));
  const isInteractive = Boolean(href || shouldRenderButton || isControlType);
  const resolvedFormProps = getFormProps(form);
  const resolvedTitle = title ?? ariaLabel;
  const resolvedAriaDescribedBy = ariaDescribedBy;
  const resolvedAriaLabel = ariaLabel;
  const nativeTitle = resolvedTitle;
  const popoverRootRef = useRef<HTMLDivElement>(null);
  const popoverAnchorRef = useRef<HTMLDivElement>(null);
  const popoverOwnerId = useId();
  const [internalPopoverOpen, setInternalPopoverOpen] = useState(
    popover?.defaultOpen ?? false,
  );
  const isPopoverControlled = popover?.open !== undefined;
  const popoverOpen = isPopoverControlled
    ? !!popover?.open
    : internalPopoverOpen;

  const themeClasses = resolveThemeClasses({
    themePreset,
    background,
    color,
    shadow,
    themeInteractive,
    selected: selected || popoverOpen,
    disabled,
    readOnly,
    isInteractive,
  });

  const hasRadius = Boolean(radius && radius !== "None");
  const hasBorder = resolveThemeHasBorder({ border, themePreset });
  const _hasShadow = Boolean(shadow && shadow !== "None");
  const isSquircle = hasRadius && !hasBorder && !noSquircle;
  const commonClassName = clsx(
    styles.Pressable,
    ...themeClasses,
    Border(border),
    Shadow(shadow),
    BackgroundBlur(backgroundBlur),
    className,
  );
  const layoutStyle: CSSProperties = {
    display: "flex",
    width: fullWidth ? "100%" : Size(width),
    height: Size(height),
    margin: Size(margin),
    gap: Size(gap),
    alignItems,
    justifyContent,
    alignSelf,
    flexDirection: column ? "column" : row ? "row" : undefined,
    opacity,
    padding: resolvePadding(padding, paddingHorizontal, paddingVertical),
  };

  const defaultGap = 24;
  const resolvedGap = Size(gap ?? defaultGap);

  const commonStyle = {
    borderRadius: Radius(radius),
    ...layoutStyle,
    gap: resolvedGap,
    ...style,
  };
  useEffect(() => {
    if (popover?.defaultOpen === undefined) return;
    if (!isPopoverControlled) setInternalPopoverOpen(popover.defaultOpen);
  }, [isPopoverControlled, popover?.defaultOpen]);

  useEffect(() => {
    const shouldHandleOutsideClick = popover;
    if (!shouldHandleOutsideClick) return;
    if (popover?.closeOnOutsideClick === false) return;
    const onOutside = (e: PointerEvent) => {
      const target = e.target as Node;
      const element = e.target as Element | null;
      const currentPopoverEl = document.querySelector(
        `[data-popover-owner="${popoverOwnerId}"]`,
      );
      const clickedInsideModalPortal = !!element?.closest(
        "[data-modal-portal]",
      );
      const clickedInsideHost = !!popoverRootRef.current?.contains(target);
      const clickedInsideOwnedPopover = !!element?.closest(
        `[data-popover-owner="${popoverOwnerId}"]`,
      );
      const clickedPopoverOwner = element
        ?.closest("[data-popover-owner]")
        ?.getAttribute("data-popover-owner");
      const nestedPopoverTrigger = clickedPopoverOwner
        ? document.querySelector(
            `[data-popover-trigger-owner="${clickedPopoverOwner}"]`,
          )
        : null;
      const clickedInsideNestedOwnedPopover =
        !!nestedPopoverTrigger &&
        (!!popoverRootRef.current?.contains(nestedPopoverTrigger) ||
          !!currentPopoverEl?.contains(nestedPopoverTrigger));
      if (
        clickedInsideModalPortal ||
        clickedInsideHost ||
        clickedInsideOwnedPopover ||
        clickedInsideNestedOwnedPopover
      ) {
        return;
      }
      if (popover) {
        if (!isPopoverControlled) setInternalPopoverOpen(false);
        popover.onOpenChange?.(false);
        return;
      }
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, [isPopoverControlled, popover, popoverOwnerId]);
  const setPopoverOpen = (nextOpen: boolean) => {
    if (!popover) return;
    if (!isPopoverControlled) setInternalPopoverOpen(nextOpen);
    popover.onOpenChange?.(nextOpen);
  };
  const handleMouseEnterInternal: React.MouseEventHandler = (event) => {
    onMouseEnter?.(event);
  };
  const handleMouseLeaveInternal: React.MouseEventHandler = (event) => {
    onMouseLeave?.(event);
  };
  const handleMouseDownInternal: React.MouseEventHandler = (event) => {
    onMouseDown?.(event);
  };
  const handleMouseUpInternal: React.MouseEventHandler = (event) => {
    onMouseUp?.(event);
  };
  const handlePointerDownInternal: React.PointerEventHandler = (event) => {
    onPointerDown?.(event);
  };
  const handlePointerUpInternal: React.PointerEventHandler = (event) => {
    onPointerUp?.(event);
  };
  const handlePointerCancelInternal: React.PointerEventHandler = (event) => {
    onPointerCancel?.(event);
  };
  const handlePointerLeaveInternal: React.PointerEventHandler = (event) => {
    onPointerLeave?.(event);
  };
  const handleTouchStartInternal: React.TouchEventHandler = (event) => {
    onTouchStart?.(event);
  };
  const handleTouchEndInternal: React.TouchEventHandler = (event) => {
    onTouchEnd?.(event);
  };
  const handleTouchCancelInternal: React.TouchEventHandler = (event) => {
    onTouchCancel?.(event);
  };
  const handleContextMenuInternal: React.MouseEventHandler = (event) => {
    onContextMenu?.(event);
  };
  const commonProps = {
    "aria-label": resolvedAriaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": resolvedAriaDescribedBy,
    "aria-controls": popover ? ariaControls : undefined,
    "aria-expanded": popover ? ariaExpanded : undefined,
    "aria-haspopup": popover ? ariaHasPopup : undefined,
    onMouseEnter: handleMouseEnterInternal,
    onMouseLeave: handleMouseLeaveInternal,
    onMouseDown: handleMouseDownInternal,
    onMouseUp: handleMouseUpInternal,
    onPointerDown: handlePointerDownInternal,
    onPointerUp: handlePointerUpInternal,
    onPointerCancel: handlePointerCancelInternal,
    onPointerLeave: handlePointerLeaveInternal,
    onTouchStart: handleTouchStartInternal,
    onTouchEnd: handleTouchEndInternal,
    onTouchCancel: handleTouchCancelInternal,
    onContextMenu: handleContextMenuInternal,
    onKeyUp,
  };
  const handleTriggerClick = (e: React.MouseEvent) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (!popover || disabled) return;
    const closeOnClickTrigger = popover.closeOnClickTrigger !== false;
    if (popoverOpen && !closeOnClickTrigger) return;
    setPopoverOpen(!popoverOpen);
  };
  const close = () => setPopoverOpen(false);
  const setPopoverHostRef = (element: HTMLDivElement | null) => {
    popoverRootRef.current = element;
    setRefValue(ref, element);
  };
  const setContainerRef = (element: HTMLElement | null) => {
    if (popover) return;
    setRefValue(ref, element);
  };
  const withPopover = (trigger: React.ReactNode) => {
    if (!popover) return trigger;
    return (
      <View
        ref={setPopoverHostRef}
        data-popover-trigger-owner={popoverOwnerId}
        width="clamp(0px, 100%, 100%)"
        style={{ position: "relative", overflow: "visible" }}
        inline
      >
        <View ref={popoverAnchorRef} width="clamp(0px, 100%, 100%)" inline>
          {trigger}
        </View>
        {popover && (
          <Dialog
            mode="popover"
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
            popover={{
              anchorRef: popoverAnchorRef,
              strategy: popover.strategy ?? "anchored",
              ...(popover as any),
            }}
          >
            <PopoverContext.Provider value={{ close }}>
              {popover.content}
            </PopoverContext.Provider>
          </Dialog>
        )}
      </View>
    );
  };
  const withForm = (trigger: React.ReactNode) => {
    if (!form) return trigger;
    return (
      <form style={{ display: "contents" }} {...resolvedFormProps}>
        {trigger}
      </form>
    );
  };

  if (href) {
    const handleClick: React.MouseEventHandler = (e) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      handleTriggerClick(e);
    };

    const shouldUseAnchor =
      typeof href === "string" &&
      (href.startsWith("//") ||
        hasExternalScheme(href) ||
        target === "_blank" ||
        download !== undefined);
    const nextHref = href;

    if (disabled) {
      const Element = (
        isSquircle ? Squircle : motionProps ? motion.button : "button"
      ) as any;
      const extraProps = isSquircle
        ? {
            as: "button",
            radius,
            ...(motionProps ? { motion: motionProps } : {}),
          }
        : {};
      return withPopover(
        withForm(
          <Element
            ref={setContainerRef as any}
            data-color-mode={dataColorMode}
            className={commonClassName}
            style={commonStyle}
            title={nativeTitle}
            type="button"
            disabled
            tabIndex={-1}
            onKeyDown={onKeyDown}
            {...(!isSquircle && motionProps ? motionProps : undefined)}
            {...extraProps}
            {...commonProps}
            {...restProps}
          >
            {children}
          </Element>,
        ),
      );
    }
    if (shouldUseAnchor) {
      const Element = (
        isSquircle ? Squircle : motionProps ? motion.a : "a"
      ) as any;
      const extraProps = isSquircle
        ? { as: "a", radius, ...(motionProps ? { motion: motionProps } : {}) }
        : {};
      return withPopover(
        withForm(
          <Element
            ref={setContainerRef as any}
            data-color-mode={dataColorMode}
            className={commonClassName}
            style={commonStyle}
            tabIndex={tabIndex}
            href={href}
            target={target}
            rel={rel}
            download={download}
            title={nativeTitle}
            onClick={handleClick}
            onKeyDown={onKeyDown}
            {...(!isSquircle && motionProps ? motionProps : undefined)}
            {...extraProps}
            {...commonProps}
            {...restProps}
          >
            {children}
          </Element>,
        ),
      );
    }
    const Element = (
      isSquircle ? Squircle : motionProps ? MotionLink : Link
    ) as any;
    const extraProps = isSquircle
      ? { as: Link, radius, ...(motionProps ? { motion: motionProps } : {}) }
      : {};
    return withPopover(
      withForm(
        <Element
          ref={setContainerRef as any}
          data-color-mode={dataColorMode}
          className={commonClassName}
          style={commonStyle}
          tabIndex={tabIndex}
          href={nextHref}
          target={target}
          rel={rel}
          download={download}
          title={nativeTitle}
          onClick={handleClick}
          onKeyDown={onKeyDown}
          {...(!isSquircle && motionProps ? motionProps : undefined)}
          {...extraProps}
          {...commonProps}
          {...restProps}
        >
          {children}
        </Element>,
      ),
    );
  }

  if (isControlType) {
    const resolvedControlPreset =
      themePreset ?? (checked ? "BaseFull" : "UIPrimary");
    const resolvedControlSelected = selected ?? checked;
    const Element = (
      isSquircle ? Squircle : motionProps ? motion.label : "label"
    ) as any;
    const extraProps = isSquircle
      ? { as: "label", radius, ...(motionProps ? { motion: motionProps } : {}) }
      : {};

    return withPopover(
      withForm(
        <Element
          ref={setContainerRef as any}
          data-color-mode={dataColorMode}
          className={clsx(
            styles.Pressable,
            ...resolveThemeClasses({
              themePreset: resolvedControlPreset,
              background,
              color,
              themeInteractive,
              selected: resolvedControlSelected,
              disabled,
            readOnly,
            isInteractive: true,
            }),
            Border(border),
            className,
          )}
          style={{ position: "relative", cursor: "pointer", ...commonStyle }}
          title={nativeTitle}
          onKeyDown={onKeyDown}
          {...(!isSquircle && motionProps ? motionProps : undefined)}
          {...extraProps}
          {...commonProps}
          {...restProps}
        >
          <View>
            <input
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
              type={type}
              onChange={onChange}
              checked={checked}
              disabled={disabled}
              value={value}
              name={name}
              aria-label={resolvedAriaLabel}
              aria-labelledby={ariaLabelledBy}
              aria-describedby={resolvedAriaDescribedBy}
            />
            {children}
          </View>
        </Element>,
      ),
    );
  }

  if (shouldRenderButton && insideButton) {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(e as never);
        if (popover) {
          setPopoverOpen(!popoverOpen);
        }
      }
    };
    const Element = (isSquircle ? Squircle : View) as any;
    const extraProps = isSquircle
      ? { as: "div", radius, ...(motionProps ? { motion: motionProps } : {}) }
      : { ...(motionProps ? { motion: motionProps } : {}) };
    return withPopover(
      withForm(
        <Element
          ref={setContainerRef}
          data-color-mode={dataColorMode}
          role="button"
          aria-disabled={disabled || undefined}
          data-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : (tabIndex ?? 0)}
          className={commonClassName}
          style={commonStyle}
          title={nativeTitle}
          onClick={disabled ? undefined : handleTriggerClick}
          onKeyDown={handleKeyDown}
          {...extraProps}
          {...commonProps}
          {...restProps}
        >
          {children}
        </Element>,
      ),
    );
  }

  if (shouldRenderButton) {
    const Element = (
      isSquircle ? Squircle : motionProps ? motion.button : "button"
    ) as any;
    const extraProps = isSquircle
      ? {
          as: "button",
          radius,
          ...(motionProps ? { motion: motionProps } : {}),
        }
      : {};
    return withPopover(
      withForm(
        <ButtonNestingContext.Provider value={true}>
          <Element
            ref={setContainerRef as any}
            data-color-mode={dataColorMode}
            onClick={handleTriggerClick}
            className={commonClassName}
            style={commonStyle}
            title={nativeTitle}
            type={isButtonType(type) ? type : "button"}
            tabIndex={tabIndex}
            disabled={disabled}
            onKeyDown={onKeyDown}
            {...(!isSquircle && motionProps ? motionProps : undefined)}
            {...extraProps}
            {...commonProps}
            {...restProps}
          >
            {children}
          </Element>
        </ButtonNestingContext.Provider>,
      ),
    );
  }

  const FallbackElement = (isSquircle ? Squircle : View) as any;
  const fallbackExtraProps = isSquircle
    ? { as: "div", radius, ...(motionProps ? { motion: motionProps } : {}) }
    : { ...(motionProps ? { motion: motionProps } : {}) };
  return withPopover(
    withForm(
      <FallbackElement
        ref={setContainerRef}
        data-color-mode={dataColorMode}
        className={commonClassName}
        style={commonStyle}
        title={nativeTitle}
        onKeyDown={onKeyDown}
        {...fallbackExtraProps}
        {...commonProps}
        {...restProps}
      >
        {children}
      </FallbackElement>,
    ),
  );
});
export default Pressable;
