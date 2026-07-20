You are a concise coding assistant.

## Stack

- Primary stack: Next.js 16 + TypeScript.

## Documentation References

- You MUST also read and adhere to the foundational guidelines located in the root directory: `uikit.md`, `writing-conventions.md`, `source-conventions.md`, `reference-conventions.md`, and `design-philosophy.md`.
- Before using or modifying any component, framework, or style, you MUST read the corresponding documentation in `.agents/references/`.
- **Documentation MUST Be Updated Immediately:** Every time you add, modify, or remove a component, framework, style, or any exported API/type, you MUST update the corresponding `.agents/references/` doc in the **same batch of tool calls** — not later, not after tests, not when asked. You must check what changed and update refs before moving to the next task.
- If references have drifted from the actual code due to manual changes, analyze the source code and git history to align them.
- **README Maintenance:** If you add, remove, or modify external package dependencies, you MUST update the Acknowledgements section in `README.md`.
- **README Examples:** If the usage logic or APIs of core layout components (`View`, `Pressable`, `ImageView`) change, you MUST update the example code block in `README.md` to reflect those changes.

## Test Failure Resolution

When a test fails, do not blindly patch it to turn green. Reason about intent:
1. Understand the component's design contract — what it should do vs. what it actually does.
2. If the test correctly captures the intended behavior and the code violates it, fix the code.
3. If the code correctly implements the intended behavior and the test reflects outdated assumptions, fix the test.
4. If neither is clearly right, treat the component's source as the source of truth and align the test to match, unless you have explicit user instruction to change the behavior.

## Design Token Enforcement

- Theme design tokens (Radius, Color, Spacing, etc.) MUST be used at all times. Hardcoding raw pixel values, inline colors, or any literal style values instead of using the token system is strictly prohibited.

## Theme & Token System Guidelines

1. **Radius Scale Usage**
   - Use standard tokens: `None`, `Light`, `Regular`, `Bold`, `ExtraBold`, `Heavy`, `Circle`.
   - Explicit `cornerRadius` or directional radius arrays are supported.
   - Centralized `RADIUS_TOKEN` mapping via `RadiusValue()` must be used.

2. **Color & Paint Tokens**
   - Palette colors must use the JSON expansion/SCSS mapping (e.g. `Red1TP3`, `BaseLight3`).
   - Background props support state-specific mappings: `[idle, hover, active]`.
   - Border props support paint tokens, width-only fallback (`Base1TP1`), and directional width arrays.
   - Use `UISecondary` / `ReversedUISecondary` presets for default interactive element states (e.g., checked, selected).

3. **Core Component Selection**
   - Do not use raw HTML elements (`div`, `button`, `a`, `Link`) when custom layout blocks are available. `View` and `Pressable` are foundational primitives replacing these elements.
   - Use `View` for structural layout. It dynamically resolves theme props, handles disabling/readonly state forwarding, and automatically applies `Squircle` clips when `radius` is present.
   - Use `Pressable` for interactive elements. It renders polymorphic wrappers (button, a, Link, label) with proper radius resolution.
   - **Layout & Sizing Defaults:** `View` and `Pressable` inherently use `display: flex` and support layout props like `gap`, `width`, and `height`.
     - Numeric values for sizing/spacing props are automatically converted to `rem` values.
     - For responsive or bounded sizing, use `min`, `max`, and `clamp` functions on `width` and `height` props.
     - Avoid redundant inline styles or unnecessary utility classes by leveraging these built-in properties.
- Package is published as `@musecat/uikit` on GitHub Packages. The root `index.ts` is the single entry point.
   - **No internal barrels:** Directories must NOT contain `index.ts` re-exports. Always import from the definitive source file. The single exception is the root `index.ts` (npm package entry).
   - **Type Referencing & Image:** Both components support various other props. You MUST refer to the TypeScript definitions of `View` and `Pressable` to check available attributes. For rendering images, use the custom `ImageView` component instead of the native `img` element.

4. **Squircle & Motion Integration**
   - `Squircle` renders SVG clip paths dynamically using `figma-squircle`.
   - Avoid passing raw animate objects containing width/height directly to Framer Motion on Squircle elements to prevent base-style clip-path reset bugs. Use imperative controls (`useAnimationControls`) or animate wrapping wrappers instead.
