import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError } from "@/lib/api/http";
import { noxhLeadSchema } from "@/lib/validation/noxh-lead";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { isRateLimited } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";
import { enqueueEvent } from "@/lib/events/outbox";
import { evaluateNoxhEligibility } from "@/lib/finance/noxh-eligibility";
import { assessCreditReadiness } from "@/lib/finance/credit-readiness";
import {
  classifyLead,
  toLeadSummary,
  noxhLeadMessage,
} from "@/lib/finance/noxh-lead";
import { buildInitialLeadOpsMeta } from "@/lib/leads/ops-meta";
import { buildNoxhWizardSnapshot } from "@/lib/leads/noxh-wizard-snapshot";
import {
  ensurePlatformNoxhCaseFromWizardHot,
  shouldAutoCreatePlatformCaseForWizardTier,
} from "@/lib/noxh-case/wizard-hot-case";

const RATE_MAX = Number(process.env.LEAD_RATE_MAX ?? "20");
const RATE_WINDOW = Number(process.env.LEAD_RATE_WINDOW_SEC ?? "3600");

/**
 * Forward chi tiết tài chính sang n8n để lưu Google Sheet — best-effort.
 * Snapshot đầy đủ cho Admin lưu trong Lead.opsMeta.wizardSnapshot (chỉ /admin).
 */
async function forwardNoxhDetail(payload: unknown): Promise<void> {
  const url = process.env.NOXH_DETAIL_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.EVENTS_WEBHOOK_SECRET
          ? { "x-events-secret": process.env.EVENTS_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({
        type: "lead.noxh_checked.detail",
        payload,
        sentAt: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error(
      "[noxh] detail forward failed:",
      err instanceof Error ? err.message : err,
    );
  }
}

/**
 * POST /api/tools/noxh-eligibility — nhận lead từ công cụ kiểm tra điều kiện NOXH.
 * Server TÍNH LẠI điều kiện (anti-tamper), tạo Lead (source=tool:noxh-check),
 * enqueue outbox định tuyến theo tier, forward chi tiết tài chính tới n8n,
 * và tier HOT tự tạo NoxhCase platform (DNA-B — xem NOXH_CASE_PIPELINE.md).
 */
export async function POST(req: NextRequest) {
  try {
    const body = noxhLeadSchema.parse(await req.json());
    const normalizedPhone = normalizeVnPhone(body.phone);
    if (!isValidVnPhone(normalizedPhone)) {
      return fail(422, "INVALID_PHONE", "Số điện thoại không hợp lệ.");
    }

    if (await isRateLimited(`noxh:${ipHash(req)}`, RATE_MAX, RATE_WINDOW)) {
      return fail(429, "RATE_LIMITED", "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }

    const i = body.input;

    // Tính lại phía server — không tin summary từ client.
    const evaluation = evaluateNoxhEligibility({
      objectGroup: i.objectGroup,
      ownsHomeInProvince: i.ownsHomeInProvince,
      areaPerPersonSqm: i.ownsHomeInProvince ? i.areaPerPersonSqm : undefined,
      everBenefitedHousingPolicy: i.everBenefitedHousingPolicy,
      maritalStatus: i.maritalStatus,
      applicantMonthlyIncome: i.applicantMonthlyIncome,
      spouseMonthlyIncome: i.spouseMonthlyIncome,
    });

    const householdIncome =
      i.maritalStatus === "MARRIED"
        ? i.applicantMonthlyIncome + (i.spouseMonthlyIncome ?? 0)
        : i.applicantMonthlyIncome;

    const credit = assessCreditReadiness({
      intendToBorrow: i.intendToBorrow,
      householdMonthlyIncome: householdIncome,
      existingMonthlyDebtPayment: i.existingMonthlyDebtPayment,
      creditCardLimitTotal: i.creditCardLimitTotal,
      badDebtSelfOrSpouse: i.badDebtSelfOrSpouse,
    });

    const classification = classifyLead(evaluation, credit, {
      timeframe: i.timeframe,
      hasContact: true,
    });

    const summary = toLeadSummary(evaluation, credit, classification);

    const wizardSnapshot = buildNoxhWizardSnapshot({
      wizardInput: i,
      evaluation,
      credit,
      classification,
      householdMonthlyIncome: householdIncome,
    });

    const lead = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { normalizedPhone },
        update: { name: body.name, email: body.email || undefined },
        create: {
          name: body.name,
          phone: body.phone,
          normalizedPhone,
          email: body.email || undefined,
        },
      });

      const createdLead = await tx.lead.create({
        data: {
          customerId: customer.id,
          source: "tool:noxh-check",
          segment: "NOXH",
          message: noxhLeadMessage(summary),
          opsMeta: buildInitialLeadOpsMeta({
            phone: body.phone,
            email: body.email,
            segment: "NOXH",
            source: "tool:noxh-check",
            wizardSnapshot,
          }),
        },
      });

      // Outbox (tin cậy, Postgres) — chỉ tier + contact + tín hiệu route, KHÔNG PII tài chính.
      await enqueueEvent(
        tx,
        "lead.noxh_checked",
        {
          leadId: createdLead.id,
          tier: classification.tier,
          overall: evaluation.overall,
          creditFlag: credit.flag,
          reasonCodes: classification.reasonCodes,
          recommendedAction: classification.recommendedAction,
          rulesVersion: evaluation.rulesVersion,
          contact: {
            name: body.name,
            phone: body.phone,
            email: body.email,
          },
        },
        `lead.noxh_checked:${createdLead.id}`,
      );

      return createdLead;
    });

    let noxhCaseCode: string | undefined;
    if (shouldAutoCreatePlatformCaseForWizardTier(classification.tier)) {
      try {
        const caseResult = await ensurePlatformNoxhCaseFromWizardHot({
          leadId: lead.id,
          customerName: body.name,
          phone: body.phone,
          objectGroup: i.objectGroup,
          intendToBorrow: i.intendToBorrow,
          reasonCodes: classification.reasonCodes,
          recommendedAction: classification.recommendedAction,
          rulesVersion: classification.rulesVersion,
        });
        noxhCaseCode = caseResult.case.code;
      } catch (err) {
        console.error(
          "[noxh] wizard HOT auto-case failed:",
          err instanceof Error ? err.message : err,
        );
      }
    }

    // Chi tiết tài chính → n8n/Google Sheet (best-effort, không lưu Postgres).
    await forwardNoxhDetail({
      leadId: lead.id,
      tier: classification.tier,
      contact: { name: body.name, phone: body.phone, email: body.email },
      situation: {
        objectGroup: i.objectGroup,
        maritalStatus: i.maritalStatus,
        applicantMonthlyIncome: i.applicantMonthlyIncome,
        spouseMonthlyIncome: i.spouseMonthlyIncome ?? 0,
        ownsHomeInProvince: i.ownsHomeInProvince,
        areaPerPersonSqm: i.areaPerPersonSqm ?? null,
        intendToBorrow: i.intendToBorrow,
        existingMonthlyDebtPayment: i.existingMonthlyDebtPayment ?? 0,
        creditCardLimitTotal: i.creditCardLimitTotal ?? 0,
        badDebtSelfOrSpouse: i.badDebtSelfOrSpouse,
        timeframe: i.timeframe,
        dti: credit.dti,
      },
      evaluationReasons: evaluation.reasons,
      nextSteps: evaluation.nextSteps,
      creditReasons: credit.reasons,
      rulesVersion: evaluation.rulesVersion,
    });

    return created({
      id: lead.id,
      tier: classification.tier,
      ...(noxhCaseCode ? { noxhCaseCode } : {}),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
