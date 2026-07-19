import Pressable from "../../frameworks/Pressable/Pressable";
import View from "../../frameworks/View/View";
import Divider from "../Divider/Divider";
import Icon from "../Icon/Icon";
import type { TimelineItemProps, TimelineProps } from "./Timeline.types";

function TimelineItem({
  item,
  isLast,
  nodePreset,
  nodeBackground,
  nodeColor,
}: {
  item: TimelineItemProps;
  isLast: boolean;
  nodePreset?: TimelineProps["nodePreset"];
  nodeBackground?: TimelineProps["nodeBackground"];
  nodeColor?: TimelineProps["nodeColor"];
}) {
  const resolvedNodePreset = item.nodePreset ?? nodePreset;
  const resolvedNodeBackground = item.nodeBackground ?? nodeBackground;
  const resolvedNodeColor = item.nodeColor ?? nodeColor;

  return (
    <View
      style={{
        position: "relative",
        minWidth: 0,
        paddingBottom: isLast ? 0 : ".4rem",
      }}
      gap={12}
    >
      <View
        justifyContent="center"
        style={{ flexShrink: 0, width: "max-content" }}
        column
        alignItems="center"
        gap={6}
      >
        <View
          style={{ position: "relative", zIndex: 1, flexShrink: 0 }}
          padding={6}
          alignItems="center"
          justifyContent="center"
          radius="Circle"
          themePreset={resolvedNodePreset ?? "UIPrimary"}
          background={resolvedNodeBackground}
          color={resolvedNodeColor}
        >
          {item.node ??
            (item.icon ? (
              <Icon size={20} {...item.icon} />
            ) : (
              <View
                style={{ width: "3.2rem", height: "3.2rem" }}
                radius="Circle"
              />
            ))}
        </View>
        {!isLast && (
          <Divider
            vertical
            style={{
              flex: 1,
              alignSelf: "center",
            }}
          />
        )}
      </View>

      <Pressable
        style={{
          flex: 1,
          minWidth: 0,
          paddingTop: ".6rem",
          paddingBottom: "1.6rem",
        }}
        column
        {...(item.pressable ?? {})}
      >
        {item.children}
      </Pressable>
    </View>
  );
}
export default function Timeline({
  items,
  nodePreset,
  nodeBackground,
  nodeColor,
  className,
  style,
}: TimelineProps) {
  return (
    <View className={className} fullWidth style={style} column gap={6}>
      {items.map((item, index) => (
        <TimelineItem
          key={item.id ?? index}
          item={item}
          isLast={index === items.length - 1}
          nodePreset={nodePreset}
          nodeBackground={nodeBackground}
          nodeColor={nodeColor}
        />
      ))}
    </View>
  );
}
