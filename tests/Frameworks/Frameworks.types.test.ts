import { expectTypeOf, test } from "vitest";
import type { DialogProps } from "../../packages/Frameworks/Dialog/Dialog.types";
import type { EdgeEffectProps } from "../../packages/Frameworks/EdgeEffect/EdgeEffect.types";
import type { PressableProps } from "../../packages/Frameworks/Pressable/Pressable.types";
import type { SquircleProps } from "../../packages/Frameworks/Squircle/Squircle.types";
import type { RadiusProps } from "../../packages/Frameworks/Theme/Radius.types";
import type {
  ThemeSystemProps,
  BorderProps,
} from "../../packages/Frameworks/Theme/Theme.types";
import type { ToasterBootstrapProps } from "../../packages/Frameworks/Toaster/Toaster.types";
import type { DNDViewProps } from "../../packages/Frameworks/View/DNDView/DNDView.types";
import type { HScrollViewProps } from "../../packages/Frameworks/View/HScrollView/HScrollView.types";
import type { ImageProps } from "../../packages/Frameworks/View/ImageView/Image.types";
import type { ViewProps } from "../../packages/Frameworks/View/View.types";

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
