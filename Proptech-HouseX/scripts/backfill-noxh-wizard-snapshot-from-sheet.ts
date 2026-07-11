/**
 * Backfill Lead.opsMeta.wizardSnapshot từ tab Google Sheet `noxh_leads_detail`.
 *
 * Usage:
 *   # Dry-run (mặc định) — chỉ in lead sẽ cập nhật
 *   node --env-file=.env --import tsx scripts/backfill-noxh-wizard-snapshot-from-sheet.ts
 *
 *   # Ghi Postgres
 *   node --env-file=.env --import tsx scripts/backfill-noxh-wizard-snapshot-from-sheet.ts --apply
 *
 *   # Một lead
 *   ... --apply --lead-id=clxxx
 *
 * Env:
 *   GOOGLE_SERVICE_ACCOUNT_JSON — path hoặc JSON inline
 *   GOOGLE_SHEET_MIRROR_ID hoặc MAGNIX_GOOGLE_SHEET_ID (mặc định magnix-public-config)
 *   NOXH_DETAIL_SHEET_TAB — mặc định noxh_leads_detail
 */
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma.ts";
import {
  getGoogleSheetsAccessToken,
  sheetsValuesGet,
} from "../lib/google/sheets-client.ts";
import {
  dedupeNoxhSheetDetailRows,
  parseNoxhSheetDetailTable,
  buildWizardSnapshotFromSheetRow,
} from "../lib/leads/noxh-sheet-detail.ts";
import {
  mergeLeadOpsMeta,
  readLeadOpsMeta,
} from "../lib/leads/ops-meta.ts";
import { LEAD_SOURCE } from "../lib/leads/source.ts";

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit?.slice(flag.length + 1);
}

function loadDefaultSheetId(): string {
  const fromEnv =
    process.env.GOOGLE_SHEET_MIRROR_ID?.trim() ||
    process.env.MAGNIX_GOOGLE_SHEET_ID?.trim();
  if (fromEnv) return fromEnv;

  const configPath = path.resolve(
    import.meta.dirname,
    "../../n8n-workflows/magnix-public-config.json",
  );
  if (fs.existsSync(configPath)) {
    const cfg = JSON.parse(fs.readFileSync(configPath, "utf8")) as {
      google_sheet_id?: string;
    };
    if (cfg.google_sheet_id) return cfg.google_sheet_id;
  }

  throw new Error(
    "Thiếu GOOGLE_SHEET_MIRROR_ID — hoặc magnix-public-config.json",
  );
}

async function main() {
  const apply = process.argv.includes("--apply");
  const force = process.argv.includes("--force");
  const leadIdFilter = argValue("--lead-id");
  const limit = Number(argValue("--limit") ?? "0") || 0;

  const sheetId = loadDefaultSheetId();
  const tab =
    process.env.NOXH_DETAIL_SHEET_TAB?.trim() || "noxh_leads_detail";

  console.log(
    `Backfill wizardSnapshot — sheet=${sheetId} tab=${tab} mode=${apply ? "APPLY" : "DRY-RUN"}`,
  );

  const token = await getGoogleSheetsAccessToken();
  const values = await sheetsValuesGet(sheetId, `${tab}!A:V`, token);
  const parsed = parseNoxhSheetDetailTable(values);
  const byLeadId = dedupeNoxhSheetDetailRows(parsed);

  console.log(
    `Sheet: ${parsed.length} dòng hợp lệ → ${byLeadId.size} lead_id (dedupe)`,
  );

  const leads = await prisma.lead.findMany({
    where: {
      source: LEAD_SOURCE.TOOL_NOXH_CHECK,
      ...(leadIdFilter ? { id: leadIdFilter } : {}),
    },
    select: { id: true, message: true, opsMeta: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  let scanned = 0;
  let skippedHasSnapshot = 0;
  let skippedNoSheet = 0;
  let updated = 0;

  for (const lead of leads) {
    if (limit > 0 && updated >= limit) break;
    scanned++;

    const ops = readLeadOpsMeta(lead.opsMeta);
    if (ops.wizardSnapshot && !force) {
      skippedHasSnapshot++;
      continue;
    }

    const sheetRow = byLeadId.get(lead.id);
    if (!sheetRow) {
      skippedNoSheet++;
      continue;
    }

    const snapshot = buildWizardSnapshotFromSheetRow(sheetRow);
    const preview = snapshot.listPreviewVi;

    if (!apply) {
      console.log(
        `[dry-run] ${lead.id} → ${preview.slice(0, 100)}${preview.length > 100 ? "…" : ""}`,
      );
      updated++;
      continue;
    }

    const nextMeta = mergeLeadOpsMeta(lead.opsMeta, {
      wizardSnapshot: snapshot,
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: { opsMeta: nextMeta },
    });

    console.log(`[updated] ${lead.id}`);
    updated++;
  }

  console.log("");
  console.log(`Scanned tool:noxh-check leads: ${scanned}`);
  console.log(`Skipped (đã có snapshot): ${skippedHasSnapshot}`);
  console.log(`Skipped (không có trên Sheet): ${skippedNoSheet}`);
  console.log(`${apply ? "Updated" : "Would update"}: ${updated}`);

  if (!apply && updated > 0) {
    console.log("\nChạy lại với --apply để ghi Postgres.");
  }
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

