/**
 * Broker-lane telesales access (CTV own + Nội sàn INTERNAL).
 * Separate from Ops TELESALES_CRM pool — never grants platform pool (assignedBrokerId null).
 */
import type { BrokerType } from "@prisma/client";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";

export const BROKER_TELESALES_TYPES = ["INTERNAL", "CTV"] as const;
export type BrokerTelesalesType = (typeof BROKER_TELESALES_TYPES)[number];

export type BrokerTelesalesAccess = {
  brokerId: string;
  brokerType: BrokerTelesalesType;
  actorId: string;
};

export class BrokerTelesalesAccessError extends Error {
  constructor(
    public readonly code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "SCOPE_DENIED",
    message: string,
  ) {
    super(message);
    this.name = "BrokerTelesalesAccessError";
  }
}

function isTelesalesBrokerType(
  t: BrokerType | string | null | undefined,
): t is BrokerTelesalesType {
  return t === "INTERNAL" || t === "CTV";
}

export async function requireBrokerTelesalesAccess(
  req: NextRequest,
): Promise<BrokerTelesalesAccess> {
  const session = await requireBrokerSessionFromRequest(req);
  if (!session.ok) {
    throw new BrokerTelesalesAccessError(
      session.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN",
      session.message,
    );
  }

  const broker = await prisma.broker.findUnique({
    where: { id: session.brokerId },
    select: { id: true, brokerType: true },
  });
  if (!broker || !isTelesalesBrokerType(broker.brokerType)) {
    throw new BrokerTelesalesAccessError(
      "FORBIDDEN",
      "Chỉ môi giới nội sàn (INTERNAL) hoặc CTV được dùng lane telesales này.",
    );
  }

  return {
    brokerId: broker.id,
    brokerType: broker.brokerType,
    actorId: session.profile.id,
  };
}

export type LeadScopeRow = {
  id: string;
  assignedBrokerId: string | null;
  noxhCases?: Array<{ brokerId: string | null }>;
};

/**
 * INTERNAL/CTV: only own assigned leads.
 * CTV also: lead linked to active NoxhCase with brokerId = self.
 * Always reject platform pool (assignedBrokerId null without own case).
 */
export function assertLeadReadableByBroker(
  lead: LeadScopeRow,
  access: Pick<BrokerTelesalesAccess, "brokerId" | "brokerType">,
): void {
  if (lead.assignedBrokerId === access.brokerId) return;

  if (access.brokerType === "CTV") {
    const ownsCase = (lead.noxhCases ?? []).some(
      (c) => c.brokerId === access.brokerId,
    );
    if (ownsCase) return;
  }

  if (lead.assignedBrokerId == null) {
    throw new BrokerTelesalesAccessError(
      "SCOPE_DENIED",
      "Không được truy cập pool Ops (lead chưa gán môi giới).",
    );
  }

  throw new BrokerTelesalesAccessError(
    "SCOPE_DENIED",
    "Lead không thuộc phạm vi telesales của bạn.",
  );
}

export async function loadLeadForBrokerScope(leadId: string) {
  return prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      assignedBrokerId: true,
      noxhCases: {
        where: { caseStatus: "ACTIVE" },
        select: { brokerId: true },
        take: 5,
      },
    },
  });
}
