"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Icon from "../../../components/Icon/Icon";
import type { PressableProps } from "../../Pressable/Pressable.types";
import View from "../View";
import styles from "./DNDView.module.scss";
import type {
  DNDViewItemState,
  DNDViewProps,
  DNDViewStrategy,
} from "./DNDView.types";

const SORTING_STRATEGY: Record<DNDViewStrategy, typeof rectSortingStrategy> = {
  horizontal: horizontalListSortingStrategy,
  rect: rectSortingStrategy,
  vertical: verticalListSortingStrategy,
};
const DROP_ANIMATION = {
  duration: 180,
  easing: "cubic-bezier(.2, 0, 0, 1)",
};
const DIRECTION_KEY = {
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  up: "ArrowUp",
} as const;
const PICKUP_KEY = {
  enter: "Enter",
  space: "Space",
} as const;

function translateOnly(
  transform: Parameters<typeof CSS.Transform.toString>[0],
) {
  if (!transform) return undefined;

  return CSS.Transform.toString({
    ...transform,
    scaleX: 1,
    scaleY: 1,
  });
}

function getClosestVerticalId(
  ids: UniqueIdentifier[],
  nodes: Map<UniqueIdentifier, HTMLDivElement>,
  id: UniqueIdentifier,
  direction: "up" | "down",
) {
  const currentNode = nodes.get(id);
  if (!currentNode) return undefined;

  const currentRect = currentNode.getBoundingClientRect();
  const currentCenterX = currentRect.left + currentRect.width / 2;

  return ids
    .reduce<
      {
        distanceX: number;
        distanceY: number;
        id: UniqueIdentifier;
      }[]
    >((candidates, candidateId) => {
      if (candidateId === id) return candidates;

      const rect = nodes.get(candidateId)?.getBoundingClientRect();
      if (!rect) return candidates;

      const isCandidate =
        direction === "down"
          ? rect.top > currentRect.top
          : rect.top < currentRect.top;
      if (!isCandidate) return candidates;

      candidates.push({
        id: candidateId,
        distanceY: Math.abs(rect.top - currentRect.top),
        distanceX: Math.abs(rect.left + rect.width / 2 - currentCenterX),
      });
      return candidates;
    }, [])
    .sort((a, b) => a.distanceY - b.distanceY || a.distanceX - b.distanceX)[0]
    ?.id;
}

type SortableItemProps<T> = {
  dragHandle?: boolean;
  item: T;
  id: UniqueIdentifier;
  index: number;
  itemStyle?: CSSProperties;
  keyboardDragging?: boolean;
  onItemKeyDown?: (
    event: KeyboardEvent<HTMLDivElement>,
    id: UniqueIdentifier,
  ) => void;
  registerNode?: (id: UniqueIdentifier, node: HTMLDivElement | null) => void;
  renderItem: DNDViewProps<T>["renderItem"];
  renderHandle?: DNDViewProps<T>["renderHandle"];
};

function DefaultHandle(props: HTMLAttributes<HTMLElement>) {
  const { color: _color, ...handleProps } = props;
  return (
    <Icon
      icon="iMenu"
      box
      className={clsx(styles.Handle, props.className)}
      pressable={
        {
          ...handleProps,
          type: "button",
          "aria-label": handleProps["aria-label"] ?? "Drag item",
        } as PressableProps
      }
    />
  );
}

function SortableItem<T>({
  dragHandle,
  item,
  id,
  index,
  itemStyle,
  keyboardDragging,
  onItemKeyDown,
  registerNode,
  renderItem,
  renderHandle,
}: SortableItemProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id });
  const style = useMemo(
    () => ({
      ...itemStyle,
      transform: translateOnly(transform),
      transition,
      opacity: isDragging ? 0 : itemStyle?.opacity,
    }),
    [isDragging, itemStyle, transform, transition],
  );
  const sortableProps = {
    ...attributes,
    ...listeners,
  };
  const handleProps = {
    ...sortableProps,
    ref: setActivatorNodeRef,
  } as HTMLAttributes<HTMLElement>;
  const setItemNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      registerNode?.(id, node);
    },
    [id, registerNode, setNodeRef],
  );
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      onItemKeyDown?.(event, id);
    },
    [id, onItemKeyDown],
  );
  const state = {
    item,
    id,
    index,
    dragging: isDragging || Boolean(keyboardDragging),
    sorting: isSorting,
    handle: null,
    handleProps,
  } satisfies DNDViewItemState<T>;
  const handle = dragHandle ? (
    renderHandle ? (
      renderHandle(handleProps, state)
    ) : (
      <DefaultHandle {...handleProps} />
    )
  ) : null;
  const resolvedState = {
    ...state,
    handle,
  };

  return (
    <View
      ref={setItemNodeRef}
      style={{
        transformOrigin: "center",
        touchAction: !dragHandle ? "none" : "pan-y",
        zIndex: isDragging || keyboardDragging ? 1 : undefined,
        ...style,
      }}
      onKeyDown={handleKeyDown}
      {...(!dragHandle ? sortableProps : undefined)}
    >
      {renderItem(item, resolvedState)}
    </View>
  );
}

