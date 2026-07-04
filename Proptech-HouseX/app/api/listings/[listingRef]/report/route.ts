import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, created } from "@/lib/api/http";
import { submitListingReport } from "@/lib/data/listing-report";
import { listingReportSchema } from "@/lib/validation/listing-report";
import { isRateLimited } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";

const RATE_MAX = Number(process.env.LEAD_RATE_MAX ?? "20");
const RATE_WINDOW = Number(process.env.LEAD_RATE_WINDOW_SEC ?? "3600");

/** POST /api/listings/:listingRef/report — listingRef = mã tin (code) hoặc uuid. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ listingRef: string }> },
) {
  try {
    const { listingRef } = await params;
    const body = listingReportSchema.parse(await req.json());

    if (await isRateLimited(`listing_report:${ipHash(req)}`, RATE_MAX, RATE_WINDOW)) {
      return fail(429, "RATE_LIMITED", "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }

    const listing = await prisma.listing.findFirst({
      where: {
        deletedAt: null,
        OR: [{ code: listingRef }, { id: listingRef }],
        status: { in: ["ACTIVE", "PENDING_REVIEW", "EXPIRED"] },
      },
      select: {
        id: true,
        code: true,
        propertyType: true,
        transactionType: true,
        district: true,
        province: true,
      },
    });

    if (!listing) {
      return fail(404, "NOT_FOUND", "Không tìm thấy tin đăng.");
    }

    const result = await submitListingReport(
      listing.id,
      listing.code,
      {
        propertyType: listing.propertyType,
        transactionType: listing.transactionType,
        district: listing.district,
        province: listing.province,
      },
      body,
    );

    return created({
      received: true,
      leadId: result.leadId,
      message:
        "Đã ghi nhận báo cáo. House X sẽ xác nhận trong 24 giờ làm việc.",
    });
  } catch (err) {
    return handleApiError(err);
  }
}
