# Text style tokens

**Source:** [`packages/styles/_textstyle.scss`](../../../packages/styles/_textstyle.scss)

This document defines the typography hierarchy and text style utility classes.

## Tokens (CSS Variables)

Font size and line-height are managed as tokens.

- `LargeTitle`: 3.8rem / 4.1rem
- `Title1`: 2.6rem / 3.3rem
- `Title2`: 2.2rem / 2.8rem
- `Title3`: 2.rem / 2.5rem
- `Headline`: 1.8rem / 2.2rem
- `Body`: 1.8rem / 2.2rem
- `Callout`: 1.7rem / 2.1rem
- `Subheadline`: 1.6rem / 2.0rem
- `Footnote`: 1.3rem / 1.8rem
- `Caption1`: 1.2rem / 1.7rem
- `Caption2`: 1.1rem / 1.3rem

## Utility Classes

Utility classes that can be used immediately on HTML tags or classes per the design system. Letter-spacing and font-weight are optimized for the font size.

- `.LargeTitle`
- `.Title1`, `h1`
- `.Title2`, `h2`
- `.Title3`, `h3`
- `.Headline`, `h4`
- `.Body`, `p`
- `.Callout`, `blockquote`
- `.Subheadline`, `h5`
- `.Footnote`, `h6`
- `.Caption1`, `small`
- `.Caption2`

## Usage

Use the `Text` component in React application code; it maps its `type` prop to this system and keeps color, trimming, and font-family behaviour aligned. These classes are primarily for stylesheet-level selectors or semantic HTML authored outside UIKit.

```html
<h1 class="Title1">Page Title</h1>
<p class="Body">This is body text.</p>
<span class="Caption1">Additional description</span>
```
