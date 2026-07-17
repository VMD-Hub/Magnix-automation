import { prisma } from "@/lib/prisma";
import { normalizeVnPhone } from "@/lib/phone";
import { enqueueEvent } from "@/lib/events/outbox";
import { forwardEventToWebhook } from "@/lib/events/handlers";
import type { OutboxPayloads } from "@/lib/events/types";
import {
  listingReportAckEmail,
  listingReportEditorialEmail,
} from "@/lib/email/listing-report-template";
import { sendEmail } from "@/lib/email/send";
import type { ListingReportReasonCode } from "@/lib/email/listing-report-reasons";
import type { ListingReportInput } from "@/lib/validation/listing-report";
import { propertyTypeLabel, TRANSACTION_TYPE_LABEL } from "@/lib/format";

export async function submitListingReport(
  listingId: string,
  listingCode: string,
  listingMeta: {
    propertyType: string;
    transactionType: string;
    district: string;
    province: string;
  },
  body: ListingReportInput,
): Promise<{ leadId: string }> {
  const normalizedPhone = normalizeVnPhone(body.phone);
  const reasonLabel = body.reasonCode;
  const structuredMessage = [
    `[Báo cáo tin: ${listingCode}]`,
    `[Lý do: ${reasonLabel}]`,
    body.message.trim(),
  ].join("\n");

  const { lead, eventPayload } = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { normalizedPhone },
      update: {
        name: body.name,
        email: body.email || undefined,
      },
      create: {
        name: body.name,
        phone: body.phone,
        normalizedPhone,
        email: body.email || undefined,
      },
    });

    const created = await tx.lead.create({
      data: {
        customerId: customer.id,
        listingId,
        source: `listing_report:${body.reasonCode}`,
        message: structuredMessage,
      },
    });

    const eventPayload: OutboxPayloads["ops.request_created"] = {
      requestId: created.id,
      kind: "listing_report",
      title: `Báo cáo tin ${listingCode} · ${reasonLabel}`,
      detail: body.message.trim(),
      priority: "high",
      source: `listing_report:${body.reasonCode}`,
      contact: {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
      },
      adminUrl: `https://timnhaxahoi.com/admin/listings/${listingId}`,
      createdAt: created.createdAt.toISOString(),
    };

    await enqueueEvent(
      tx,
      "ops.request_created",
      eventPayload,
      `ops.request_created:listing_report:${created.id}`,
    );

    return { lead: created, eventPayload };
  });

  void forwardEventToWebhook("ops.request_created", eventPayload).catch((error) => {
    console.error("[listing-report] realtime forward failed", {
      leadId: lead.id,
      message: error instanceof Error ? error.message : String(error),
    });
  });

  const listingTitle = `${TRANSACTION_TYPE_LABEL[listingMeta.transactionType] ?? listingMeta.transactionType} · ${
    propertyTypeLabel(listingMeta.propertyType) ?? listingMeta.propertyType
  } · ${listingMeta.district}`;

  const mailInput = {
    listingCode,
    listingTitle,
    reasonCode: body.reasonCode as ListingReportReasonCode,
    message: body.message,
    reporterName: body.name,
    reporterPhone: body.phone,
    reporterEmail: body.email || undefined,
    leadId: lead.id,
  };

  try {
    await sendEmail(listingReportEditorialEmail(mailInput));
    if (body.email?.trim()) {
      await sendEmail(
        listingReportAckEmail({
          to: body.email.trim(),
          listingCode,
          reporterName: body.name,
        }),
      );
    }
  } catch (err) {
    console.error("[listing-report] email failed", listingCode, err);
  }

  return { leadId: lead.id };
}
