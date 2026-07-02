import type { ProjectCardData } from "@/components/projects/project-card";
import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  parseProjectOverview,
  resolveLandingHeroImage,
} from "@/lib/content/project-landing";
import { ensureNoxhLandingMedia } from "@/lib/content/noxh-stock-images";
import { ensureCatalogCoverUrl } from "@/lib/content/catalog-cover-fallback";
import {
  buildDtaHappyHomeMock,
  buildDtaPreviewListings,
} from "@/lib/preview/dta-happy-home-mock";
import {
  buildSolenaGreenTownMock,
  buildSolenaPreviewListings,
} from "@/lib/preview/solena-green-town-mock";
import {
  buildIkiVillageMock,
  buildIkiPreviewListings,
} from "@/lib/preview/iki-village-mock";
import {
  buildEcoResidenceMock,
  buildEcoPreviewListings,
} from "@/lib/preview/eco-residence-mock";
import {
  buildPhucLocThoMock,
  buildPhucLocThoPreviewListings,
} from "@/lib/preview/phuc-loc-tho-mock";
import {
  buildDragonEHomeMock,
  buildDragonEHomePreviewListings,
} from "@/lib/preview/dragon-e-home-mock";
import {
  buildThuThiemGreenHouseMock,
  buildThuThiemGreenHousePreviewListings,
} from "@/lib/preview/thu-thiem-green-house-mock";
import {
  buildPhuThoDmcMock,
  buildPhuThoDmcPreviewListings,
  LTK_PROJECT_SLUG,
} from "@/lib/preview/phu-tho-dmc-mock";
import {
  buildKdcChangSongMock,
  buildKdcChangSongPreviewListings,
  CS_PROJECT_SLUG,
} from "@/lib/preview/kdc-chang-song-mock";
import {
  buildThePriveMock,
  buildThePrivePreviewListings,
  THE_PRIVE_PROJECT_SLUG,
} from "@/lib/preview/the-prive-mock";
import {
  buildVinhomesSaigonParkMock,
  buildVinhomesSaigonParkPreviewListings,
  VINHOMES_SAIGON_PARK_SLUG,
} from "@/lib/preview/vinhomes-saigon-park-mock";
import {
  buildVinhomesGreenParadiseMock,
  buildVinhomesGreenParadisePreviewListings,
  VINHOMES_GREEN_PARADISE_SLUG,
} from "@/lib/preview/vinhomes-green-paradise-mock";
import {
  buildVinhomesGrandParkMock,
  buildVinhomesGrandParkPreviewListings,
  VINHOMES_GRAND_PARK_SLUG,
} from "@/lib/preview/vinhomes-grand-park-mock";
import {
  buildMonreiSaigonMock,
  buildMonreiSaigonPreviewListings,
  MONREI_SAIGON_SLUG,
} from "@/lib/preview/monrei-saigon-mock";
import {
  buildNobleCrystalRiversideMock,
  buildNobleCrystalRiversidePreviewListings,
  NOBLE_CRYSTAL_RIVERSIDE_SLUG,
} from "@/lib/preview/noble-crystal-riverside-mock";
import {
  buildGladiaHeightsMock,
  buildGladiaHeightsPreviewListings,
  GLADIA_HEIGHTS_SLUG,
} from "@/lib/preview/gladia-heights-mock";
import {
  buildVictoriaVillageMock,
  buildVictoriaVillagePreviewListings,
  VICTORIA_VILLAGE_SLUG,
} from "@/lib/preview/victoria-village-mock";
import { getCatalogSlugs } from "@/lib/seed/catalog-project-slugs";
import {
  buildNamLong2CanThoMock,
  buildNamLong2PreviewListings,
  NL2_PROJECT_SLUG,
} from "@/lib/preview/nam-long-2-can-tho-mock";
import {
  buildNamLongHongPhatMock,
  buildNamLongHongPhatPreviewListings,
  NLHP_PROJECT_SLUG,
} from "@/lib/preview/nam-long-hong-phat-mock";
import {
  allNoxhLongAnSlugs,
  buildNoxhLongAnListings,
  buildNoxhLongAnMock,
} from "@/lib/preview/noxh-long-an-projects";

type DemoEntry = {
  build: () => ProjectDetail;
  listings?: () => ProjectLandingListingCard[];
};

