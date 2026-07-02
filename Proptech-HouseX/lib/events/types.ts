/** P2 — Event-driven outbox: catalog sự kiện + payload typed. */

export interface OutboxPayloads {
  "lead.won": {
    leadId: string;
    status: string;
  };
  "commission.created": {
    commissionId: string;
    leadId: string;
    brokerId: string;
    amount: string; // chuỗi để không mất chính xác Decimal
    rate: number | null;
  };
}

export type OutboxEventType = keyof OutboxPayloads;
