import { prisma } from "@/lib/prisma";
import { parseProjectOverview } from "@/lib/content/project-landing";
import { z } from "zod";
import type { TelesalesProjectFacts } from "@/lib/leads/telesales-call-cues";
import { buildNoxhCallCuePayload } from "@/lib/leads/telesales-call-cues";
import type { LeadSegment } from "@prisma/client";

/** Optional master fields for telesales cues — stored in overviewData.telesalesFacts. */
export const projectTelesalesFactsSchema = z
  .object({
    pricePerSqmLabel: z.string().trim().min(1).max(80).optional(),
    priceFromLabel: z.string().trim().min(1).max(80).optional(),
    applicationDeadline: z.string().trim().min(1).max(40).optional(),
    promoUnitsRemaining: z.number().int().min(0).max(100_000).optional(),
    promoDiscountLabel: z.string().trim().min(1).max(80).optional(),
    valueAnchors: z.array(z.string().trim().min(1).max(160)).max(5).optional(),
    legalProofHint: z.string().trim().min(1).max(240).optional(),
    bankLoanHint: z.string().trim().min(1).max(240).optional(),
  })
  .strict();

export type ProjectTelesalesFactsInput = z.infer<
  typeof projectTelesalesFactsSchema
>;

function formatVnd(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n >= 1_000_000_000) {
    const ty = n / 1_000_000_000;
    return `${ty % 1 === 0 ? ty.toFixed(0) : ty.toFixed(2)} tỷ`;
  }
  if (n >= 1_000_000) {
    const tr = n / 1_000_000;
    return `${tr % 1 === 0 ? tr.toFixed(0) : tr.toFixed(1)} triệu`;
  }
  return new Intl.NumberFormat("vi-VN").format(Math.round(n));
}

function formatDeadlineLabel(raw: string): string {
  const iso = Date.parse(raw);
  if (!Number.isNaN(iso)) {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  return raw.trim();
}

function readTelesalesFactsFromOverview(
  overviewData: unknown,
): ProjectTelesalesFactsInput {
  if (!overviewData || typeof overviewData !== "object" || Array.isArray(overviewData)) {
    return {};
  }
  const raw = (overviewData as { telesalesFacts?: unknown }).telesalesFacts;
  const parsed = projectTelesalesFactsSchema.safeParse(raw);
  return parsed.success ? parsed.data : {};
}

export async function resolveTelesalesProjectFacts(
  projectId: string | null | undefined,
): Promise<TelesalesProjectFacts> {
  const empty: TelesalesProjectFacts = {
    projectId: null,
    projectName: null,
    projectSlug: null,
    priceFromLabel: null,
    pricePerSqmLabel: null,
    applicationDeadlineLabel: null,
    promoUnitsRemaining: null,
    promoDiscountLabel: null,
    valueAnchors: [],
    legalProofHint: null,
    bankLoanHint: null,
    missingFields: [
      "project",
      "priceFrom",
      "applicationDeadline",
      "promoUnitsRemaining",
    ],
  };

  if (!projectId) return empty;

  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
    select: {
      id: true,
      name: true,
      slug: true,
      overviewData: true,
      unitTypes: {
        select: { priceFrom: true },
        orderBy: { priceFrom: "asc" },
        take: 8,
      },
      units: {
        where: { deletedAt: null, status: "AVAILABLE" },
        select: { id: true, price: true },
        take: 50,
        orderBy: { price: "asc" },
      },
    },
  });

  if (!project) return empty;

  const overview = parseProjectOverview(project.overviewData);
  const facts = readTelesalesFactsFromOverview(project.overviewData);

  let priceFromNum: number | null = null;
  for (const ut of project.unitTypes) {
    if (ut.priceFrom == null) continue;
    const n = Number(ut.priceFrom.toString());
    if (Number.isFinite(n) && n > 0) {
      priceFromNum = n;
      break;
    }
  }
  if (priceFromNum == null && project.units[0]) {
    const n = Number(project.units[0].price.toString());
    if (Number.isFinite(n) && n > 0) priceFromNum = n;
  }

  const priceFromLabel =
    facts.priceFromLabel?.trim() ||
    (priceFromNum != null ? `từ ${formatVnd(priceFromNum)}` : null);

  const pricePerSqmLabel = facts.pricePerSqmLabel?.trim() || null;
  const applicationDeadlineLabel = facts.applicationDeadline
    ? formatDeadlineLabel(facts.applicationDeadline)
    : null;
  const promoUnitsRemaining =
    facts.promoUnitsRemaining != null
      ? facts.promoUnitsRemaining
      : null;
  const promoDiscountLabel = facts.promoDiscountLabel?.trim() || null;

  const valueAnchors =
    facts.valueAnchors && facts.valueAnchors.length > 0
      ? facts.valueAnchors.slice(0, 3)
      : (overview.landing?.highlights ?? [])
          .slice(0, 2)
          .map((h) => h.title)
          .filter(Boolean);

  const missingFields: string[] = [];
  if (!priceFromLabel && !pricePerSqmLabel) missingFields.push("priceFrom");
  if (!applicationDeadlineLabel) missingFields.push("applicationDeadline");
  if (promoUnitsRemaining == null) missingFields.push("promoUnitsRemaining");

  return {
    projectId: project.id,
    projectName: project.name,
    projectSlug: project.slug,
    priceFromLabel,
    pricePerSqmLabel,
    applicationDeadlineLabel,
    promoUnitsRemaining,
    promoDiscountLabel,
    valueAnchors,
    legalProofHint: facts.legalProofHint?.trim() || null,
    bankLoanHint: facts.bankLoanHint?.trim() || null,
    missingFields,
  };
}

export async function resolveCallCueForLead(input: {
  segment: LeadSegment | null | undefined;
  projectId: string | null | undefined;
}) {
  if (input.segment !== "NOXH") {
    return {
      callCue: null as ReturnType<typeof buildNoxhCallCuePayload> | null,
      deferredSegment: input.segment ?? null,
    };
  }
  const facts = await resolveTelesalesProjectFacts(input.projectId);
  return {
    callCue: buildNoxhCallCuePayload(facts),
    deferredSegment: null as LeadSegment | null,
  };
}
