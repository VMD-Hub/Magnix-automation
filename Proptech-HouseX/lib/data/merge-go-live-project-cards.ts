import type { ProjectCardData } from "@/components/projects/project-card";
import { listCatalogProjectCards } from "@/lib/preview/demo-projects";
import { GO_LIVE_LANDING_SLUGS } from "@/lib/seed/go-live-landing-slugs";

const GO_LIVE_SET = new Set<string>(GO_LIVE_LANDING_SLUGS);

/**
 * Bổ sung thẻ catalog cho slug go-live thiếu trong DB.
 * Không giới hạn số lượng — mọi slug trong GO_LIVE_LANDING_SLUGS đều được giữ.
 */
export function mergeMissingGoLiveCommercialCards(
  dbCards: ProjectCardData[],
): ProjectCardData[] {
  const bySlug = new Map(dbCards.map((c) => [c.slug, c]));
  const catalogCommercial = listCatalogProjectCards({
    projectType: "THUONG_MAI",
  });

  for (const slug of GO_LIVE_LANDING_SLUGS) {
    if (!bySlug.has(slug)) {
      const fromCatalog = catalogCommercial.find((c) => c.slug === slug);
      if (fromCatalog) bySlug.set(slug, fromCatalog);
    }
  }

  const goLiveOrdered = GO_LIVE_LANDING_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (c): c is ProjectCardData => c != null,
  );
  const extraCommercial = dbCards.filter(
    (c) => c.projectType === "THUONG_MAI" && !GO_LIVE_SET.has(c.slug),
  );

  return [...goLiveOrdered, ...extraCommercial];
}
