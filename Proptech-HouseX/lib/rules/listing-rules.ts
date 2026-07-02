import type {
  Broker,
  ListingStatus,
  ListingTier,
  PrismaClient,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

type UnitTypeReader = Pick<PrismaClient, "projectUnitType">;

export type RuleResult =
  | { ok: true }
  | { ok: false; code: string; message: string };

/**
 * Rule #2 — License gate.
 *
 * Broker có `brokerType = CTV` HOẶC muốn đăng `tier != FREE` bắt buộc phải có
 * `licenseVerified = true` mới được tạo Listing/Referral (Luật KDBĐS 2023).
 */
export function assertLicenseGate(
  broker: Pick<Broker, "brokerType" | "licenseVerified">,
  tier: ListingTier,
): RuleResult {
  const requiresLicense = broker.brokerType === "CTV" || tier !== "FREE";

  if (requiresLicense && !broker.licenseVerified) {
    return {
      ok: false,
      code: "LICENSE_REQUIRED",
      message:
        "Broker CTV hoặc đăng tin tier != FREE bắt buộc licenseVerified = true (chứng chỉ hành nghề môi giới).",
    };
  }
  return { ok: true };
}

/**
 * Rule #1 — Project/Unit consistency.
 *
 * `Listing.projectId` luôn nullable. Nếu có `unitTypeId` thì bắt buộc phải có
 * `projectId` và `unitType` đó phải thuộc đúng `projectId`. Prisma không tự
 * enforce được ràng buộc cross-field này nên kiểm tra ở tầng service.
 */
export async function assertProjectUnitConsistency(
  db: UnitTypeReader,
  params: { projectId?: string | null; unitTypeId?: string | null },
): Promise<RuleResult> {
  const { projectId, unitTypeId } = params;

  if (!unitTypeId) {
    return { ok: true };
  }

  if (!projectId) {
    return {
      ok: false,
      code: "UNIT_WITHOUT_PROJECT",
      message: "unitTypeId chỉ hợp lệ khi listing gắn với một projectId.",
    };
  }

  const unitType = await db.projectUnitType.findUnique({
    where: { id: unitTypeId },
    select: { projectId: true },
  });

  if (!unitType) {
    return {
      ok: false,
      code: "UNIT_NOT_FOUND",
      message: "unitTypeId không tồn tại.",
    };
  }

  if (unitType.projectId !== projectId) {
    return {
      ok: false,
      code: "UNIT_PROJECT_MISMATCH",
      message: "unitTypeId không thuộc projectId đã chọn.",
    };
  }

  return { ok: true };
}

/**
 * Rule #5 — Expire listings.
 *
 * Mọi Listing có `expireAt < now()` và `status = ACTIVE` → `status = EXPIRED`.
 * Gọi từ cron (vd mỗi giờ) qua route `/api/cron/expire-listings`.
 */
export async function expireListings(
  db: Pick<PrismaClient, "listing"> = prisma,
): Promise<{ expired: number; ids: string[] }> {
  const toExpire = await db.listing.findMany({
    where: { status: "ACTIVE", expireAt: { lt: new Date() } },
    select: { id: true },
  });
  const ids = toExpire.map((l) => l.id);
  if (ids.length > 0) {
    await db.listing.updateMany({
      where: { id: { in: ids } },
      data: { status: "EXPIRED" satisfies ListingStatus },
    });
  }
  return { expired: ids.length, ids };
}

/** Sinh mã listing public, dạng `MX-XXXXXXXX` (uniqueness vẫn do DB constraint bảo đảm). */
export function generateListingCode(): string {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `MX-${rand}`;
}