export default function DNDView<T>({
  items,
  onReorder,
  getKey,
  renderItem,
  renderHandle,
  disabled,
  dragHandle = true,
  keyboard = true,
  strategy = "vertical",
  activationDistance = 6,
  touchActivationDelay = 120,
  touchActivationTolerance = 8,
  className,
  style,
  alignItems,
  justifyContent,
  gap = 8,
  wrap,
  fullWidth,
  gridTemplateColumns,
  gridTemplateRows,
  gridAutoFlow,
  width,
  height,
  padding,
  margin,
  itemStyle,
  ...viewProps
}: DNDViewProps<T>) {
  const dndContextId = useId();
  const itemNodesRef = useRef(new Map<UniqueIdentifier, HTMLDivElement>());
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [keyboardActiveId, setKeyboardActiveId] =
    useState<UniqueIdentifier | null>(null);
  const ids = useMemo(() => items.map(getKey), [getKey, items]);
  const activeIndex = activeId ? ids.indexOf(activeId) : -1;
  const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: activationDistance,
    },
  });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: activationDistance,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: touchActivationDelay,
      tolerance: touchActivationTolerance,
    },
  });
  const sensors = useSensors(pointerSensor, mouseSensor, touchSensor);
  const isGrid = Boolean(
    gridTemplateColumns || gridTemplateRows || gridAutoFlow,
  );
  const isHorizontal = strategy === "horizontal";
  const isRect = strategy === "rect";
  const sortingStrategy = SORTING_STRATEGY[strategy];
  const isKeyboardEnabled = keyboard && !disabled;
  const registerItemNode = useCallback(
    (id: UniqueIdentifier, node: HTMLDivElement | null) => {
      if (node) {
        itemNodesRef.current.set(id, node);
        return;
      }

      itemNodesRef.current.delete(id);
    },
    [],
  );

  const handleKeyboardReorder = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, id: UniqueIdentifier) => {
      if (!isKeyboardEnabled) return;

      if (event.code === PICKUP_KEY.space || event.code === PICKUP_KEY.enter) {
        event.preventDefault();
        setKeyboardActiveId((currentId) => (currentId === id ? null : id));
        return;
      }

      if (keyboardActiveId !== id) return;

      const currentIndex = ids.indexOf(id);
      const targetId = isRect
        ? event.code === DIRECTION_KEY.right
          ? ids[currentIndex + 1]
          : event.code === DIRECTION_KEY.left
            ? ids[currentIndex - 1]
            : event.code === DIRECTION_KEY.down
              ? getClosestVerticalId(ids, itemNodesRef.current, id, "down")
              : event.code === DIRECTION_KEY.up
                ? getClosestVerticalId(ids, itemNodesRef.current, id, "up")
                : undefined
        : event.code === DIRECTION_KEY.down ||
            event.code === DIRECTION_KEY.right
          ? ids[currentIndex + 1]
          : event.code === DIRECTION_KEY.up || event.code === DIRECTION_KEY.left
            ? ids[currentIndex - 1]
            : undefined;
      if (targetId === undefined) return;

      event.preventDefault();

      const targetIndex = ids.indexOf(targetId);
      if (targetIndex < 0 || currentIndex < 0 || targetIndex === currentIndex) {
        return;
      }

      onReorder(arrayMove(items, currentIndex, targetIndex));
    },
    [ids, isKeyboardEnabled, isRect, items, keyboardActiveId, onReorder],
  );

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setKeyboardActiveId(null);
    setActiveId(active.id);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveId(null);
      if (!over || active.id === over.id) return;

      const oldIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);
      if (oldIndex < 0 || newIndex < 0) return;
      onReorder(arrayMove(items, oldIndex, newIndex));
    },
    [ids, items, onReorder],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const renderOverlay = () => {
    if (!activeItem || activeId == null) return null;

    const handleProps = {
      "aria-label": "Drag item",
    } as HTMLAttributes<HTMLElement>;
    const state = {
      item: activeItem,
      id: activeId,
      index: activeIndex,
      dragging: true,
      sorting: false,
      handle: null,
      handleProps,
    } satisfies DNDViewItemState<T>;
    const handle = dragHandle ? (
      renderHandle ? (
        renderHandle(handleProps, state)
      ) : (
        <DefaultHandle {...handleProps} />
      )
    ) : null;

    return renderItem(activeItem, {
      ...state,
      handle,
    });
  };

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={ids}
        strategy={sortingStrategy}
        disabled={disabled}
      >
        <View
          {...viewProps}
          className={className}
          style={{ touchAction: "pan-y", userSelect: "none", ...style }}
          alignItems={alignItems}
          justifyContent={justifyContent}
          column={!isGrid && !isHorizontal && !isRect}
          row={!isGrid && (isHorizontal || isRect)}
          gap={gap}
          wrap={isRect ? (wrap ?? "wrap") : wrap}
          fullWidth={fullWidth}
          gridTemplateColumns={gridTemplateColumns}
          gridTemplateRows={gridTemplateRows}
          gridAutoFlow={gridAutoFlow}
          width={width}
          height={height}
          padding={padding}
          margin={margin}
        >
          {items.map((item, index) => {
            const id = getKey(item);
            return (
              <SortableItem
                key={id}
                item={item}
                dragHandle={dragHandle}
                id={id}
                index={index}
                itemStyle={itemStyle}
                keyboardDragging={keyboardActiveId === id}
                onItemKeyDown={handleKeyboardReorder}
                registerNode={registerItemNode}
                renderItem={renderItem}
                renderHandle={renderHandle}
              />
            );
          })}
        </View>
      </SortableContext>
      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {renderOverlay()}
      </DragOverlay>
    </DndContext>
  );
}
