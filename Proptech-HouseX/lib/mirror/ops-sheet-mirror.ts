import { prisma } from "@/lib/prisma";
import {
  getGoogleSheetsAccessToken,
  sheetsValuesClear,
  sheetsValuesUpdate,
} from "@/lib/google/sheets-client";
import { buildOpsMirrorSheetValues } from "@/lib/mirror/ops-sheet-rows";

export type OpsSheetMirrorResult = {
  skipped: boolean;
  reason?: string;
  tab?: string;
  inboundRows?: number;
  noxhRows?: number;
  totalRows?: number;
};

/** Postgres → Google Sheet `ops_mirror` (1 chiều, read-only cho ops). */
export async function runOpsSheetMirror(): Promise<OpsSheetMirrorResult> {
  if (process.env.MAGNIX_SHEET_MIRROR_ENABLED !== "true") {
    return { skipped: true, reason: "MAGNIX_SHEET_MIRROR_ENABLED is not true" };
  }

  const sheetId = process.env.GOOGLE_SHEET_MIRROR_ID?.trim();
  const tab = process.env.GOOGLE_SHEET_MIRROR_TAB?.trim() || "ops_mirror";
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_MIRROR_ID is required when mirror is enabled");
  }

  const limitInbound = Number(process.env.SHEET_MIRROR_INBOUND_LIMIT ?? "500");
  const limitNoxh = Number(process.env.SHEET_MIRROR_NOXH_LIMIT ?? "300");

  const [inbound, noxhCases] = await Promise.all([
    prisma.inboundUidLead.findMany({
      orderBy: [{ capturedAt: "desc" }],
      take: Number.isFinite(limitInbound) ? limitInbound : 500,
    }),
    prisma.noxhCase.findMany({
      where: { caseStatus: "ACTIVE" },
      include: {
        broker: { select: { fullName: true } },
        project: { select: { name: true } },
        documents: { select: { docType: true, status: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: Number.isFinite(limitNoxh) ? limitNoxh : 300,
    }),
  ]);

  const values = buildOpsMirrorSheetValues({
    syncedAt: new Date().toISOString(),
    inbound,
    noxhCases,
  });

  const token = await getGoogleSheetsAccessToken();
  await sheetsValuesClear(sheetId, `${tab}!A:Z`, token);
  await sheetsValuesUpdate(sheetId, `${tab}!A1`, values, token);

  return {
    skipped: false,
    tab,
    inboundRows: inbound.length,
    noxhRows: noxhCases.length,
    totalRows: values.length,
  };
}
