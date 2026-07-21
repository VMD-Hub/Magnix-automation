/**
 * Tool analytics (P2) — funnel SoR: content CTA → lead (submit) → CRM status.
 * Pageview hiện chỉ GTM dataLayer — chưa lưu Postgres (hiển thị null).
 */

import { ALL_TOOLS } from "@/lib/content/housex-tools-registry";
import { NOXH_CTA_TOOL_IDS, type NoxhCtaToolId } from "@/lib/content/noxh-cta-tools";
import { LEAD_SOURCE } from "@/lib/leads/source";
import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@prisma/client";

/** tool registry id → Lead.source khi tool tạo lead. */
export const TOOL_LEAD_SOURCE: Partial<Record<string, string>> = {
  "noxh-check": LEAD_SOURCE.TOOL_NOXH_CHECK,
  "noxh-loan-quick": LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK,
};

export const TOOL_ANALYTICS_WINDOW_DAYS = [7, 30, 90] as const;
export type ToolAnalyticsWindowDays = (typeof TOOL_ANALYTICS_WINDOW_DAYS)[number];

export type ToolAnalyticsRow = {
  toolId: string;
  title: string;
  href: string;
  category: string;
  priority: boolean;
  leadSource: string | null;
  /** Pageview SoR — chưa có; GTM only. */
  views: null;
  /** Lead tạo từ tool (submit có SĐT) trong cửa sổ. */
  leads: number;
  byStatus: Record<LeadStatus, number>;
  /** Item content-queue gắn CTA tool (APPROVED + PUBLISHED) trong cửa sổ. */
  contentCtaItems: number;
  /** Trong đó đã PUBLISHED. */
  contentPublished: number;
};

export type ToolAnalyticsSummary = {
  windowDays: number;
  since: string;
  priorityLeads: number;
  priorityContentPublished: number;
  totalLeadsFromTools: number;
  toolsWithLeadSource: number;
  toolsWithoutLeadSource: number;
  note: string;
};

export type ToolAnalyticsWeeklyPoint = {
  weekStart: string;
  noxhCheck: number;
  noxhLoanQuick: number;
};

export type ToolAnalyticsPayload = {
  summary: ToolAnalyticsSummary;
  tools: ToolAnalyticsRow[];
  weekly: ToolAnalyticsWeeklyPoint[];
};

const EMPTY_STATUS = (): Record<LeadStatus, number> => ({
  NEW: 0,
  CONTACTED: 0,
  QUALIFIED: 0,
  WON: 0,
  LOST: 0,
});

export function resolveToolAnalyticsWindow(
  raw: string | null | undefined,
): ToolAnalyticsWindowDays {
  const n = Number(raw ?? "30");
  if (n === 7 || n === 90) return n;
  return 30;
}

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** 4 tuần gần nhất (UTC), tuần bắt đầu Monday. */
export function lastFourWeekStarts(now = new Date()): Date[] {
  const today = startOfUtcDay(now);
  const day = today.getUTCDay(); // 0 Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const thisMonday = new Date(today);
  thisMonday.setUTCDate(today.getUTCDate() + mondayOffset);
  return [3, 2, 1, 0].map((w) => {
    const d = new Date(thisMonday);
    d.setUTCDate(thisMonday.getUTCDate() - w * 7);
    return d;
  });
}

