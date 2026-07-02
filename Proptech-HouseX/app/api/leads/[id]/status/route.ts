import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { leadStatusPatchSchema } from "@/lib/validation/lead";
import { createCommissionOnWon } from "@/lib/rules/commission-trigger";
import { enqueueEvent } from "@/lib/events/outbox";
import { recordStatusChange } from "@/lib/data/status-history";

// PATCH /api/leads/:id/status — đổi trạng thái lead. Rule #4: khi chuyển sang
// WON (từ trạng thái khác) thì tạo Commission (1-1 với lead).
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { status, commission } = leadStatusPatchSchema.parse(
      await req.json(),
    );

    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id },
        include: {
          referral: { select: { brokerId: true } },
          listing: { select: { price: true } },
          commission: { select: { id: true } },
        },
      });

      if (!lead) {
        return { type: "not_found" as const };
      }

      const movingToWon = status === "WON" && lead.status !== "WON";

      let commissionResult = null;
      if (movingToWon) {
        commissionResult = await createCommissionOnWon(tx, lead, commission);
        // Không có broker / không tính được số tiền → chặn chuyển WON.
        if (
          !commissionResult.created &&
          commissionResult.reason !== "ALREADY_EXISTS"
        ) {
          return {
            type: "commission_blocked" as const,
            reason: commissionResult.reason,
          };
        }
      }

      const updated = await tx.lead.update({
        where: { id },
        data: { status },
      });

      // P3 — audit chuyển trạng thái lead.
      await recordStatusChange(tx, {
        entity: "lead",
        entityId: updated.id,
        fromStatus: lead.status,
        toStatus: status,
        actor: lead.referral?.brokerId ?? lead.assignedBrokerId ?? null,
      });

      // P2 — outbox: ghi sự kiện CÙNG transaction để side-effect (notify) chạy
      // bất đồng bộ qua dispatcher, không chặn request.
      if (movingToWon) {
        await enqueueEvent(
          tx,
          "lead.won",
          { leadId: updated.id, status: updated.status },
          `lead.won:${updated.id}`,
        );
        if (commissionResult?.created) {
          await enqueueEvent(
            tx,
            "commission.created",
            {
              commissionId: commissionResult.commissionId,
              leadId: updated.id,
              brokerId: commissionResult.brokerId,
              amount: String(commissionResult.amount),
              rate: commissionResult.rate,
            },
            `commission.created:${commissionResult.commissionId}`,
          );
        }
      }

      return { type: "ok" as const, lead: updated, commissionResult };
    });

    if (result.type === "not_found") {
      return fail(404, "NOT_FOUND", "Không tìm thấy lead.");
    }
    if (result.type === "commission_blocked") {
      const messages: Record<string, string> = {
        NO_BROKER_ATTRIBUTION:
          "Không thể chuyển WON: lead chưa gắn broker (referral/assignedBroker) và payload không có brokerId.",
        NO_AMOUNT_OR_DEAL_VALUE:
          "Không thể chuyển WON: thiếu commission.amount hoặc dealValue (và listing không có giá để suy ra).",
      };
      return fail(
        422,
        result.reason,
        messages[result.reason] ?? "Không thể tạo hoa hồng.",
      );
    }

    return ok({
      lead: result.lead,
      commission: result.commissionResult,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
