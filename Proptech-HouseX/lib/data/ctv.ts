import { prisma } from "@/lib/prisma";
import type { CtvApplicationStatus } from "@prisma/client";

/** Sinh mã CTV công khai: HX-CTV-000001 */
export async function generateCtvCode(): Promise<string> {
  const existing = await prisma.broker.count({
    where: { ctvCode: { not: null } },
  });
  return `HX-CTV-${String(existing + 1).padStart(6, "0")}`;
}

export async function approveCtvApplication(
  applicationId: string,
): Promise<{ ctvCode: string; brokerId: string }> {
  const app = await prisma.ctvApplication.findUnique({
    where: { id: applicationId },
    include: { broker: true },
  });
  if (!app || app.status !== "PENDING") {
    throw new Error("APPLICATION_NOT_PENDING");
  }

  const ctvCode = await generateCtvCode();

  await prisma.$transaction([
    prisma.ctvApplication.update({
      where: { id: applicationId },
      data: { status: "APPROVED", reviewedAt: new Date() },
    }),
    prisma.broker.update({
      where: { id: app.brokerId },
      data: { brokerType: "CTV", ctvCode },
    }),
  ]);

  // Bootstrap catalog entitlement (LOCKED + default PRODUCT ACTIVE).
  // NOXH_CLAIM vẫn khóa đến khi đậu CTV_ONBOARDING trên Mini App / Agent.
  const { ensureBrokerEntitlements } = await import("@/lib/data/agent-services");
  await ensureBrokerEntitlements(app.brokerId);

  return { ctvCode, brokerId: app.brokerId };
}

export async function rejectCtvApplication(
  applicationId: string,
  rejectReason: string,
): Promise<void> {
  const app = await prisma.ctvApplication.findUnique({
    where: { id: applicationId },
  });
  if (!app || app.status !== "PENDING") {
    throw new Error("APPLICATION_NOT_PENDING");
  }

  await prisma.ctvApplication.update({
    where: { id: applicationId },
    data: {
      status: "REJECTED",
      rejectReason,
      reviewedAt: new Date(),
    },
  });
}

export type CtvApplicationView = {
  id: string;
  status: CtvApplicationStatus;
  idNumber: string | null;
  experience: string | null;
  region: string | null;
  motivation: string | null;
  rejectReason: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  broker: { id: string; fullName: string; ctvCode: string | null; brokerType: string };
};

export type AdminCtvApplicationRow = {
  id: string;
  status: CtvApplicationStatus;
  idNumber: string | null;
  experience: string | null;
  region: string | null;
  motivation: string | null;
  rejectReason: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  broker: {
    id: string;
    fullName: string;
    phone: string;
    licenseNo: string | null;
    licenseVerified: boolean;
    brokerType: string;
    ctvCode: string | null;
    userAccount: {
      email: string;
      emailVerified: boolean;
    };
  };
};

/** Danh sách đơn CTV cho admin — không log PII ra ngoài response. */
export async function listCtvApplicationsForAdmin(
  status?: CtvApplicationStatus | "ALL",
): Promise<AdminCtvApplicationRow[]> {
  return prisma.ctvApplication.findMany({
    where:
      status && status !== "ALL" ? { status } : undefined,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      status: true,
      idNumber: true,
      experience: true,
      region: true,
      motivation: true,
      rejectReason: true,
      reviewedAt: true,
      createdAt: true,
      broker: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          licenseNo: true,
          licenseVerified: true,
          brokerType: true,
          ctvCode: true,
          userAccount: {
            select: { email: true, emailVerified: true },
          },
        },
      },
    },
  });
}
