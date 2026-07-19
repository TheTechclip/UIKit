# Icon font utilities

**Source:** [`packages/styles/_icon.scss`](../../../packages/styles/_icon.scss)

This document defines the icon font (min-icon based) and related weight adjustment classes.

## Icon Font Configuration

By default it is rendered using the `i` tag, with the `--font-icon` font stack and `font-variation-settings` applied. When the `.iFill` class is specified, the font setting (ss09) is turned on and the icon is converted to a filled (Solid) icon.

## Weight

Supports classes for fine-grained control of icon weight. Controls the CSS variable `--uikit-icon-font-weight`.

- `.iThin` (100)
- `.iExtraLight` (200)
- `.iLight` (300)
- `.iRegular` (400)
- `.iMedium` (500)
- `.iSemiBold` (600)
- `.iBold` (700)
- `.iExtraBold` (800)
- `.iBlack` (900)

## Icon Classes

Approximately several hundred icon classes are defined. Class names follow the `.i{IconName}` rule. Examples:

- `.iCircle`, `.iSquare`
- `.iClose`, `.iCheck`, `.iAdd`, `.iRemove`
- `.iInfo`, `.iWarning`, `.iQuestion`
- `.iMenu`, `.iMoreHoriz`, `.iMoreVert`
- Plus many arrows (Arrow), devices (Device), UI elements, etc.

## Usage

Use the `Icon` component for application UI. Direct icon-font classes are reserved for the framework's implementation and cases where `Icon` cannot be used; they do not provide the component's loading, image, SVG, pressable, sizing, or accessibility behaviour.

```html
<!-- Thin outlined close icon -->
<i class="iClose iLight"></i>

<!-- Bold filled warning icon -->
<i class="iWarning iFill iBold"></i>
```
