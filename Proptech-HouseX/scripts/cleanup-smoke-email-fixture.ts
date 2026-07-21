import { prisma } from "../lib/prisma";

/**
 * ConsentRecord uses onDelete: Restrict (ADR-015 ledger) — must delete before lead/customer.
 * NurtureEnrollment/Dispatch cascade from Lead.
 */
export async function cleanupSmokeEmailFixture(input: {
  leadId: string;
  customerId: string;
}): Promise<void> {
  await prisma.emailEngagementEvent.deleteMany({
    where: { leadId: input.leadId },
  });
  await prisma.consentRecord.deleteMany({
    where: {
      OR: [{ leadId: input.leadId }, { customerId: input.customerId }],
    },
  });
  await prisma.lead.delete({ where: { id: input.leadId } });
  await prisma.customer.delete({ where: { id: input.customerId } });
}
