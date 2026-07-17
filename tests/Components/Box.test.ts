import { expectTypeOf, test } from "vitest";
import type {
  BoxProps,
  BoxContentProps,
  BoxFooterProps,
} from "../../packages/Components/Box/Box.types";

test("Box types correctness", () => {
  expectTypeOf<BoxProps>().toHaveProperty("themePreset");
  expectTypeOf<BoxProps>().toHaveProperty("background");
  expectTypeOf<BoxProps>().toHaveProperty("color");
  expectTypeOf<BoxProps>().toHaveProperty("themeInteractive");
  expectTypeOf<BoxProps>().toHaveProperty("selected");
  expectTypeOf<BoxProps>().toHaveProperty("border");
  expectTypeOf<BoxProps>().toHaveProperty("children");
  expectTypeOf<BoxProps>().toHaveProperty("radius");
  expectTypeOf<BoxProps>().toHaveProperty("shadow");
});

test("BoxContent types correctness", () => {
  expectTypeOf<BoxContentProps>().toHaveProperty("title");
  expectTypeOf<BoxContentProps>().toHaveProperty("loading");
  expectTypeOf<BoxContentProps>().toHaveProperty("card");
});

test("BoxFooter types correctness", () => {
  expectTypeOf<BoxFooterProps>().toHaveProperty("pressable");
  expectTypeOf<BoxFooterProps>().toHaveProperty("divider");
});
