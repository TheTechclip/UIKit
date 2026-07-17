module.exports = {
  extends: ["stylelint-config-standard-scss"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // "scale-unlimited/declaration-strict-value": [
    //   ["/color/", "background-color", "border-radius", "box-shadow"],
    //   {
    //     ignoreValues: [
    //       "transparent",
    //       "inherit",
    //       "initial",
    //       "unset",
    //       "none",
    //       "currentColor",
    //       /var\(--.*\)/,
    //       /^0$/,
    //       /^100%$/,
    //       /^50%$/,
    //     ],
    //     message:
    //       "Theme token(SCSS variable or CSS custom property) must be used. Hardcoded values are forbidden.",
    //   },
    // ],
    "color-no-hex": [
      true,
      {
        message: "Hex colors are forbidden. Use theme tokens instead.",
      },
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["use", "forward", "include", "mixin", "extend"],
      },
    ],
    "selector-class-pattern": null,
    "color-function-notation": null,
    "alpha-value-notation": null,
    "property-no-vendor-prefix": null,
    "media-feature-range-notation": null,
  },
};
