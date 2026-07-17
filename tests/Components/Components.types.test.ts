import { expectTypeOf, test } from "vitest";
import type { ButtonProps } from "../../packages/Components/Button/Button.types";
import type {
  CardProps,
  CardContentProps,
  CardFooterProps,
} from "../../packages/Components/Card/Card.types";
import type { CheckboxProps } from "../../packages/Components/Checkbox/Checkbox.types";
import type { CodeBoxProps } from "../../packages/Components/CodeBox/CodeBox.types";
import type {
  ContextMenuProps,
  ContextMenuOptionProps,
  ContextMenuCategoryProps,
} from "../../packages/Components/ContextMenu/ContextMenu.types";
import type { ContributionGraphProps } from "../../packages/Components/ContributionGraph/ContributionGraph.types";
import type { DatePickerProps } from "../../packages/Components/DatePicker/DatePicker.types";
import type { DividerProps } from "../../packages/Components/Divider/Divider.types";
import type { HeaderProps } from "../../packages/Components/Header/Header.types";
import type {
  IconProps,
  IconRenderProps,
  IconBoxProps,
  IconStyleProps,
} from "../../packages/Components/Icon/Icon.types";
import type { InputProps } from "../../packages/Components/Input/Input.types";
import type { LabelProps } from "../../packages/Components/Label/Label.types";
import type { DocsLayoutProps } from "../../packages/Components/Layout/Layout.docs.types";
import type {
  LayoutProps,
  SidebarProps,
  MainProps,
} from "../../packages/Components/Layout/Layout.types";
import type { MapOSMProps } from "../../packages/Components/Maps/OSM/MapOSM.types";
import type {
  NavProps,
  NavTabProps,
} from "../../packages/Components/Nav/Nav.types";
import type { PaginationProps } from "../../packages/Components/Pagination/Pagination.types";
import type { PillProps } from "../../packages/Components/Pill/Pill.types";
import type { ProfileProps } from "../../packages/Components/Profile/Profile.types";
import type { ProgressProps } from "../../packages/Components/Progress/Progress.types";
import type {
  RadioProps,
  RadioGroupProps,
  RadioGroupContextType,
} from "../../packages/Components/Radio/Radio.types";
import type {
  SelectProps,
  Option,
  OptGroup,
} from "../../packages/Components/Select/Select.types";
import type { SkeletonProps } from "../../packages/Components/Skeleton/Skeleton.types";
import type { SpinnerProps } from "../../packages/Components/Spinner/Spinner.types";
import type { TextProps } from "../../packages/Components/Text/Text.types";
import type { TimePickerProps } from "../../packages/Components/TimePicker/TimePicker.types";
import type {
  TimelineProps,
  TimelineItemProps,
} from "../../packages/Components/Timeline/Timeline.types";
import type { TitleProps } from "../../packages/Components/Title/Title.types";
import type { ToggleProps } from "../../packages/Components/Toggle/Toggle.types";
import type { TooltipProps } from "../../packages/Components/Tooltip/Tooltip.types";

test("Components Types Validation", () => {
  expectTypeOf<ButtonProps>().toBeObject();
  expectTypeOf<CardProps>().toBeObject();
  expectTypeOf<CardContentProps>().toBeObject();
  expectTypeOf<CardFooterProps>().toBeObject();
  expectTypeOf<CheckboxProps>().toBeObject();
  expectTypeOf<CodeBoxProps>().toBeObject();
  expectTypeOf<ContextMenuProps>().toBeObject();
  expectTypeOf<ContextMenuOptionProps>().toBeObject();
  expectTypeOf<ContextMenuCategoryProps>().toBeObject();
  expectTypeOf<ContributionGraphProps>().toBeObject();
  expectTypeOf<DatePickerProps>().toBeObject();
  expectTypeOf<DividerProps>().toBeObject();
  expectTypeOf<HeaderProps>().toBeObject();
  expectTypeOf<IconProps>().toBeObject();
  expectTypeOf<IconRenderProps>().toBeObject();
  expectTypeOf<IconBoxProps>().toBeObject();
  expectTypeOf<IconStyleProps>().toBeObject();
  expectTypeOf<InputProps>().toBeObject();
  expectTypeOf<LabelProps>().toBeObject();
  expectTypeOf<DocsLayoutProps>().toBeObject();
  expectTypeOf<LayoutProps>().toBeObject();
  expectTypeOf<SidebarProps>().toBeObject();
  expectTypeOf<MainProps>().toBeObject();
  expectTypeOf<MapOSMProps>().toBeObject();
  expectTypeOf<NavProps>().toBeObject();
  expectTypeOf<NavTabProps>().toBeObject();
  expectTypeOf<PaginationProps>().toBeObject();
  expectTypeOf<PillProps>().toBeObject();
  expectTypeOf<ProfileProps>().toBeObject();
  expectTypeOf<ProgressProps>().toBeObject();
  expectTypeOf<RadioProps>().toBeObject();
  expectTypeOf<RadioGroupProps>().toBeObject();
  expectTypeOf<RadioGroupContextType>().toBeObject();
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
