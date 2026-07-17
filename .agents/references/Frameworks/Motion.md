# Motion Framework

## Purpose

The `Motion` framework is used to provide consistent animation effects and transition presets within UIKit. It centrally manages `framer-motion` (or `motion/react`) configuration values mainly applied to motion-based interfaces such as modals, sheets, and popovers.

## Usage Logic

- `motionTransitions`: An object managing animation physical properties (stiffness, damping, mass, etc.). Defines default behaviors such as spring or tween.
- `motionPresets`: Provides `initial`, `animate`, `exit` state definition objects or factory functions for specific UI components like modal, popover, and backdrop.

## Type Signatures

```typescript
// Inside Motion.presets.ts

export const motionTransitions = {
  sheet: { snap, entrance, exit },
  modal: { transition },
  popover: { transition },
  backdrop: { transition },
};

export const motionPresets = {
  modal: { initial, animate, exit, transition },
  popover: (isPositionReady: boolean) => ({
    initial,
    animate,
    exit,
    transition,
  }),
  backdrop: (open?: boolean) => ({ initial, animate, exit, transition }),
};
```

## Example Code

```tsx
import { motion } from "motion/react";
import { motionPresets } from "@/packages/Frameworks/Motion";

function AnimatedModal({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop animation */}
          <motion.div
            {...motionPresets.backdrop(isOpen)}
            className="backdrop"
          />

          {/* Modal body animation */}
          <motion.div {...motionPresets.modal} className="modal-content">
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```
