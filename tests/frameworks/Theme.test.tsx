import { describe, expect, test } from "vitest";
import { Radius } from "../../packages/frameworks/Theme/Radius.types";
import {
  BackgroundBlur,
  Border,
  resolveThemeClasses,
  Shadow,
} from "../../packages/frameworks/Theme/Theme.types";

describe("Theme utilities", () => {
  test("Radius resolves correctly", () => {
    expect(Radius(10)).toBe("1rem");
    expect(Radius("Regular")).toBe("var(--radius-system)");
    expect(Radius("None")).toBe(0);
  });

  test("Shadow resolves correctly", () => {
    expect(Shadow("Light")).toBe("ThemeShadow-1");
    expect(Shadow("Bold")).toBe("ThemeShadow-3");
    expect(Shadow("None")).toBeUndefined();
  });

  test("BackgroundBlur resolves correctly", () => {
    expect(BackgroundBlur("ExtraLight")).toBe("BackgroundBlur-ExtraLight");
  });

  test("Border resolves correctly", () => {
    expect(Border("None")).toBe("ThemeBorder-Base6TP1-None");
    expect(Border("Light")).toBe("ThemeBorder-Base6TP1-Light");
    expect(Border("Red1TP1")).toBe("ThemeBorder-Red1TP1-Regular");
  });

  test("resolveThemeClasses works as expected", () => {
    const classes = resolveThemeClasses({ themePreset: "UIPrimary" });
    expect(classes).toContain("ThemeBg-Base1");
    expect(classes).toContain("ThemeColor-Base1");
  });
});
