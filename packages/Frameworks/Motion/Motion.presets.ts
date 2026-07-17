export const motionTransitions = {
  sheet: {
    snap: { type: "spring" as const, stiffness: 520, damping: 48, mass: 0.9 },
    entrance: {
      type: "spring" as const,
      stiffness: 480,
      damping: 44,
      mass: 0.95,
    },
    exit: { type: "spring" as const, stiffness: 400, damping: 46, mass: 1.0 },
  },
  modal: {
    transition: { type: "spring" as const, stiffness: 380, damping: 38 },
  },
  popover: {
    transition: { duration: 0.16, ease: "easeOut" },
  },
  backdrop: {
    transition: { duration: 0.18 },
  },
} as const;

export const motionPresets = {
  modal: {
    initial: { opacity: 0, scale: 0.94, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.94, y: 8 },
    transition: motionTransitions.modal.transition,
  },
  popover: (isPositionReady: boolean) => ({
    initial: { opacity: 0, scale: 0.96 },
    animate: isPositionReady
      ? { opacity: 1, scale: 1 }
      : { opacity: 0, scale: 0.96 },
    exit: { opacity: 0, scale: 0.96 },
    transition: motionTransitions.popover.transition,
  }),
  backdrop: (open?: boolean) => ({
    initial: { opacity: 0 },
    animate:
      open === undefined
        ? { opacity: 1 }
        : open
          ? { opacity: 1 }
          : { opacity: 0 },
    exit: { opacity: 0 },
    transition: motionTransitions.backdrop.transition,
  }),
} as const;
