/**
 * Seed hub "mua nhà lần đầu + đảo nợ/DTI" (2 pillar + 6 spoke) vào content_queue_items.
 *
 * Nguồn brief: docs/content/FIRST_BUYER_DEBT_HUB_BRIEFS_V1.json
 * Doc vận hành: docs/content/FIRST_BUYER_DEBT_HUB_BRIEF_2026.md
 *
 * Idempotent — upsert theo normalized_key; KHÔNG ghi đè status / reviewed / article
 * của item đã có (an toàn chạy lại trên VPS prod).
 *
 * Usage: npx tsx scripts/seed-first-buyer-debt-hub-queue.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { getNoxhCtaTool } from "../lib/content/noxh-cta-tools";

const prisma = new PrismaClient();

type QaPair = {
  question: string;
  answer_angle: string;
  search_keyword: string;
  hook_line: string;
};

type BriefItem = {
  id: string;
  normalized_key: string;
  slug: string;
  h1: string;
  priority: string;
  content_type: string;
  segment: string;
  legal_topic: string;
  cta_tool_id: string;
  cta_keyword: string;
  interest_key: string;
  tags: string[];
  internal_links: string[];
  /** Markdown draft đã chốt — ưu tiên hơn scaffold Q&A từ brief. */
  body_draft?: string;
  editorial_brief_v1: {
    one_line_insight: string;
    qa_backbone: QaPair[];
    compliance_notes: string;
    source_refs: string[];
  };
};

type BriefPack = {
  doc: string;
  ship_order: string[];
  items: BriefItem[];
};

function stripDraftFrontmatter(raw: string): string {
  const fm = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  return (fm?.[1] ?? raw).trim();
}

function buildBodyPreview(item: BriefItem): string {
  if (item.body_draft) {
    const draftPath = resolve(__dirname, "..", item.body_draft);
    return stripDraftFrontmatter(readFileSync(draftPath, "utf8"));
  }

  const qa = item.editorial_brief_v1.qa_backbone
    .map((q) => `## ${q.question}\n- Góc trả lời: ${q.answer_angle}\n- Keyword: ${q.search_keyword}`)
    .join("\n\n");

  return [
    `# ${item.h1}`,
    "",
    `> ${item.editorial_brief_v1.one_line_insight}`,
    "",
    qa,
    "",
    `**Liên kết nội bộ:** ${item.internal_links.join(" · ")}`,
    `**source_refs (legal pack):** ${item.editorial_brief_v1.source_refs.join(", ")}`,
    `**Compliance:** ${item.editorial_brief_v1.compliance_notes}`,
  ].join("\n");
}

function buildOpsNotes(item: BriefItem, pack: BriefPack): string {
  return [
    `Hub mua nhà lần đầu + đảo nợ/DTI — item ${item.id} (${item.priority}).`,
    `slug: ${item.slug}`,
    `content_type: ${item.content_type} · cta_keyword: ${item.cta_keyword} · legal_topic: ${item.legal_topic}`,
    `interest_key: ${item.interest_key} · tags: ${item.tags.join(", ")}`,
    `Ship order: ${pack.ship_order.join(" → ")}`,
    `Brief: ${pack.doc}`,
  ].join("\n");
}

async function main() {
  const jsonPath = resolve(
    __dirname,
    "../docs/content/FIRST_BUYER_DEBT_HUB_BRIEFS_V1.json",
  );
  const pack = JSON.parse(readFileSync(jsonPath, "utf8")) as BriefPack;

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of pack.items) {
    const cta = getNoxhCtaTool(item.cta_tool_id);
    if (!cta) {
      throw new Error(`cta_tool_id ngoài allowlist: ${item.cta_tool_id} (${item.id})`);
    }

    const shared = {
      title: item.h1,
      painPoint: item.editorial_brief_v1.one_line_insight,
      bodyPreview: buildBodyPreview(item),
      segment: item.segment,
      score: 85,
      publishChannel: "WEBSITE" as const,
      ctaToolId: cta.id,
      ctaLabel: cta.defaultCtaLabel,
      ctaHref: cta.href,
      opsNotes: buildOpsNotes(item, pack),
    };

    const existing = await prisma.contentQueueItem.findUnique({
      where: { normalizedKey: item.normalized_key },
      select: { id: true, status: true },
    });

    if (existing) {
      if (existing.status === "PUBLISHED") {
        console.log(`↷ ${item.id} đã PUBLISHED — bỏ qua (${item.normalized_key})`);
        continue;
      }
      await prisma.contentQueueItem.update({
        where: { normalizedKey: item.normalized_key },
        data: shared,
      });
      updatedCount += 1;
      console.log(`✎ ${item.id} cập nhật brief (status giữ ${existing.status})`);
    } else {
      await prisma.contentQueueItem.create({
        data: {
          normalizedKey: item.normalized_key,
          status: "INTAKE",
          l3Checklist: { pain: true, ctaTool: true, ctaCopy: false },
          ...shared,
        },
      });
      createdCount += 1;
      console.log(`✔ ${item.id} tạo mới → INTAKE · ${cta.id} · "${item.h1.slice(0, 60)}…"`);
    }
  }

  console.log(
    `\nXong: ${createdCount} tạo mới, ${updatedCount} cập nhật (tổng ${pack.items.length}).`,
  );
  console.log("Duyệt tại /admin/content-queue — tick checklist L3 mục ctaCopy khi chốt câu CTA trên bài.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