/** Dự án demo khi chưa có Postgres / chưa seed — slug khớp seed. */
const DEMO_REGISTRY: Record<string, DemoEntry> = {
  "dta-happy-home-nhon-trach": {
    build: buildDtaHappyHomeMock,
    listings: buildDtaPreviewListings,
  },
  "eco-residence-long-binh-tan": {
    build: buildEcoResidenceMock,
    listings: buildEcoPreviewListings,
  },
  "chung-cu-phuc-loc-tho-noxh": {
    build: buildPhucLocThoMock,
    listings: buildPhucLocThoPreviewListings,
  },
  "dragon-e-home-phu-huu": {
    build: buildDragonEHomeMock,
    listings: buildDragonEHomePreviewListings,
  },
  "thu-thiem-green-house-thu-duc": {
    build: buildThuThiemGreenHouseMock,
    listings: buildThuThiemGreenHousePreviewListings,
  },
  [LTK_PROJECT_SLUG]: {
    build: buildPhuThoDmcMock,
    listings: buildPhuThoDmcPreviewListings,
  },
  [CS_PROJECT_SLUG]: {
    build: buildKdcChangSongMock,
    listings: buildKdcChangSongPreviewListings,
  },
  [NL2_PROJECT_SLUG]: {
    build: buildNamLong2CanThoMock,
    listings: buildNamLong2PreviewListings,
  },
  [NLHP_PROJECT_SLUG]: {
    build: buildNamLongHongPhatMock,
    listings: buildNamLongHongPhatPreviewListings,
  },
  "solena-green-town-binh-tan": {
    build: buildSolenaGreenTownMock,
    listings: buildSolenaPreviewListings,
  },
  [THE_PRIVE_PROJECT_SLUG]: {
    build: buildThePriveMock,
    listings: buildThePrivePreviewListings,
  },
  [VINHOMES_SAIGON_PARK_SLUG]: {
    build: buildVinhomesSaigonParkMock,
    listings: buildVinhomesSaigonParkPreviewListings,
  },
  [VINHOMES_GREEN_PARADISE_SLUG]: {
    build: buildVinhomesGreenParadiseMock,
    listings: buildVinhomesGreenParadisePreviewListings,
  },
  [VINHOMES_GRAND_PARK_SLUG]: {
    build: buildVinhomesGrandParkMock,
    listings: buildVinhomesGrandParkPreviewListings,
  },
  [MONREI_SAIGON_SLUG]: {
    build: buildMonreiSaigonMock,
    listings: buildMonreiSaigonPreviewListings,
  },
  [NOBLE_CRYSTAL_RIVERSIDE_SLUG]: {
    build: buildNobleCrystalRiversideMock,
    listings: buildNobleCrystalRiversidePreviewListings,
  },
  [GLADIA_HEIGHTS_SLUG]: {
    build: buildGladiaHeightsMock,
    listings: buildGladiaHeightsPreviewListings,
  },
  [VICTORIA_VILLAGE_SLUG]: {
    build: buildVictoriaVillageMock,
    listings: buildVictoriaVillagePreviewListings,
  },
  "iki-village": {
    build: buildIkiVillageMock,
    listings: buildIkiPreviewListings,
  },
  ...Object.fromEntries(
    allNoxhLongAnSlugs().map((slug) => [
      slug,
      {
        build: () => buildNoxhLongAnMock(slug)!,
        listings: () => buildNoxhLongAnListings(slug),
      },
    ]),
  ),
};

export function isDemoProjectSlug(slug: string): boolean {
  return slug in DEMO_REGISTRY;
}

export function getDemoProjectBySlug(slug: string): ProjectDetail | null {
  return DEMO_REGISTRY[slug]?.build() ?? null;
}

export function getDemoListingsForSlug(
  slug: string,
): ProjectLandingListingCard[] {
  return DEMO_REGISTRY[slug]?.listings?.() ?? [];
}

function projectToCard(project: ProjectDetail): ProjectCardData {
  const overview = parseProjectOverview(project.overviewData);
  const landing =
    overview.landing && project.projectType === "NHA_O_XA_HOI"
      ? ensureNoxhLandingMedia(overview.landing, project.slug)
      : overview.landing;
  const hero = resolveLandingHeroImage(landing, project.name);
  const minPrice = project.unitTypes.reduce<number | null>((min, u) => {
    if (u.priceFrom == null) return min;
    const p = Number(u.priceFrom.toString());
    return min == null || p < min ? p : min;
  }, null);

  return {
    slug: project.slug,
    name: project.name,
    projectType: project.projectType,
    status: project.status,
    province: project.province,
    district: project.district,
    developerName: project.developer?.name ?? null,
    priceFrom: minPrice,
    listingCount: DEMO_REGISTRY[project.slug]?.listings?.().length ?? 0,
    imageUrl: hero?.url ?? ensureCatalogCoverUrl(project.slug),
  };
}

export function listDemoProjectCards(params: {
  projectType?: "THUONG_MAI" | "NHA_O_XA_HOI";
} = {}): ProjectCardData[] {
  return Object.keys(DEMO_REGISTRY)
    .map((slug) => projectToCard(DEMO_REGISTRY[slug].build()))
    .filter((p) =>
      params.projectType ? p.projectType === params.projectType : true,
    );
}

/** Thẻ dự án catalog go-live — thương mại + NOXH khi Postgres chưa seed. */
export function listCatalogProjectCards(params: {
  projectType?: "THUONG_MAI" | "NHA_O_XA_HOI";
  province?: string;
  district?: string;
} = {}): ProjectCardData[] {
  return getCatalogSlugs(params.projectType)
    .map((slug) => DEMO_REGISTRY[slug]?.build())
    .filter((p): p is ProjectDetail => p != null)
    .filter((p) => {
      if (params.province && p.province !== params.province) return false;
      if (params.district && p.district !== params.district) return false;
      return true;
    })
    .map((p) => projectToCard(p));
}

/** @deprecated Dùng listCatalogProjectCards */
export function listGoLiveProjectCards(params: {
  projectType?: "THUONG_MAI" | "NHA_O_XA_HOI";
  province?: string;
  district?: string;
} = {}): ProjectCardData[] {
  return listCatalogProjectCards(params);
}

export function listAllDemoProjects(): ProjectDetail[] {
  return Object.values(DEMO_REGISTRY).map((e) => e.build());
}
