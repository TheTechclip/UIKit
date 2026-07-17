import Prism from "prismjs";
import CodeBox_Copy from "@/packages/Components/CodeBox/CodeBox.copy";
import styles from "@/packages/Components/CodeBox/CodeBox.module.scss";
import type { CodeBoxProps } from "@/packages/Components/CodeBox/CodeBox.types";
import { normalizeLang } from "@/packages/Frameworks/_shared/normalize";
import View from "@/packages/Frameworks/View/View";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";

export default function CodeBox({
  code,
  language,
  border,
  "data-color-mode": dataTheme,
  themePreset,
  background,
  color,
  shadow,
  radius,
  themeInteractive,
  selected,
  disabled,
  readOnly,
  backgroundBlur,
  className,
  style,
}: CodeBoxProps) {
  const lang = normalizeLang(language);
  const grammar = Prism.languages[lang] ?? Prism.languages.markup;
  const source = code.trim();
  const html = Prism.highlight(source, grammar, lang);
  const substitutedLanguage =
    language === "tsx"
      ? "TSX"
      : language === "jsx"
        ? "JSX"
        : language === "json"
          ? "JSON"
          : language === "python"
            ? "Py"
            : language;

  return (
    <View
      column
      gap={0}
      className={`${styles.CodeBox}${className ? ` ${className}` : ""}`}
      style={style}
      data-color-mode={dataTheme}
      border={border}
      background={background}
      themePreset={themePreset ?? "UIPrimary"}
      color={color}
      shadow={shadow}
      radius={radius ?? "Regular"}
      themeInteractive={themeInteractive}
      selected={selected}
      disabled={disabled}
      readOnly={readOnly}
      backgroundBlur={backgroundBlur}
    >
      {substitutedLanguage && (
        <CodeBox_Copy
          language={substitutedLanguage}
          code={source}
          data-color-mode={dataTheme}
        />
      )}
      {}
      {}
      <pre
        className={`${styles.Pre} language-${lang}`}
        data-color-mode={dataTheme}
      >
        <code
          className={`${styles.Code} language-${lang}`}
          data-color-mode={dataTheme}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </View>
  );
}
