# Layout

**Source:** [`packages/components/Layout/Layout.tsx`](../../../packages/components/Layout/Layout.tsx) and [`Layout.types.ts`](../../../packages/components/Layout/Layout.types.ts)

`Layout` is the page-level composition primitive. It provides the outer scroll owner, an optional header and page title, a constrained inner content column, and a consistent section/grid vocabulary. It is not a generic replacement for `View`: use `Layout` once per route-level page and use `View` inside it for local structure.

## Choose the right level

| Need                                        | Use              | Why                                                            |
| ------------------------------------------- | ---------------- | -------------------------------------------------------------- |
| Page frame, title, header, background image | `Layout`         | Owns the scrollable page shell and title placement.            |
| Responsive multi-column page content        | `Layout.Grid`    | Supplies the grid ratio and section grouping.                  |
| A titled block inside a grid or page        | `Layout.Section` | Gives a section default vertical rhythm and Title integration. |
| Local card, row, stack, or alignment        | `View`           | Keeps page and component layout responsibilities separate.     |

## Layout page shell

`header` is rendered before the scroll owner. `title` and `caption` create the built-in Title block; `onlyHeaderTitleShown` suppresses that block, and `mobileTitleShown` makes it available only to the component's mobile style path. `titleContext` passes additional title-side content directly to `Title`.

`backgroundImage` accepts a source string or `{ src, height, filter, margin }`. Layout renders it as a fixed, decorative Next Image behind the content. It has empty alt text by design; do not use it for information-bearing imagery. Provide all actual page content through `children`.

## Grid and section rules

`Layout.Grid` enables CSS Grid with `ratio` assigned to `--layout-grid-ratio`; supply a normal CSS grid template such as `"minmax(0, 2fr) minmax(18rem, 1fr)"`. `gap` controls grid tracks and `groupGap` controls vertical spacing between sections in the same group.

`Layout.Section` always renders a full-width vertical `View`, defaulting to `gap={12}`. It accepts all compatible `ViewProps` plus title metadata. Use `titleProps` when a section needs multiple or fully customized `Title` configurations; otherwise use the concise `title`, `titleType`, `caption`, `suffix`, `meta`, and `actions` props.

Sections with the same `group` are wrapped together by `Layout.Grid`; ungrouped children remain direct grid items. Group names are layout identities, not visual color presets. Keep them stable and use `mobileOrder` for the intentional small-screen order of a section.

## Recommended composition

```tsx
import { Layout, Text, View } from "@musecat/uikit";

export function DashboardPage() {
  return (
    <Layout
      title="Dashboard"
      caption="An overview of current activity"
      header={<View height={56} fullWidth />}
    >
      <Layout.Grid ratio="minmax(0, 2fr) minmax(18rem, 1fr)" gap={24} groupGap={24}>
        <Layout.Section group="main" title="Recent activity" mobileOrder={1}>
          <View padding={16} radius="Regular" background="Base1" border="Light">
            <Text type="Body">Activity content</Text>
          </View>
        </Layout.Section>
        <Layout.Section group="aside" title="Summary" mobileOrder={2}>
          <View padding={16} radius="Regular" background="Base1" border="Light">
            <Text type="Body">Summary content</Text>
          </View>
        </Layout.Section>
      </Layout.Grid>
    </Layout>
  );
}
```

## Common mistakes

- Do not place independent page scroll containers inside `Layout`; it already owns vertical scrolling.
- Do not use `Layout.Section` solely for padding or a card. Use `View` for those local concerns.
- Do not treat `group` as a theme token or expect it to change styling.
- Do not use `DocsLayout` from this package entry point: it is a documentation-only type definition, not a root public export.
