/** Phase 2 telesales — server-side OA / SMS providers. */

export type TelesalesServerChannel = "oa" | "sms";

export type MessagingSendResult =
  | { ok: true }
  | { ok: false; error: string; skip?: boolean };

export type ChannelDispatchOutcome = {
  channel: TelesalesServerChannel;
  status: "SENT" | "FAILED" | "SKIPPED";
  reason: string | null;
  enrollmentId: string | null;
  dispatchId: string | null;
  created: boolean;
};
