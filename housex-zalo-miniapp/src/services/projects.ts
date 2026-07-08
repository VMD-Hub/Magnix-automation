import { apiFetch } from "./api";

export type ProjectCard = {
  id: string;
  slug: string;
  name: string;
  projectType: string;
  status: string;
  province: string | null;
  district: string | null;
  heroImageUrl: string | null;
  unitTypeCount: number;
};

export type ProjectDetail = ProjectCard & {
  overviewText: string | null;
  unitTypes: Array<{
    id: string;
    name: string;
    priceFrom: string | null;
    areaMin: number | null;
    bedrooms: number | null;
  }>;
  developerName: string | null;
};

type OverviewLanding = {
  landing?: {
    heroImage?: { url?: string; alt?: string };
    gallery?: Array<{ url?: string }>;
    shortDescription?: string;
  };
  shortDescription?: string;
};

type ProjectRaw = {
  id: string;
  slug: string;
  name: string;
  projectType: string;
  status: string;
  province?: string | null;
  district?: string | null;
  overviewData?: unknown;
  developer?: { name?: string } | null;
  unitTypes?: Array<{
    id: string;
    name: string;
    priceFrom?: string | number | null;
    areaMin?: number | null;
    bedrooms?: number | null;
  }>;
  _count?: { unitTypes?: number };
};

function pickHero(overviewData: unknown): string | null {
  const o = overviewData as OverviewLanding | null;
  return (
    o?.landing?.heroImage?.url ??
    o?.landing?.gallery?.[0]?.url ??
    null
  );
}

function pickOverviewText(overviewData: unknown): string | null {
  const o = overviewData as OverviewLanding | null;
  return o?.landing?.shortDescription ?? o?.shortDescription ?? null;
}

export function mapProjectCard(raw: ProjectRaw): ProjectCard {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    projectType: raw.projectType,
    status: raw.status,
    province: raw.province ?? null,
    district: raw.district ?? null,
    heroImageUrl: pickHero(raw.overviewData),
    unitTypeCount: raw._count?.unitTypes ?? 0,
  };
}

export function mapProjectDetail(raw: ProjectRaw): ProjectDetail {
  const card = mapProjectCard(raw);
  return {
    ...card,
    overviewText: pickOverviewText(raw.overviewData),
    developerName: raw.developer?.name ?? null,
    unitTypes: (raw.unitTypes ?? []).map((u) => ({
      id: u.id,
      name: u.name,
      priceFrom: u.priceFrom != null ? String(u.priceFrom) : null,
      areaMin: u.areaMin ?? null,
      bedrooms: u.bedrooms ?? null,
    })),
  };
}

export async function listProjects(opts?: {
  projectType?: string;
  status?: string;
  pageSize?: number;
}): Promise<{ items: ProjectCard[]; total: number }> {
  const q = new URLSearchParams();
  q.set("page", "1");
  q.set("pageSize", String(opts?.pageSize ?? 20));
  if (opts?.projectType) q.set("projectType", opts.projectType);
  if (opts?.status) q.set("status", opts.status);

  const data = await apiFetch<{
    items: ProjectRaw[];
    pagination: { total: number };
  }>(`/api/projects?${q.toString()}`);

  return {
    items: data.items.map(mapProjectCard),
    total: data.pagination.total,
  };
}

export async function getProject(slug: string): Promise<ProjectDetail> {
  const raw = await apiFetch<ProjectRaw>(
    `/api/projects/${encodeURIComponent(slug)}`,
  );
  return mapProjectDetail(raw);
}

export async function createProjectLead(input: {
  name: string;
  phone: string;
  projectId: string;
  message?: string;
}): Promise<{ id: string }> {
  const idem =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `mini-${Date.now()}-${input.phone}`;

  return apiFetch<{ id: string }>("/api/leads", {
    method: "POST",
    headers: { "Idempotency-Key": idem },
    body: JSON.stringify({
      name: input.name,
      phone: input.phone,
      projectId: input.projectId,
      message: input.message,
      source: "zalo_miniapp",
    }),
  });
}
