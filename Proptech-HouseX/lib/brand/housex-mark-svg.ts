import {
  CHROME_X_ARMS,
  CHROME_X_CAP_R,
  CHROME_X_GRADIENT,
  CHROME_X_HIGHLIGHT,
  CHROME_X_STROKE,
  CHROME_X_TIPS,
  CHROME_X_VIEWBOX,
  HOUSEX_COLORS,
  HOUSEX_MARK_VIEWBOX,
  HOUSEX_SILVER_GRADIENT,
} from "./housex-mark.config";

type Options = {
  withCard?: boolean;
  idPrefix?: string;
};

function gradientStops(
  stops: readonly { offset: string; color: string }[],
): string {
  return stops
    .map((s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`)
    .join("");
}

/** SVG string — X chrome cho favicon. */
export function buildHouseXMarkSvg({
  withCard = false,
  idPrefix = "housex-mark",
}: Options = {}): string {
  const silverId = `${idPrefix}-silver`;
  const chromeId = `${idPrefix}-gold-x`;
  const hiId = `${idPrefix}-hi`;

  const card = withCard
    ? `<rect width="48" height="48" rx="10" fill="url(#${silverId})" stroke="${HOUSEX_COLORS.silverBorder}" stroke-width="0.75"/>
  <rect width="48" height="48" rx="10" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="0.5" opacity="0.6"/>`
    : "";

  const caps = CHROME_X_TIPS.map(
    ([cx, cy]) =>
      `<circle cx="${cx}" cy="${cy}" r="${CHROME_X_CAP_R}" fill="url(#${chromeId})"/>`,
  ).join("\n  ");

  const arms = CHROME_X_ARMS.map(
    (arm) =>
      `<line x1="${arm.x1}" y1="${arm.y1}" x2="${arm.x2}" y2="${arm.y2}" stroke="url(#${chromeId})" stroke-width="${CHROME_X_STROKE}" stroke-linecap="round"/>`,
  ).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${HOUSEX_MARK_VIEWBOX}" fill="none">
  <defs>
    <linearGradient id="${silverId}" x1="${HOUSEX_SILVER_GRADIENT.x1}" y1="${HOUSEX_SILVER_GRADIENT.y1}" x2="${HOUSEX_SILVER_GRADIENT.x2}" y2="${HOUSEX_SILVER_GRADIENT.y2}">
      ${gradientStops(HOUSEX_SILVER_GRADIENT.stops)}
    </linearGradient>
    <linearGradient id="${chromeId}" x1="${CHROME_X_GRADIENT.x1}" y1="${CHROME_X_GRADIENT.y1}" x2="${CHROME_X_GRADIENT.x2}" y2="${CHROME_X_GRADIENT.y2}">
      ${gradientStops(CHROME_X_GRADIENT.stops)}
    </linearGradient>
    <linearGradient id="${hiId}" x1="${CHROME_X_HIGHLIGHT.x1}" y1="${CHROME_X_HIGHLIGHT.y1}" x2="${CHROME_X_HIGHLIGHT.x2}" y2="${CHROME_X_HIGHLIGHT.y2}">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <filter id="${idPrefix}-depth" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="2.2" stdDeviation="2.4" flood-color="${HOUSEX_COLORS.xShadow}" flood-opacity="0.38"/>
      <feDropShadow dx="0" dy="0" stdDeviation="1.2" flood-color="${HOUSEX_COLORS.gold}" flood-opacity="0.22"/>
    </filter>
  </defs>
  ${card}
  <g filter="url(#${idPrefix}-depth)">
  ${caps}
  ${arms}
  <ellipse cx="24" cy="21.5" rx="5.5" ry="3.2" fill="url(#${hiId})" opacity="0.38"/>
  </g>
</svg>`;
}

export { CHROME_X_VIEWBOX };
