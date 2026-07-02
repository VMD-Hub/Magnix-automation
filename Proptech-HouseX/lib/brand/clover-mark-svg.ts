import {
  CLOVER_CENTER,
  CLOVER_GOLD_BODY,
  CLOVER_GOLD_HIGHLIGHT,
  CLOVER_SHADOW_COLOR,
  CLOVER_VIEWBOX,
  cloverLayerOpacity,
  cloverPathLayers,
  cloverStrokeWidth,
  type CloverStrokeLayer,
} from "./clover-mark.config";

type IdPrefix = { idPrefix: string };

function gradientStops(
  stops: readonly { offset: string; color: string }[],
): string {
  return stops
    .map((s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`)
    .join("");
}

export function cloverMarkGradientIds(idPrefix: string) {
  return {
    body: `${idPrefix}-gold-body`,
    highlight: `${idPrefix}-gold-highlight`,
  };
}

export function buildCloverMarkDefs({ idPrefix }: IdPrefix): string {
  const { body, highlight } = cloverMarkGradientIds(idPrefix);
  const filterId = `${idPrefix}-lux`;

  return `<defs>
    <linearGradient id="${body}" x1="${CLOVER_GOLD_BODY.x1}" y1="${CLOVER_GOLD_BODY.y1}" x2="${CLOVER_GOLD_BODY.x2}" y2="${CLOVER_GOLD_BODY.y2}">
      ${gradientStops(CLOVER_GOLD_BODY.stops)}
    </linearGradient>
    <linearGradient id="${highlight}" x1="${CLOVER_GOLD_HIGHLIGHT.x1}" y1="${CLOVER_GOLD_HIGHLIGHT.y1}" x2="${CLOVER_GOLD_HIGHLIGHT.x2}" y2="${CLOVER_GOLD_HIGHLIGHT.y2}">
      ${gradientStops(CLOVER_GOLD_HIGHLIGHT.stops)}
    </linearGradient>
    <filter id="${filterId}" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="1.1" stdDeviation="0.55" flood-color="#1a1004" flood-opacity="0.7"/>
      <feDropShadow dx="-0.35" dy="-0.65" stdDeviation="0.22" flood-color="#fffef5" flood-opacity="0.62"/>
      <feDropShadow dx="0.45" dy="-0.15" stdDeviation="0.18" flood-color="#ffe566" flood-opacity="0.38"/>
    </filter>
  </defs>`;
}

function strokeRef(
  layer: CloverStrokeLayer,
  ids: ReturnType<typeof cloverMarkGradientIds>,
): string {
  if (layer === "shadow") return CLOVER_SHADOW_COLOR;
  if (layer === "body") return `url(#${ids.body})`;
  return `url(#${ids.highlight})`;
}

function layerTransform(item: ReturnType<typeof cloverPathLayers>[number]): string {
  const parts: string[] = [];
  if (item.rotate != null) parts.push(`rotate(${item.rotate})`);
  if (item.offsetY != null) parts.push(`translate(0 ${item.offsetY})`);
  return parts.length ? ` transform="${parts.join(" ")}"` : "";
}

export function buildCloverMarkGraphics({
  idPrefix,
  filter = true,
}: IdPrefix & { filter?: boolean }): string {
  const ids = cloverMarkGradientIds(idPrefix);
  const filterId = `${idPrefix}-lux`;
  const paths = cloverPathLayers()
    .map((item) => {
      const sw = cloverStrokeWidth(item.layer);
      const opacity = cloverLayerOpacity(item.layer);
      const stroke = strokeRef(item.layer, ids);
      return `<path d="${item.d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"${layerTransform(item)}/>`;
    })
    .join("\n    ");

  const filterAttr = filter ? ` filter="url(#${filterId})"` : "";

  return `<g transform="translate(${CLOVER_CENTER.x} ${CLOVER_CENTER.y})"${filterAttr}>
    ${paths}
  </g>`;
}

type Options = {
  withBackground?: boolean;
  idPrefix?: string;
  filter?: boolean;
};

/** SVG string — cùng geometry & lớp vàng với `CloverMark` React component. */
export function buildCloverMarkSvg({
  withBackground = false,
  idPrefix = "housex-clover",
  filter = true,
}: Options = {}): string {
  const background = withBackground
    ? `<rect width="48" height="48" rx="10" fill="#1a1214"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${CLOVER_VIEWBOX}" fill="none">
  ${buildCloverMarkDefs({ idPrefix })}
  ${background}
  ${buildCloverMarkGraphics({ idPrefix, filter })}
</svg>`;
}

export { CLOVER_VIEWBOX };
