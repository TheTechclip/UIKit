import { expectTypeOf, test } from "vitest";
import type { DialogProps } from "../../packages/frameworks/Dialog/Dialog.types";
import type { EdgeEffectProps } from "../../packages/frameworks/EdgeEffect/EdgeEffect.types";
import type { PressableProps } from "../../packages/frameworks/Pressable/Pressable.types";
import type { SquircleProps } from "../../packages/frameworks/Squircle/Squircle.types";
import type { RadiusProps } from "../../packages/frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../packages/frameworks/Theme/Theme.types";
import type { ToasterBootstrapProps } from "../../packages/frameworks/Toaster/Toaster.types";
import type { DNDViewProps } from "../../packages/frameworks/View/DNDView/DNDView.types";

import type { HScrollViewProps } from "../../packages/frameworks/View/HScrollView/HScrollView.types";
import type { ImageProps } from "../../packages/frameworks/View/ImageView/Image.types";
import type { ViewProps } from "../../packages/frameworks/View/View.types";

test("Frameworks Types Validation", () => {
  expectTypeOf<DialogProps>().toBeObject();
  expectTypeOf<EdgeEffectProps>().toBeObject();
  expectTypeOf<PressableProps>().toBeObject();
  expectTypeOf<SquircleProps>().toBeObject();
  expectTypeOf<RadiusProps>().toBeObject();
  expectTypeOf<ThemeSystemProps>().toBeObject();
  expectTypeOf<BorderProps>().toBeObject();
  expectTypeOf<ToasterBootstrapProps>().toBeObject();
  expectTypeOf<DNDViewProps<unknown>>().toBeObject();
  expectTypeOf<HScrollViewProps>().toBeObject();
  expectTypeOf<ImageProps>().toBeObject();
  expectTypeOf<ViewProps>().toBeObject();
});
