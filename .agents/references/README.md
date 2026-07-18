# UIKit reference guide

These documents describe the checked-in implementation of `@musecat/uikit`. They are not a second API surface: TypeScript definitions and the root [`index.ts`](../../index.ts) export list are authoritative when a reference and code differ.

## How to use the references

1. Start with the framework references for [`View`](./Frameworks/View.md), [`Pressable`](./Frameworks/Pressable.md), [`Theme`](./Frameworks/Theme.md), and [`Squircle`](./Frameworks/Squircle.md).
2. Read the matching component reference and its `*.types.ts` source before changing or consuming a specialized component.
3. Read the relevant Styles reference before adding SCSS or choosing tokens.
4. Keep implementation, tests, exports, README examples, and the corresponding reference document in the same change.

## Cross-cutting contracts

- Use `View` for structure, `Pressable` for interaction, and `ImageView` for images. Do not replace them with raw equivalents where UIKit primitives apply.
- Design colors, spacing, borders, shadows, blur, and radius must use the token system. Avoid raw component-local visual values.
- `radius` is a Squircle concern. Preserve the View/Pressable-to-Squircle path and do not directly animate Squircle width or height with a Motion animate object.
- `disabled` and `readOnly` must be consumed by components before props reach DOM nodes.
- UIKit exposes public APIs only through the root `index.ts`; there are no directory barrel files.

## Directory map

| Directory | Contents |
| --- | --- |
| [`Components`](./Components) | Reusable application-facing components and their contracts. |
| [`Frameworks`](./Frameworks) | Shared primitives, overlay systems, motion, theme, and view infrastructure. |
| [`Styles`](./Styles) | Global SCSS importer, token variables, generated utility classes, and viewport helpers. |

Each reference should identify its implementation source, explain state/interaction contracts, call out constraints that are easy to break, and provide an API-correct example using UIKit primitives.
