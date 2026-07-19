import { expectTypeOf, test } from "vitest";
import type { ButtonProps } from "../../packages/components/Button/Button.types";
import type { CardProps } from "../../packages/components/Card/Card.types";
import type { CheckboxProps } from "../../packages/components/Checkbox/Checkbox.types";
import type { CodeBoxProps } from "../../packages/components/CodeBox/CodeBox.types";
import type { ContextMenuProps } from "../../packages/components/ContextMenu/ContextMenu.types";
import type { ContributionGraphProps } from "../../packages/components/ContributionGraph/ContributionGraph.types";
import type { DatePickerProps } from "../../packages/components/DatePicker/DatePicker.types";
import type { DividerProps } from "../../packages/components/Divider/Divider.types";
import type { HeaderProps } from "../../packages/components/Header/Header.types";
import type { IconProps } from "../../packages/components/Icon/Icon.types";
import type { InputProps } from "../../packages/components/Input/Input.types";
import type { LabelProps } from "../../packages/components/Label/Label.types";
import type { DocsLayoutProps } from "../../packages/components/Layout/Layout.docs.types";
import type { LayoutProps } from "../../packages/components/Layout/Layout.types";
import type { MapOSMProps } from "../../packages/components/maps/OSM/MapOSM.types";
import type { NavProps } from "../../packages/components/Nav/Nav.types";
import type { PaginationProps } from "../../packages/components/Pagination/Pagination.types";
import type { PillProps } from "../../packages/components/Pill/Pill.types";
import type { ProfileProps } from "../../packages/components/Profile/Profile.types";
import type { ProgressProps } from "../../packages/components/Progress/Progress.types";
import type { RadioProps } from "../../packages/components/Radio/Radio.types";
import type {
  OptGroup,
  Option,
  SelectProps,
} from "../../packages/components/Select/Select.types";
import type { SkeletonProps } from "../../packages/components/Skeleton/Skeleton.types";
import type { SpinnerProps } from "../../packages/components/Spinner/Spinner.types";
import type { TextProps } from "../../packages/components/Text/Text.types";
import type {
  TimelineItemProps,
  TimelineProps,
} from "../../packages/components/Timeline/Timeline.types";
import type { TimePickerProps } from "../../packages/components/TimePicker/TimePicker.types";
import type { TitleProps } from "../../packages/components/Title/Title.types";
import type { ToggleProps } from "../../packages/components/Toggle/Toggle.types";
import type { TooltipProps } from "../../packages/components/Tooltip/Tooltip.types";

test("Components Types Validation", () => {
  expectTypeOf<ButtonProps>().toBeObject();
  expectTypeOf<CardProps>().toBeObject();
  expectTypeOf<CheckboxProps>().toBeObject();
  expectTypeOf<CodeBoxProps>().toBeObject();
  expectTypeOf<ContextMenuProps>().toBeObject();
  expectTypeOf<ContributionGraphProps>().toBeObject();
  expectTypeOf<DatePickerProps>().toBeObject();
  expectTypeOf<DividerProps>().toBeObject();
  expectTypeOf<HeaderProps>().toBeObject();
  expectTypeOf<IconProps>().toBeObject();
  expectTypeOf<InputProps>().toBeObject();
  expectTypeOf<LabelProps>().toBeObject();
  expectTypeOf<DocsLayoutProps>().toBeObject();
  expectTypeOf<LayoutProps>().toBeObject();
  expectTypeOf<MapOSMProps>().toBeObject();
  expectTypeOf<NavProps>().toBeObject();
  expectTypeOf<PaginationProps>().toBeObject();
  expectTypeOf<PillProps>().toBeObject();
  expectTypeOf<ProfileProps>().toBeObject();
  expectTypeOf<ProgressProps>().toBeObject();
  expectTypeOf<RadioProps>().toBeObject();
  expectTypeOf<SelectProps>().toBeObject();
  expectTypeOf<Option>().toBeObject();
  expectTypeOf<OptGroup>().toBeObject();
  expectTypeOf<SkeletonProps>().toBeObject();
  expectTypeOf<SpinnerProps>().toBeObject();
  expectTypeOf<TextProps>().toBeObject();
  expectTypeOf<TimePickerProps>().toBeObject();
  expectTypeOf<TimelineProps>().toBeObject();
  expectTypeOf<TimelineItemProps>().toBeObject();
  expectTypeOf<TitleProps>().toBeObject();
  expectTypeOf<ToggleProps>().toBeObject();
  expectTypeOf<TooltipProps>().toBeObject();
});
