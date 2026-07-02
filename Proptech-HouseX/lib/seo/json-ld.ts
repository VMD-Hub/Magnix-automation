import type { Developer, Project } from "@prisma/client";
import { getSiteUrl } from "@/lib/site-config";

/**
 * Minimal shape needed to build structured data for a project page.
 * Pass a Prisma `Project` with its `developer` relation included.
 */
export type ProjectForJsonLd = Project & {
  developer?: Pick<Developer, "name"> | null;
};

type JsonLdObject = Record<string, unknown>;

/** Safely read a value out of the free-form `overviewData` JSON column. */
function readOverview(
  overviewData: Project["overviewData"],
  key: string,
): unknown {
  if (overviewData && typeof overviewData === "object" && !Array.isArray(overviewData)) {
    return (overviewData as Record<string, unknown>)[key];
  }
  return undefined;
}

/**
 * Build a schema.org `ApartmentComplex` JSON-LD object directly from Prisma data
 * so every project automatically gets correct structured data (no hand-written
 * boilerplate per page). See spec mục 6.
 */
export function buildProjectJsonLd(project: ProjectForJsonLd): JsonLdObject {
  const siteUrl = getSiteUrl();

  const address: JsonLdObject = {
    "@type": "PostalAddress",
    addressCountry: "VN",
    addressRegion: project.province,
    addressLocality: project.district,
  };
  const streetParts = [project.address, project.ward].filter(Boolean);
  if (streetParts.length > 0) {
    address.streetAddress = streetParts.join(", ");
  }

  const jsonLd: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: project.name,
    address,
  };

  if (siteUrl) {
    jsonLd.url = `${siteUrl}/du-an/${project.slug}`;
  }

  if (project.description) {
    jsonLd.description = project.description;
  }

  // numberOfAccommodationUnits comes from overviewData (e.g. { totalUnits: 1200 }).
  const totalUnits =
    readOverview(project.overviewData, "totalUnits") ??
    readOverview(project.overviewData, "numberOfAccommodationUnits");
  if (totalUnits != null) {
    jsonLd.numberOfAccommodationUnits = String(totalUnits);
  }

  if (project.lat != null && project.lng != null) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: project.lat,
      longitude: project.lng,
    };
  }

  if (project.developer?.name) {
    jsonLd.developer = {
      "@type": "Organization",
      name: project.developer.name,
    };
  }

  return jsonLd;
}
