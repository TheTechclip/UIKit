import type maplibregl from "maplibre-gl";

const NUMERIC_FILTER_FALLBACK_MIN = Number.MIN_SAFE_INTEGER;
const NUMERIC_FILTER_FALLBACK_MAX = Number.MAX_SAFE_INTEGER;
const NUMERIC_COMPARISON_OPERATORS = new Set([
  "==",
  "!=",
  ">",
  ">=",
  "<",
  "<=",
]);

function isFiniteNumberLiteral(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isGetExpression(value: unknown): value is ["get", string] {
  return (
    Array.isArray(value) && value[0] === "get" && typeof value[1] === "string"
  );
}

function getNumericFilterFallback(operator: string, comparedValue: number) {
  switch (operator) {
    case "<":
    case "<=":
      return NUMERIC_FILTER_FALLBACK_MAX;
    case "!=":
      return comparedValue === NUMERIC_FILTER_FALLBACK_MIN
        ? NUMERIC_FILTER_FALLBACK_MAX
        : NUMERIC_FILTER_FALLBACK_MIN;
    default:
      return NUMERIC_FILTER_FALLBACK_MIN;
  }
}

function wrapNumericOperand(
  operand: unknown,
  operator: string,
  comparedValue: number,
) {
  if (!isGetExpression(operand)) {
    return operand;
  }

  return [
    "to-number",
    operand,
    getNumericFilterFallback(operator, comparedValue),
  ];
}

export function sanitizeStyleFilterExpression(expression: unknown): unknown {
  if (!Array.isArray(expression)) {
    return expression;
  }

  const [operator, ...args] = expression;
  if (typeof operator !== "string") {
    return expression.map((item) => sanitizeStyleFilterExpression(item));
  }

  if (NUMERIC_COMPARISON_OPERATORS.has(operator) && args.length === 2) {
    const [left, right] = args;
    const sanitizedLeft = sanitizeStyleFilterExpression(left);
    const sanitizedRight = sanitizeStyleFilterExpression(right);

    if (isFiniteNumberLiteral(right)) {
      return [
        operator,
        wrapNumericOperand(sanitizedLeft, operator, right),
        sanitizedRight,
      ];
    }

    if (isFiniteNumberLiteral(left)) {
      return [
        operator,
        sanitizedLeft,
        wrapNumericOperand(sanitizedRight, operator, left),
      ];
    }
  }

  return [operator, ...args.map((item) => sanitizeStyleFilterExpression(item))];
}

function sanitizeLayerFilter<T extends object>(layer: T): T {
  if (!("filter" in layer)) {
    return layer;
  }

  const layerWithFilter = layer as T & { filter?: unknown };
  if (!layerWithFilter.filter) {
    return layer;
  }

  return {
    ...layerWithFilter,

    filter: sanitizeStyleFilterExpression(layerWithFilter.filter),
  };
}

export function resolveSafeMapStyle(
  styleJson: maplibregl.StyleSpecification,
  disable3D: boolean,
): maplibregl.StyleSpecification {
  const layers = (styleJson.layers ?? [])
    .filter((layer) => (disable3D ? layer.type !== "fill-extrusion" : true))
    .map((layer) => sanitizeLayerFilter(layer));

  return {
    ...styleJson,

    projection: styleJson.projection ?? { type: "mercator" },
    layers,
    terrain: disable3D ? undefined : styleJson.terrain,
  };
}
