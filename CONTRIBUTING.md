# Contributing to @musecat/uikit

Thank you for contributing. Changes to this repository affect a source-distributed component library, so implementation, tests, public exports, and references must remain aligned.

## Local setup

```bash
git clone https://github.com/TheTechclip/UIKit.git
cd UIKit
npm install
```

Use Node.js 20 or newer. The repository uses npm and has a peer dependency on Next.js, React, React DOM, Motion, and `@musecat/functionkit`.

## Required workflow

1. Read the relevant `.agents/references` files and the TypeScript source before editing a component, framework, or style.
2. Make the smallest behaviourally complete change; do not replace `View`, `Pressable`, or `ImageView` with native alternatives.
3. Update the corresponding reference document in the same change whenever an implementation, type, or public export changes.
4. Add or adjust focused tests that describe the intended contract.
5. Run the checks appropriate to the change before opening a pull request.

## Validation

| Command | When to run it |
| --- | --- |
| `npm run typecheck` | Every TypeScript or public API change. |
| `npm test` | Every behaviour change. |
| `npm run lint` | Before submitting a pull request. |
| `npm run lint:css` | After SCSS changes. |
| `npm run test:coverage` | When adding tests or changing coverage-sensitive code. |

## Code and design rules

- Keep strict TypeScript types; do not mask contract problems with broad casts.
- Use UIKit theme, spacing, radius, and color tokens. Do not introduce raw pixel, color, or ad-hoc style literals where a token-backed prop exists.
- `View` is the structural primitive; `Pressable` is the interactive primitive; `ImageView` renders images.
- Preserve the `View`/`Pressable` to `Squircle` radius path. Avoid directly animating Squircle width or height with a Motion animate object.
- Add new public exports only to the root [`index.ts`](./index.ts). Directories must not introduce internal barrel files.
- If an external dependency is added, removed, or materially changed, update README acknowledgements in the same pull request.

## Pull requests

Describe the user-visible behaviour, affected public API, documentation changes, and validation you ran. Keep unrelated workspace changes out of the pull request; this repository may contain concurrent work.

## Reporting issues

Use a reproducible example, expected behaviour, actual behaviour, browser/runtime version, and relevant screenshots or error output. Report security issues through the process in [SECURITY.md](./SECURITY.md), not a public issue.