export async function getToolAnalytics(
  windowDays: ToolAnalyticsWindowDays,
): Promise<ToolAnalyticsPayload> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - windowDays);

  const leadSources = Object.values(TOOL_LEAD_SOURCE).filter(Boolean) as string[];

  const [leadGroups, contentGroups, weekStarts] = await Promise.all([
    prisma.lead.groupBy({
      by: ["source", "status"],
      where: {
        source: { in: leadSources },
        createdAt: { gte: since },
      },
      _count: { _all: true },
    }),
    prisma.contentQueueItem.groupBy({
      by: ["ctaToolId", "status"],
      where: {
        ctaToolId: { in: [...NOXH_CTA_TOOL_IDS] },
        status: { in: ["APPROVED", "PUBLISHED"] },
        createdAt: { gte: since },
      },
      _count: { _all: true },
    }),
    Promise.resolve(lastFourWeekStarts()),
  ]);

  const leadBySource = new Map<string, { total: number; byStatus: Record<LeadStatus, number> }>();
  for (const src of leadSources) {
    leadBySource.set(src, { total: 0, byStatus: EMPTY_STATUS() });
  }
  for (const row of leadGroups) {
    const bucket = leadBySource.get(row.source);
    if (!bucket) continue;
    const n = row._count._all;
    bucket.total += n;
    bucket.byStatus[row.status] += n;
  }

  const contentByTool = new Map<string, { items: number; published: number }>();
  for (const id of NOXH_CTA_TOOL_IDS) {
    contentByTool.set(id, { items: 0, published: 0 });
  }
  for (const row of contentGroups) {
    if (!row.ctaToolId) continue;
    const bucket = contentByTool.get(row.ctaToolId) ?? { items: 0, published: 0 };
    bucket.items += row._count._all;
    if (row.status === "PUBLISHED") bucket.published += row._count._all;
    contentByTool.set(row.ctaToolId, bucket);
  }

  const weekly = await buildWeeklySeries(weekStarts);

  const tools: ToolAnalyticsRow[] = ALL_TOOLS.filter((t) => t.ready).map((t) => {
    const leadSource = TOOL_LEAD_SOURCE[t.id] ?? null;
    const leadBucket = leadSource ? leadBySource.get(leadSource) : null;
    const content =
      contentByTool.get(t.id) ??
      ({ items: 0, published: 0 } as { items: number; published: number });
    const priority = NOXH_CTA_TOOL_IDS.includes(t.id as NoxhCtaToolId);

    return {
      toolId: t.id,
      title: t.title,
      href: t.href,
      category: t.category,
      priority,
      leadSource,
      views: null,
      leads: leadBucket?.total ?? 0,
      byStatus: leadBucket?.byStatus ?? EMPTY_STATUS(),
      contentCtaItems: content.items,
      contentPublished: content.published,
    };
  });

  // Priority tools first, then by leads desc
  tools.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority ? -1 : 1;
    if (b.leads !== a.leads) return b.leads - a.leads;
    return a.title.localeCompare(b.title, "vi");
  });

  const priority = tools.filter((t) => t.priority);
  const withSource = tools.filter((t) => t.leadSource);
  const summary: ToolAnalyticsSummary = {
    windowDays,
    since: since.toISOString(),
    priorityLeads: priority.reduce((s, t) => s + t.leads, 0),
    priorityContentPublished: priority.reduce((s, t) => s + t.contentPublished, 0),
    totalLeadsFromTools: withSource.reduce((s, t) => s + t.leads, 0),
    toolsWithLeadSource: withSource.length,
    toolsWithoutLeadSource: tools.length - withSource.length,
    note:
      "Views chưa có trong Postgres (chỉ GTM). Submit = Lead có source tool:*. Ưu tiên 2 tool NƠXH CTA.",
  };

  return { summary, tools, weekly };
}

async function buildWeeklySeries(weekStarts: Date[]): Promise<ToolAnalyticsWeeklyPoint[]> {
  const end = new Date(weekStarts[weekStarts.length - 1]!);
  end.setUTCDate(end.getUTCDate() + 7);

  const leads = await prisma.lead.findMany({
    where: {
      source: {
        in: [LEAD_SOURCE.TOOL_NOXH_CHECK, LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK],
      },
      createdAt: { gte: weekStarts[0], lt: end },
    },
    select: { source: true, createdAt: true },
  });

  return weekStarts.map((start, i) => {
    const next = weekStarts[i + 1] ?? end;
    let noxhCheck = 0;
    let noxhLoanQuick = 0;
    for (const lead of leads) {
      if (lead.createdAt < start || lead.createdAt >= next) continue;
      if (lead.source === LEAD_SOURCE.TOOL_NOXH_CHECK) noxhCheck += 1;
      if (lead.source === LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK) noxhLoanQuick += 1;
    }
    return {
      weekStart: start.toISOString().slice(0, 10),
      noxhCheck,
      noxhLoanQuick,
    };
  });
}
