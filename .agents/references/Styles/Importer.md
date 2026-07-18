# Global style importer

**Source:** [`packages/Styles/_importer.scss`](../../../packages/Styles/_importer.scss)

`_importer.scss` is the single global SCSS entry point. It loads modules in this exact order:

1. animation
2. color
3. font
4. system
5. textstyle
6. theme
7. viewport
8. viewport-global

Color, font, and animation variables must exist before the reset and utility modules use them. Preserve this ordering when adding a global module. Component-scoped SCSS should import only the helpers it needs, commonly `@use "../../Styles/viewport" as viewport;`, rather than importing the global bundle again.

## Application integration

```scss
/* app/globals.scss */
@use "@musecat/uikit/packages/Styles/importer";
```

Compile this file with Sass once at the application root. The library ships SCSS source; Next.js consumers need the `sass` package installed.
