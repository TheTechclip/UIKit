import clsx from "clsx";
import Image from "next/image";
import View from "../../Frameworks/View/View";
import Icon from "../Icon/Icon";
import Profile from "../Profile/Profile";
import Text from "../Text/Text";
import styles from "./Layout.docs.module.scss";
import type { DocsLayoutProps } from "./Layout.docs.types";
export default function DocsLayout({
  children,
  image,
  header,
  fontType,
  author,
  createdBy,
  caption,
  title,
  mobileTitleShown,
  onlyHeaderTitleShown,
  bodyClassName,
  "data-color-mode": dataTheme,
}: DocsLayoutProps) {
  const usePlainTextBody = typeof children === "string";
  const hasLayoutTitle = Boolean(title || caption);
  const showLayoutTitle = hasLayoutTitle && !onlyHeaderTitleShown;

  const layoutContent = (
    <View
      style={{ position: "relative", minHeight: "100dvh" }}
      fullWidth
      data-color-mode={dataTheme}
      column
      alignItems="center"
      background="Base2"
    >
      <View className={styles.DocsLayoutInner} column gap={32}>
        {image && (
          <Image
            alt=""
            src={image}
            width={3840}
            height={2160}
            style={{
              width: "100%",
              maxHeight: "38rem",
              height: "52vw",
              objectFit: "cover",
            }}
          />
        )}
        <View
          style={{ minWidth: 0, paddingBottom: "1.6rem" }}
          fullWidth
          column
          gap={24}
        >
          {showLayoutTitle && (
            <View
              className={clsx(
                styles.DocsLayoutGroupTitle,
                mobileTitleShown && styles.DocsLayoutGroupTitleMobileOnly,
              )}
              style={{ minWidth: 0 }}
              fullWidth
              data-layout-title-source="true"
              column
              gap={24}
            >
              {title && (
                <Text
                  type="LargeTitle"
                  fontType={fontType || "serif"}
                  className={styles.DocsLayoutTitleText}
                >
                  {title}
                </Text>
              )}
              {caption && (
                <Text
                  type="Footnote"
                  fontType={fontType || "serif"}
                  opacity={0.8}
                >
                  {caption}
                </Text>
              )}
            </View>
          )}
          <View opacity={0.6} column gap={10}>
            {(author?.avatarUrl ||
              author?.username ||
              author?.displayName ||
              author?.joinedAtText ||
              author?.id) && (
              <Profile
                size={{ avatar: 16, textType: "Caption1" }}
                avatarUrl={author.avatarUrl}
                displayName={author.displayName || author.username || ""}
                id={author.id}
                username={author.username}
                joinedAtText={author.joinedAtText}
              />
            )}
            {createdBy && (
              <View alignItems="center" gap={6}>
                <Icon icon="iDate" size={16} />
                <Text type="Caption1" weight={400}>
                  {createdBy}
                </Text>
              </View>
            )}
          </View>
        </View>

        {usePlainTextBody ? (
          <Text
            type="Body"
            fontType={fontType || "serif"}
            weight={400}
            lineHeight={1.8}
            className={bodyClassName}
            style={{
              whiteSpace: "pre-line",
              width: "clamp(0px, 100%, 100%)",
              overflowWrap: "anywhere",
            }}
          >
            {children}
          </Text>
        ) : (
          <View
            className={bodyClassName}
            width="clamp(0px, 100%, 100%)"
            style={{ overflowWrap: "anywhere" }}
          >
            {children}
          </View>
        )}
      </View>
    </View>
  );
  return (
    <>
      {header}
      {layoutContent}
      {}
    </>
  );
}
