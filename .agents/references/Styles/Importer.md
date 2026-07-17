# Importer

The `_importer.scss` file is the entry point that imports and bundles all SCSS modules within the Styles package.

## Loaded Module List

1. `animation`
2. `color`
3. `font`
4. `icon`
5. `system`
6. `textstyle`
7. `theme`
8. `viewport`
9. `viewport-global`

## Usage

This file is used as the package distribution and compiler entry point. When adding styles, write them in individual files and add them to the Importer if necessary. During normal component development there is almost no need to modify this file directly.
