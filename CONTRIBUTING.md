# Contributing to @musecat/uikit

Thank you for your interest in contributing! We welcome bug reports, feature suggestions, and pull requests.

## Development Setup

```bash
git clone https://github.com/TheTechclip/UIKit.git
cd uikit
npm install
```

## Available Scripts

| Command | Description |
|---|---|
| `npm test` | Run all tests with Vitest |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run lint` | Lint all files with Biome |
| `npm run lint:css` | Lint SCSS files with Stylelint |
| `npm run format` | Format all files with Prettier + Biome |
| `npm run test:coverage` | Run tests with coverage report |

## Code Standards

- TypeScript strict mode is enabled — ensure your code compiles without errors.
- All new features must include corresponding tests.
- Components and hooks that access browser APIs must start with `"use client"`.
- Follow the existing code style (spaces, double quotes, semicolons).
- Design tokens (Radius, Color, Spacing) must be used — hardcoded pixel values are prohibited.

## Pull Request Process

1. Create a feature branch from `main`.
2. Write tests for your changes.
3. Ensure `npm run typecheck && npm run lint && npm test` passes.
4. Open a pull request describing the change and its motivation.

## Questions?

Feel free to open a discussion or issue for any questions.
