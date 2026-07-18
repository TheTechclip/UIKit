import type { ComponentType, ReactNode } from "react";
import type { IconProps } from "../../../Components/Icon/Icon.types";
import type { FunnelNavigationConfig } from "../Dialog.types";

// biome-ignore lint/suspicious/noExplicitAny: public escape hatch for arbitrary user-defined step context maps
export type AnyStepMap = Record<string, Record<string, any>>;

export interface FunnelHistory<
  TStepMap extends AnyStepMap,
  TStepKey extends keyof TStepMap & string,
> {
  push: <TTarget extends keyof TStepMap & string>(
    target: TTarget,
    context:
      | TStepMap[TTarget]
      | ((prev: TStepMap[TStepKey]) => TStepMap[TTarget]),
  ) => Promise<TStepMap[TTarget]>;
  replace: <TTarget extends keyof TStepMap & string>(
    target: TTarget,
    context:
      | TStepMap[TTarget]
      | ((prev: TStepMap[TStepKey]) => TStepMap[TTarget]),
  ) => Promise<TStepMap[TTarget]>;
  go: (index: number) => void | Promise<void>;
  back: () => void | Promise<void>;
}

export interface DialogFunnelStepConfig<
  TStepMap extends AnyStepMap,
  K extends keyof TStepMap & string,
> {
  title?: ReactNode;
  caption?: ReactNode;
  icon?: IconProps;
  nextDisabled?: boolean | ((context: TStepMap[K]) => boolean);
  hidden?: boolean;
  validate?: (
    context: TStepMap[K],
  ) => boolean | string | Promise<boolean | string>;
  render: (props: {
    context: TStepMap[K];
    history: FunnelHistory<TStepMap, K>;
    index: number;
    total: number;
    setContext: (
      patch: Partial<TStepMap[K]> | ((prev: TStepMap[K]) => TStepMap[K]),
    ) => void;
  }) => ReactNode;
}

export interface DialogFunnelOptions<TStepMap extends AnyStepMap> {
  id: string;
  initial: {
    [K in keyof TStepMap]: {
      step: K;
      context: Partial<TStepMap[K]> extends TStepMap[K]
        ? Partial<TStepMap[K]>
        : TStepMap[K];
    };
  }[keyof TStepMap];
  steps: {
    [K in keyof TStepMap]: DialogFunnelStepConfig<TStepMap, K & string>;
  };
  navigation?: FunnelNavigationConfig;
  preset?: "classic" | "oobe";
  footer?: {
    columnLayout?: boolean;
    buttonCondensed?: boolean | "pc";
  };
  loading?: boolean;
  onFinish?: () => void;
}

export interface DialogFunnelProp {
  Content: ComponentType;
  current: {
    name: string;
    index: number;
    total: number;
    isFirst: boolean;
    isLast: boolean;
    nextDisabled: boolean;
    meta: {
      title?: ReactNode;
      caption?: ReactNode;
      icon?: IconProps;
    };
  };
  navigation?: FunnelNavigationConfig;
  preset?: "classic" | "oobe";
  footer?: { columnLayout?: boolean; buttonCondensed?: boolean | "pc" };
  loading?: boolean;
  error: string | null;
  goBack: () => void;
  advance: () => Promise<void>;
  onFinish?: () => void;
}
