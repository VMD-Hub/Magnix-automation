import { randomUUID } from "node:crypto";
import { kv } from "@/lib/redis";
import { PROMOTION_GUEST_LIMITS } from "@/lib/promotion/constants";

export type PendingClaimPayload = {
  campaignSlug: string;
  prizeId: string;
  segmentIndex: number;
  won: boolean;
  ipHash: string;
  createdAt: string;
};

function claimKey(token: string) {
  return `promo:claim:${token}`;
}

export async function storePendingClaim(
  payload: PendingClaimPayload,
): Promise<string> {
  const token = randomUUID();
  await kv.set(claimKey(token), JSON.stringify(payload), PROMOTION_GUEST_LIMITS.claimTtlSec);
  return token;
}

export async function readPendingClaim(
  token: string,
): Promise<PendingClaimPayload | null> {
  const raw = await kv.get(claimKey(token));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingClaimPayload;
  } catch {
    return null;
  }
}

/** Lấy và xóa token — một lần dùng. */
export async function consumePendingClaim(
  token: string,
): Promise<PendingClaimPayload | null> {
  const payload = await readPendingClaim(token);
  if (!payload) return null;
  await kv.set(claimKey(token), "", 1);
  return payload;
}
