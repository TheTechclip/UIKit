"use client";

import { useFunnel } from "@use-funnel/browser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  DialogFunnelOptions,
  DialogFunnelProp,
  DialogFunnelStepConfig,
} from "./DialogFunnel.types";

export function useDialogFunnel<
  // biome-ignore lint/suspicious/noExplicitAny: AnyStepMap constraint
  TStepMap extends Record<string, Record<string, any>>,
>(options: DialogFunnelOptions<TStepMap>): DialogFunnelProp {
  const funnel = useFunnel<TStepMap>({
    id: options.id,
    // biome-ignore lint/suspicious/noExplicitAny: @use-funnel initial type differs from our mapped type
    initial: options.initial as any,
  });

  const stepKeys = Object.keys(options.steps);
  const currentStepName = funnel.step as string;
  const currentStep =
    options.steps[currentStepName as keyof typeof options.steps];
  const currentIndex = funnel.index;

  const [error, setError] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: clear error when step changes
  useEffect(() => {
    setError(null);
  }, [currentStepName]);

  const contextRef = useRef(funnel.context);
  contextRef.current = funnel.context;

  const Content = useMemo(() => {
    const steps = options.steps as Record<
      string,
      DialogFunnelStepConfig<TStepMap, keyof TStepMap & string>
    >;
    const keys = Object.keys(steps);

    // biome-ignore lint/suspicious/noExplicitAny: @use-funnel render props shape is dynamically consumed
    const renderers: Record<string, (props: Record<string, any>) => React.ReactNode> = {};

    for (const key of keys) {
      const step = steps[key];
      renderers[key] = (renderProps) => {
        return step.render({
          context: renderProps.context,
          history: renderProps.history,
          index: renderProps.index,
          total: keys.length,
          // biome-ignore lint/suspicious/noExplicitAny: setContext patch from user-land
          setContext: (patch: any) => {
            const current = contextRef.current;
            const next =
              typeof patch === "function"
                ? patch(current)
                : { ...current, ...patch };
            contextRef.current = next;
            renderProps.history.replace(key, next);
          },
        });
      };
    }

    const FunnelContent = () => {
      // biome-ignore lint/suspicious/noExplicitAny: @use-funnel Render has complex generic type incompatible with JSX
      const Render = funnel.Render as React.ComponentType<any>;
      return <Render {...renderers} />;
    };
    return FunnelContent;
  }, [funnel.Render, options.steps]);

  const advance = useCallback(async () => {
    if (!currentStep) return;
    if (currentStep.hidden) return;

    // biome-ignore lint/suspicious/noExplicitAny: @use-funnel's discriminated union type is incompatible with our step config type
    const ctx = funnel.context as any;

    if (
      typeof currentStep.nextDisabled === "function"
        ? currentStep.nextDisabled(ctx)
        : currentStep.nextDisabled
    ) {
      return;
    }

    if (currentStep.validate) {
      const result = await currentStep.validate(ctx);
      if (result === false) return;
      if (typeof result === "string") {
        setError(result);
        return;
      }
    }

    setError(null);

    const nextIdx = currentIndex + 1;
    if (nextIdx >= stepKeys.length) {
      options.onFinish?.();
      return;
    }

    // biome-ignore lint/suspicious/noExplicitAny: dynamic step navigation with runtime key
    await (funnel.history as any).push(stepKeys[nextIdx], (prev: any) => prev);
  }, [
    currentStep,
    funnel.context,
    funnel.history,
    currentIndex,
    stepKeys,
    options,
  ]);

  const goBack = useCallback(() => {
    funnel.history.back();
  }, [funnel.history]);

  return {
    Content,
    current: {
      name: currentStepName,
      index: currentIndex,
      total: stepKeys.length,
      isFirst: currentIndex === 0,
      isLast: currentIndex === stepKeys.length - 1,
      nextDisabled:
        typeof currentStep?.nextDisabled === "function" // biome-ignore lint/suspicious/noExplicitAny: @use-funnel type mismatch
          ? currentStep.nextDisabled(funnel.context as any)
          : (currentStep?.nextDisabled ?? false),
      meta: {
        title: currentStep?.title,
        caption: currentStep?.caption,
        icon: currentStep?.icon,
      },
    },
    navigation: options.navigation,
    preset: options.preset,
    footer: options.footer,
    loading: options.loading ?? false,
    error,
    goBack,
    advance,
    onFinish: options.onFinish,
  };
}
