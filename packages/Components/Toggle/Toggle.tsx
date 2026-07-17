"use client";
import clsx from "clsx";
import { motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Spinner from "@/packages/Components/Spinner/Spinner";
import Text from "@/packages/Components/Text/Text";
import styles from "@/packages/Components/Toggle/Toggle.module.scss";
import type { ToggleProps } from "@/packages/Components/Toggle/Toggle.types";
import { Size, SizePX } from "@/packages/Frameworks/_shared/sizing";
import { useControllableState } from "@/packages/Frameworks/_shared/useControllableState";
import { Radius } from "@/packages/Frameworks/Theme/Radius.types";
import { Border } from "@/packages/Frameworks/Theme/Theme.types";
import View from "@/packages/Frameworks/View/View";

type ToggleTrackStyle = React.CSSProperties & {
  "--toggle-padding"?: string;
  "--toggle-circle-size"?: string;
};

export default function Toggle({
  title,
  titleType,
  titleSpaceBetween,
  reversed,
  readOnly,
  loading,
  size,
  width,
  height,
  checked: checkedProp,
  defaultChecked,
  disabled,
  onChange,
  themePreset,
  background,
  color,
  ...props
}: ToggleProps) {
  const resolvedHeight = size ?? height;
  const heightPX = SizePX(resolvedHeight, 24, 10);
  const resolvedWidth =
    width ?? (heightPX !== undefined ? heightPX * 1.75 : undefined);
  const togglePadding =
    heightPX !== undefined ? `${heightPX / 12}px` : undefined;
  const toggleCircleSize =
    heightPX !== undefined
      ? `${Math.max(0, heightPX - (heightPX / 12) * 2)}px`
      : undefined;
  const toggleTrackStyle: ToggleTrackStyle = {
    order: reversed ? 1 : undefined,
    cursor: "default",
    position: "relative",
    "--toggle-padding": togglePadding,
    "--toggle-circle-size": toggleCircleSize,
  };
  const [checked, setChecked, isControlled] = useControllableState({
    value: checkedProp,
    defaultValue: Boolean(defaultChecked),
  });
  const [dragRange, setDragRange] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visualLabelChecked, setVisualLabelChecked] = useState(() => checked);
  const inputRef = useRef<HTMLInputElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const dragStartXRef = useRef(0);
  const visualLabelCheckedRef = useRef(checked);
  const emitChange = useCallback(
    (nextChecked: boolean) => {
      if (disabled || readOnly || loading) return;
      if (!isControlled) setChecked(nextChecked);
      if (inputRef.current) inputRef.current.checked = nextChecked;
      onChange?.({
        target: (inputRef.current ?? {
          checked: nextChecked,
        }) as HTMLInputElement,
        currentTarget: (inputRef.current ?? {
          checked: nextChecked,
        }) as HTMLInputElement,
      } as React.ChangeEvent<HTMLInputElement>);
    },
    [disabled, isControlled, loading, onChange, readOnly, setChecked],
  );
  useLayoutEffect(() => {
    const updateRange = () => {
      if (!trackRef.current || !knobRef.current) return;
      const trackWidth = trackRef.current.getBoundingClientRect().width;
      const knobWidth = knobRef.current.getBoundingClientRect().width;
      const knobStyle = window.getComputedStyle(knobRef.current);
      const knobLeft = Number.parseFloat(knobStyle.left) || 0;
      setDragRange(Math.max(0, trackWidth - knobWidth - knobLeft * 2));
    };
    updateRange();
    window.addEventListener("resize", updateRange);
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            updateRange();
          })
        : null;
    if (resizeObserver) {
      if (trackRef.current) {
        resizeObserver.observe(trackRef.current);
      }
      if (knobRef.current) {
        resizeObserver.observe(knobRef.current);
      }
    }
    return () => {
      window.removeEventListener("resize", updateRange);
      resizeObserver?.disconnect();
    };
  }, []);
  const handleToggle = useCallback(() => {
    emitChange(!checked);
  }, [checked, emitChange]);

  const applyVisualProgress = useCallback((nextProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(1, nextProgress));
    const progressPercent = `${Math.round(clampedProgress * 100)}%`;
    const nextLabelChecked = clampedProgress >= 0.5;

    if (trackRef.current) {
      trackRef.current.style.background = `color-mix(in srgb, var(--color-base-dark-1) ${progressPercent}, color-mix(in srgb, var(--color-base-light-4) 55%, transparent))`;
    }

    if (knobRef.current) {
      knobRef.current.style.background = `color-mix(in srgb, var(--color-base-light-1) ${progressPercent}, var(--color-base-light-1))`;
    }

    if (visualLabelCheckedRef.current !== nextLabelChecked) {
      visualLabelCheckedRef.current = nextLabelChecked;
      setVisualLabelChecked(nextLabelChecked);
    }
  }, []);

  useEffect(() => {
    visualLabelCheckedRef.current = checked;
    setVisualLabelChecked(checked);
    applyVisualProgress(checked ? 1 : 0);
  }, [applyVisualProgress, checked]);

  return (
    <label
      className={styles.ToggleWrapper}
      title={title}
      data-disabled={disabled ? "true" : undefined}
      data-readonly={readOnly ? "true" : undefined}
      style={{
        justifyContent: titleSpaceBetween ? "space-between" : undefined,
        width: titleSpaceBetween ? "100%" : undefined,
      }}
    >
      <input
        ref={inputRef}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        readOnly
        className={styles.Input}
        checked={checked}
        disabled={disabled || loading}
        {...props}
        onKeyDown={(e) => {
          if (disabled || readOnly || loading) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
          props.onKeyDown?.(e);
        }}
      />
      <View
        ref={trackRef}
        width={Size(resolvedWidth) ?? "4.4rem"}
        height={Size(resolvedHeight) ?? "2.4rem"}
        data-checked={checked || undefined}
        data-loading={loading || undefined}
        data-dragging={dragging || undefined}
        data-pressed={pressed || undefined}
        onClick={(e) => {
          e.preventDefault();
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }
          handleToggle();
        }}
        onPointerDown={() => {
          if (disabled || readOnly || loading) return;
          setPressed(true);
        }}
        onPointerUp={() => {
          setPressed(false);
        }}
        onPointerCancel={() => {
          setPressed(false);
        }}
        onPointerLeave={() => {
          if (!dragging) {
            setPressed(false);
          }
        }}
        style={toggleTrackStyle}
        radius="Circle"
      >
        <motion.div
          ref={knobRef}
          className={clsx(styles.ToggleCircle, Border("Base3TP1"))}
          style={{ borderRadius: Radius("Circle") }}
          drag={disabled || readOnly || loading ? false : "x"}
          dragConstraints={{ left: 0, right: dragRange }}
          dragElastic={0}
          dragMomentum={false}
          animate={{
            x: checked ? dragRange : 0,
            scale: pressed || dragging ? 1.4 : 1,
          }}
          transition={{
            x: { type: "spring", stiffness: 700, damping: 40 },
            scale: { type: "spring", stiffness: 420, damping: 22 },
          }}
          onDragStart={() => {
            setDragging(true);
            setPressed(true);
            suppressClickRef.current = false;
            dragStartXRef.current = checked ? dragRange : 0;
          }}
          onDrag={(_, info) => {
            const currentX = Math.max(
              0,
              Math.min(dragRange, dragStartXRef.current + info.offset.x),
            );
            applyVisualProgress(dragRange ? currentX / dragRange : 0);
          }}
          onDragEnd={(_, info) => {
            setDragging(false);
            setPressed(false);
            suppressClickRef.current = Math.abs(info.offset.x) > 3;
            const startX = checked ? dragRange : 0;
            const endX = Math.max(
              0,
              Math.min(dragRange, startX + info.offset.x),
            );
            const nextChecked = endX >= dragRange / 2;
            applyVisualProgress(nextChecked ? 1 : 0);
            emitChange(nextChecked);
          }}
        >
          {loading ? (
            <View opacity={0.4}>
              <Spinner
                size={12}
                strokeWidth={6}
                color={visualLabelChecked ? "Reversed1" : "Base1"}
              />
            </View>
          ) : null}
        </motion.div>
      </View>
      {title && <Text type={titleType ?? "Subheadline"}>{title}</Text>}
    </label>
  );
}
