import clsx from "clsx";
import EdgeEffect from "../../Frameworks/EdgeEffect/EdgeEffect";
import View from "../../Frameworks/View/View";
import styles from "./Header.module.scss";
import type { HeaderProps } from "./Header.types";

export default function Header({
  "data-color-mode": dataTheme,
  left,
  center,
  right,
  className,
  wrapperClassName,
}: HeaderProps) {
  return (
    <>
      <EdgeEffect side="top" className={styles.LinearBlur} />
      <header
        className={className}
        data-color-mode={dataTheme}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1200,
        }}
      >
        <View
          className={clsx(styles.Wrapper, wrapperClassName)}
          alignItems="center"
          justifyContent="space-between"
          gap={4}
        >
          {left}
          {center}
          {right}
        </View>
      </header>
    </>
  );
}
