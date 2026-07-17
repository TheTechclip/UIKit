"use client";

import Text from "@/packages/Components/Text/Text";
import View from "@/packages/Frameworks/View/View";

export function DialogImageCounter({
  selectedIndex,
  total,
}: {
  selectedIndex: number;
  total: number;
}) {
  return (
    <View
      alignItems="center"
      background="Base6TP6"
      shadow="Light"
      radius="ExtraLight"
      padding={[6, 8]}
      style={{ whiteSpace: "nowrap" }}
    >
      <Text type="Subheadline">
        {selectedIndex + 1} / {total}
      </Text>
    </View>
  );
}
