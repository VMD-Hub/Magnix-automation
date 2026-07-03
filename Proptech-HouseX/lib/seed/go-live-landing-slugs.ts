import { SOLENA_GREEN_TOWN_SLUG } from "@/lib/content/solena-green-town-slug";
import { VINHOMES_PROJECT_SLUGS } from "./vinhomes-projects";
import { COMMERCIAL_LANDING_SLUGS } from "./commercial-landings";

/** Slug landing thương mại go-live — có catalog tĩnh trong repo khi Postgres chưa sẵn sàng. */
export const GO_LIVE_LANDING_SLUGS = [
  ...VINHOMES_PROJECT_SLUGS,
  ...COMMERCIAL_LANDING_SLUGS,
  SOLENA_GREEN_TOWN_SLUG,
] as const;

export type GoLiveLandingSlug = (typeof GO_LIVE_LANDING_SLUGS)[number];

const GO_LIVE_SET = new Set<string>(GO_LIVE_LANDING_SLUGS);

export function isGoLiveLandingSlug(slug: string): slug is GoLiveLandingSlug {
  return GO_LIVE_SET.has(slug);
}
