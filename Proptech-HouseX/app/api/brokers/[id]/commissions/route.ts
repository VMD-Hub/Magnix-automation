import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { getBrokerCommissions } from "@/lib/data/commission";

// GET /api/brokers/:id/commissions — dashboard hoa hồng cho broker.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const summary = await getBrokerCommissions(id);

    if (!summary.broker) {
      return fail(404, "BROKER_NOT_FOUND", "Không tìm thấy broker.");
    }

    return ok(summary);
  } catch (err) {
    return handleApiError(err);
  }
}
