import type {
  EarlySignalBrief,
  EarlySignalResolveStatus,
  EarlySignalRoleHint,
  EarlySignalStatus,
  EarlySignalTier,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  assertEarlySignalReadyForL3,
  DEFAULT_T1_READER_DISCLAIMER,
} from "@/lib/leads/early-signal-gates";

export type EarlySignalWithRefs = EarlySignalBrief & {
  project: { id: string; name: string; slug: string; status: string } | null;
  article: { id: string; slug: string; title: string; status: string } | null;
};

const includeRefs = {
  project: { select: { id: true, name: true, slug: true, status: true } },
  article: { select: { id: true, slug: true, title: true, status: true } },
} as const;

export type EarlySignalWriteInput = {
  tier?: EarlySignalTier;
  pressUrl?: string | null;
  sxdUrl?: string | null;
  groupSlug?: string | null;
  channelSlug?: string | null;
  roleHint?: EarlySignalRoleHint | null;
  resolveStatus?: EarlySignalResolveStatus | null;
  provinceHint?: string | null;
  projectId?: string | null;
  articleId?: string | null;
  opsNotes?: string | null;
  readerTitle?: string | null;
  readerBody?: string | null;
  readerDisclaimer?: string | null;
  ctaLabel?: string | null;
  nurtureOnApprove?: boolean;
};

export async function listEarlySignalsForAdmin(
  status: EarlySignalStatus | "ALL",
): Promise<EarlySignalWithRefs[]> {
  return prisma.earlySignalBrief.findMany({
    where: status === "ALL" ? undefined : { status },
    include: includeRefs,
    orderBy: [{ createdAt: "desc" }],
    take: 200,
  });
}

export async function getEarlySignalById(
  id: string,
): Promise<EarlySignalWithRefs | null> {
  return prisma.earlySignalBrief.findUnique({
    where: { id },
    include: includeRefs,
  });
}

export async function createEarlySignal(
  input: EarlySignalWriteInput,
): Promise<EarlySignalWithRefs> {
  const tier = input.tier ?? "T1_PRESS";
  return prisma.earlySignalBrief.create({
    data: {
      tier,
      pressUrl: input.pressUrl ?? null,
      sxdUrl: input.sxdUrl ?? null,
      groupSlug: input.groupSlug ?? null,
      channelSlug: input.channelSlug ?? null,
      roleHint: input.roleHint ?? null,
      resolveStatus: input.resolveStatus ?? null,
      provinceHint: input.provinceHint ?? null,
      projectId: input.projectId ?? null,
      opsNotes: input.opsNotes ?? null,
      readerTitle: input.readerTitle ?? null,
      readerBody: input.readerBody ?? null,
      readerDisclaimer:
        input.readerDisclaimer ??
        (tier === "T1_PRESS" ? DEFAULT_T1_READER_DISCLAIMER : null),
      ctaLabel: input.ctaLabel ?? "Đăng ký nhận cập nhật",
      nurtureOnApprove: input.nurtureOnApprove ?? false,
    },
    include: includeRefs,
  });
}

export async function updateEarlySignal(
  id: string,
  input: EarlySignalWriteInput,
): Promise<EarlySignalWithRefs> {
  return prisma.earlySignalBrief.update({
    where: { id },
    data: {
      ...(input.tier !== undefined ? { tier: input.tier } : {}),
      ...(input.pressUrl !== undefined ? { pressUrl: input.pressUrl } : {}),
      ...(input.sxdUrl !== undefined ? { sxdUrl: input.sxdUrl } : {}),
      ...(input.groupSlug !== undefined ? { groupSlug: input.groupSlug } : {}),
      ...(input.channelSlug !== undefined
        ? { channelSlug: input.channelSlug }
        : {}),
      ...(input.roleHint !== undefined ? { roleHint: input.roleHint } : {}),
      ...(input.resolveStatus !== undefined
        ? { resolveStatus: input.resolveStatus }
        : {}),
      ...(input.provinceHint !== undefined
        ? { provinceHint: input.provinceHint }
        : {}),
      ...(input.projectId !== undefined ? { projectId: input.projectId } : {}),
      ...(input.articleId !== undefined ? { articleId: input.articleId } : {}),
      ...(input.opsNotes !== undefined ? { opsNotes: input.opsNotes } : {}),
      ...(input.readerTitle !== undefined
        ? { readerTitle: input.readerTitle }
        : {}),
      ...(input.readerBody !== undefined ? { readerBody: input.readerBody } : {}),
      ...(input.readerDisclaimer !== undefined
        ? { readerDisclaimer: input.readerDisclaimer }
        : {}),
      ...(input.ctaLabel !== undefined ? { ctaLabel: input.ctaLabel } : {}),
      ...(input.nurtureOnApprove !== undefined
        ? { nurtureOnApprove: input.nurtureOnApprove }
        : {}),
    },
    include: includeRefs,
  });
}

export async function packageEarlySignal(id: string): Promise<EarlySignalWithRefs> {
  const row = await getEarlySignalById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (
    row.status !== "CAPTURED" &&
    row.status !== "REJECTED" &&
    row.status !== "PACKAGED"
  ) {
    throw new Error("INVALID_STATUS");
  }
  if (!row.readerTitle?.trim() || !row.readerBody?.trim()) {
    throw new Error("PACKAGE_INCOMPLETE");
  }
  return prisma.earlySignalBrief.update({
    where: { id },
    data: {
      status: "PACKAGED",
      packagedAt: new Date(),
      rejectReason: null,
    },
    include: includeRefs,
  });
}

export async function submitEarlySignalL3(id: string): Promise<EarlySignalWithRefs> {
  const row = await getEarlySignalById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "PACKAGED" && row.status !== "REJECTED") {
    throw new Error("INVALID_STATUS");
  }
  const gate = assertEarlySignalReadyForL3(row);
  if (!gate.pass) {
    const err = new Error("GATE_FAILED");
    (err as Error & { details?: string[] }).details = gate.errors;
    throw err;
  }
  return prisma.earlySignalBrief.update({
    where: { id },
    data: {
      status: "PENDING_L3",
      submittedAt: new Date(),
      rejectReason: null,
    },
    include: includeRefs,
  });
}

/** L3 only — caller must enforce super admin. */
export async function approveEarlySignal(
  id: string,
  reviewedBy: string,
): Promise<EarlySignalWithRefs> {
  const row = await getEarlySignalById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "PENDING_L3") throw new Error("NOT_PENDING");
  return prisma.earlySignalBrief.update({
    where: { id },
    data: {
      status: "APPROVED",
      reviewedAt: new Date(),
      reviewedBy,
      rejectReason: null,
    },
    include: includeRefs,
  });
}

export async function rejectEarlySignal(
  id: string,
  reviewedBy: string,
  rejectReason: string,
): Promise<EarlySignalWithRefs> {
  const row = await getEarlySignalById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "PENDING_L3") throw new Error("NOT_PENDING");
  return prisma.earlySignalBrief.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedBy,
      rejectReason,
    },
    include: includeRefs,
  });
}

export async function markEarlySignalPublished(
  id: string,
): Promise<EarlySignalWithRefs> {
  const row = await getEarlySignalById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "APPROVED" && row.status !== "PUBLISHED") {
    throw new Error("INVALID_STATUS");
  }
  return prisma.earlySignalBrief.update({
    where: { id },
    data: { status: "PUBLISHED" },
    include: includeRefs,
  });
}
