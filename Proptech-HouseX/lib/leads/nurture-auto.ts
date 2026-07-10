import type { LeadSegment, Prisma } from "@prisma/client";
import { enqueueEvent } from "@/lib/events/outbox";
import type { OutboxPayloads } from "@/lib/events/types";
import {
  getNurtureScript,
  type NurtureScriptChannel,
} from "@/lib/leads/nurture-scripts";
import {
  mergeLeadOpsMeta,
  readLeadOpsMeta,
  type LeadContactChannels,
} from "@/lib/leads/ops-meta";
import { fromPrismaLeadSegment } from "@/lib/rules/lead-segment";

type Tx = Prisma.TransactionClient;

export type NurtureTrigger = "on_create" | "status_contacted";

export type NurtureDispatchRecord = {
  scriptId: string;
  trigger: NurtureTrigger;
  enqueuedAt: string;
  channel: NurtureScriptChannel;
};

export function isAutoNurtureChannel(
  channel: NurtureScriptChannel | undefined,
): boolean {
  return channel !== undefined && channel !== "manual";
}

function readNurtureDispatchLog(meta: unknown): NurtureDispatchRecord[] {
  const m =
    meta && typeof meta === "object" && !Array.isArray(meta)
      ? (meta as Record<string, unknown>)
      : {};
  const raw = m.nurtureDispatch;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (row): row is NurtureDispatchRecord =>
      !!row &&
      typeof row === "object" &&
      typeof (row as NurtureDispatchRecord).scriptId === "string" &&
      typeof (row as NurtureDispatchRecord).trigger === "string" &&
      typeof (row as NurtureDispatchRecord).enqueuedAt === "string",
  );
}

export function hasNurtureBeenEnqueued(
  meta: unknown,
  scriptId: string,
  trigger: NurtureTrigger,
): boolean {
  return readNurtureDispatchLog(meta).some(
    (row) => row.scriptId === scriptId && row.trigger === trigger,
  );
}

export function appendNurtureDispatch(
  meta: unknown,
  record: NurtureDispatchRecord,
): Record<string, unknown> {
  const base =
    meta && typeof meta === "object" && !Array.isArray(meta)
      ? { ...(meta as Record<string, unknown>) }
      : {};
  const log = readNurtureDispatchLog(meta);
  base.nurtureDispatch = [...log, record];
  return base;
}

export function buildLeadNurturePayload(input: {
  leadId: string;
  nurtureScriptId: string;
  trigger: NurtureTrigger;
  segment: LeadSegment | null;
  source: string;
  contact: { name: string; phone: string; email?: string | null };
  channels: LeadContactChannels;
  opsNote: string | null;
}): OutboxPayloads["lead.nurture"] | null {
  const script = getNurtureScript(input.nurtureScriptId);
  if (!script || !isAutoNurtureChannel(script.channel)) return null;

  return {
    leadId: input.leadId,
    nurtureScriptId: script.id,
    scriptLabel: script.label,
    scriptDescription: script.description,
    channel: script.channel,
    trigger: input.trigger,
    segment: fromPrismaLeadSegment(input.segment),
    source: input.source,
    contact: {
      name: input.contact.name,
      phone: input.contact.phone,
      email: input.contact.email ?? null,
    },
    channels: input.channels,
    opsNote: input.opsNote,
  };
}

/**
 * Enqueue nurture outbox nếu script auto (oa/zalo/telegram) và chưa gửi trigger này.
 * Trả về opsMeta đã merge dispatch log — null nếu không enqueue.
 */
export async function tryEnqueueLeadNurture(
  tx: Tx,
  input: {
    leadId: string;
    opsMeta: unknown;
    nurtureScriptId: string | null;
    segment: LeadSegment | null;
    source: string;
    trigger: NurtureTrigger;
    contact: { name: string; phone: string; email?: string | null };
  },
): Promise<Record<string, unknown> | null> {
  const scriptId = input.nurtureScriptId?.trim();
  if (!scriptId) return null;
  if (hasNurtureBeenEnqueued(input.opsMeta, scriptId, input.trigger)) {
    return null;
  }

  const ops = readLeadOpsMeta(input.opsMeta);
  const payload = buildLeadNurturePayload({
    leadId: input.leadId,
    nurtureScriptId: scriptId,
    trigger: input.trigger,
    segment: input.segment,
    source: input.source,
    contact: input.contact,
    channels: ops.channels,
    opsNote: ops.opsNote,
  });
  if (!payload) return null;

  await enqueueEvent(
    tx,
    "lead.nurture",
    payload,
    `lead.nurture:${input.leadId}:${input.trigger}:${scriptId}`,
  );

  return appendNurtureDispatch(input.opsMeta, {
    scriptId,
    trigger: input.trigger,
    enqueuedAt: new Date().toISOString(),
    channel: payload.channel,
  });
}
