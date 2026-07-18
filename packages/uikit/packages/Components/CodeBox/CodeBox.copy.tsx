"use client";

import { NavigatorClipboard } from "@musecat/functionkit";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import View from "../../Frameworks/View/View";

export default function CodeBox_Copy({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  return (
    <View
      alignItems="center"
      justifyContent="space-between"
      gap={12}
      padding={[12, 12, 0, 12]}
    >
      <View
        padding={[6, 10]}
        themePreset="UISecondary"
        radius="Circle"
        border="Regular"
      >
        <Text type="Footnote">{language}</Text>
      </View>

      <Icon
        icon="iContentCopy"
        radius="Circle"
        themePreset="UISecondary"
        border="Regular"
        size={18}
        box
        boxOptions={{ padding: 6 }}
        pressable={{ onClick: () => NavigatorClipboard({ text: code }) }}
      />
    </View>
  );
}
