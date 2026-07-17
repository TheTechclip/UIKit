# Layout Component Documentation

## Purpose

Acts as a container that establishes the common structure of applications and pages. Provides the base page layout (`Layout`), grid-based arrangement (`Layout.Grid`, `Layout.Section`), and a layout specialized for documents or posts (`DocsLayout`) to help build consistent UI composition and structure.

## Usage Logic

- **`Layout`**: Used as the top-level container of a page, composing the overall page frame via props such as `title`, `header`, `backgroundImage`, `children`.
- **`Layout.Grid` & `Layout.Section`**: Used under `Layout` to split content into a grid (`Grid`) or group it into a specific area (`Section`) with a title.
- **`Layout.docs`**: A dedicated layout for rendering document/post-style content such as a cover image, author info (profile), and creation date.

## Type Signatures

```tsx
// Layout.types.ts
export interface BackgroundImageValue {
  height?: UIKitSizeValue;
  src?: string;
  filter?: CSSProperties["filter"];
  margin?: BackgroundMarginValue;
}

export interface LayoutProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  caption?: React.ReactNode;
  titleType?: TitleProps["titleType"];
  titleFontType?: TextProps["fontType"];
  mobileTitleShown?: boolean;
  header?: React.ReactNode;
  backgroundImage?: string | BackgroundImageValue;
  // ...
}

export interface LayoutGridViewProps {
  children?: React.ReactNode;
  ratio?: string;
  gap?: ViewProps["gap"];
  groupGap?: ViewProps["gap"];
  // ...
}

export interface LayoutSectionProps extends ViewProps {
  group?: string;
  title?: React.ReactNode | TitleProps["title"];
  titleType?: TitleProps["titleType"];
  // ...
}

// Layout.docs.types.ts
export interface DocsLayoutProps {
  children?: React.ReactNode;
  image?: string;
  header?: React.ReactNode;
  author?: ProfileProps;
  createdBy?: string;
  title?: React.ReactNode;
  // ...
}
```

## Example Code

```tsx
import { Layout } from "@musecat/uikit";
import { DocsLayout } from "@musecat/uikit";

// Basic layout and section split
export function MyPage() {
  return (
    <Layout
      title="Dashboard"
      backgroundImage={{ src: "/bg.png", height: "300px" }}
    >
      <Layout.Grid ratio="1fr 1fr" gap={16}>
        <Layout.Section title="Recent News" titleType="Title2">
          <div>News content 1</div>
          <div>News content 2</div>
        </Layout.Section>
        <Layout.Section title="Statistics">
          <div>Chart area</div>
        </Layout.Section>
      </Layout.Grid>
    </Layout>
  );
}

// Document-style layout
export function MyPost() {
  return (
    <DocsLayout
      title="Component Docs"
      author={{ displayName: "Hong Gildong", avatarUrl: "..." }}
      createdBy="2026-07-16"
      image="/cover.png"
    >
      Document body content goes here.
    </DocsLayout>
  );
}
```
