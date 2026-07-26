/**
 * Seed cụm Luật Nhà ở 2023 & dự thảo 2026 (CCTM) — 1 pillar + 6 cluster
 * vào content_queue_items với full draft body.
 *
 * Nguồn: docs/content/LUAT_NHA_O_CCTM_QUEUE_PACK_V1.json
 *        docs/content/drafts/{00..06}-*.md
 * Doc:   docs/content/LUAT_NHA_O_CCTM_CLUSTER_2026.md
 *
 * Idempotent — upsert theo normalized_key; không ghi đè status / article
 * khi item đã PUBLISHED.
 *
 * Usage:
 *   npm run db:seed:cctm-luat-nha-o-queue
 *   npm run db:seed:cctm-luat-nha-o-queue:dry
 *   node --env-file=.env --import tsx scripts/seed-cctm-luat-nha-o-queue.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { getNoxhCtaTool } from "../lib/content/noxh-cta-tools";

const dryRun = process.argv.includes("--dry-run");
const prisma = dryRun ? null : new PrismaClient();

type PackItem = {
  id: string;
  normalized_key: string;
  slug: string;
  priority: string;
  cta_tool_id: string;
  segment: string;
  draft_file: string;
};

type Pack = {
  doc: string;
  content_type: string;
  requires_legal_qa: boolean;
  ship_order: string[];
  items: PackItem[];
};

type DraftFrontmatter = {
  title?: string;
  painPoint?: string;
  excerpt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  slug?: string;
};

function parseDraft(raw: string): { meta: DraftFrontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }
  const yaml = match[1];
  const body = match[2].trim();
  const meta: DraftFrontmatter = {};
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key === "title") meta.title = val;
    else if (key === "painPoint") meta.painPoint = val;
    else if (key === "excerpt") meta.excerpt = val;
    else if (key === "ctaLabel") meta.ctaLabel = val;
    else if (key === "ctaHref") meta.ctaHref = val;
    else if (key === "slug") meta.slug = val;
  }
  return { meta, body };
}

function buildOpsNotes(item: PackItem, pack: Pack, draftPath: string): string {
  return [
    `Cluster CCTM Luật Nhà ở 2023 & dự thảo 2026 — item ${item.id} (${item.priority}).`,
    `slug: ${item.slug}`,
    `content_type: ${pack.content_type} · requires_legal_qa: ${pack.requires_legal_qa}`,
    `segment: ${item.segment}`,
    `Ship order: ${pack.ship_order.join(" → ")}`,
    `Draft: ${draftPath}`,
    `Brief: ${pack.doc}`,
    "L2 /devil bắt buộc trước L3 — dự thảo ≠ luật đã ban hành.",
  ].join("\n");
}

async function main() {
  const root = resolve(__dirname, "..");
  const packPath = resolve(root, "docs/content/LUAT_NHA_O_CCTM_QUEUE_PACK_V1.json");
  const pack = JSON.parse(readFileSync(packPath, "utf8")) as Pack;

  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let validatedCount = 0;

  for (const id of pack.ship_order) {
    const item = pack.items.find((x) => x.id === id);
    if (!item) throw new Error(`ship_order thiếu item: ${id}`);

    const cta = getNoxhCtaTool(item.cta_tool_id);
    if (!cta) {
      throw new Error(`cta_tool_id ngoài allowlist: ${item.cta_tool_id} (${item.id})`);
    }

    const draftAbs = resolve(root, item.draft_file);
    const { meta, body } = parseDraft(readFileSync(draftAbs, "utf8"));
    const title = meta.title?.trim();
    if (!title) throw new Error(`Draft thiếu title: ${item.draft_file}`);
    if (!body.includes("## Kiểm tra nhanh (CTA)")) {
      throw new Error(`Draft thiếu section CTA: ${item.draft_file}`);
    }
    if (meta.slug && meta.slug !== item.slug) {
      throw new Error(`Slug lệch pack vs draft: pack=${item.slug} draft=${meta.slug}`);
    }

    if (dryRun) {
      validatedCount += 1;
      console.log(
        `✓ ${item.id} OK · ${cta.id} · ${body.split(/\s+/).length} từ · "${title.slice(0, 52)}…"`,
      );
      continue;
    }

    const shared = {
      title,
      painPoint: meta.painPoint?.trim() || meta.excerpt?.trim() || null,
      bodyPreview: body,
      segment: item.segment,
      score: 88,
      publishChannel: "WEBSITE" as const,
      ctaToolId: cta.id,
      ctaLabel: meta.ctaLabel?.trim() || cta.defaultCtaLabel,
      ctaHref: meta.ctaHref?.trim() || cta.href,
      opsNotes: buildOpsNotes(item, pack, item.draft_file),
    };

    const existing = await prisma!.contentQueueItem.findUnique({
      where: { normalizedKey: item.normalized_key },
      select: { id: true, status: true },
    });

    if (existing) {
      if (existing.status === "PUBLISHED") {
        console.log(`↷ ${item.id} đã PUBLISHED — bỏ qua (${item.normalized_key})`);
        skippedCount += 1;
        continue;
      }
      await prisma!.contentQueueItem.update({
        where: { normalizedKey: item.normalized_key },
        data: {
          ...shared,
          l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
        },
      });
      updatedCount += 1;
      console.log(`✎ ${item.id} cập nhật draft (status giữ ${existing.status})`);
    } else {
      await prisma!.contentQueueItem.create({
        data: {
          normalizedKey: item.normalized_key,
          status: "INTAKE",
          l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
          ...shared,
        },
      });
      createdCount += 1;
      console.log(
        `✔ ${item.id} tạo mới → INTAKE · ${cta.id} · "${title.slice(0, 56)}…"`,
      );
    }
  }

  if (dryRun) {
    console.log(`\nDry-run OK: ${validatedCount}/${pack.items.length} draft sẵn sàng nạp queue.`);
    console.log("Bật Postgres rồi chạy npm run db:seed:cctm-luat-nha-o-queue để ghi DB.");
    return;
  }

  console.log(
    `\nXong: ${createdCount} tạo mới, ${updatedCount} cập nhật, ${skippedCount} bỏ qua (tổng ${pack.items.length}).`,
  );
  console.log("Duyệt tại /admin/content-queue — L2 /devil rồi submit_l3 → approve → publish_web.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
