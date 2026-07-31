import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  consumeEmailOtp,
  EmailOtpError,
  issueEmailOtp,
} from "@/lib/auth/email-otp";
import { sendPartnerContractOtpEmail } from "@/lib/email/auth-mailer";
import {
  buildPartnerContractSnapshotHtml,
  PARTNER_CONTRACT_TERMS_TEXT,
  PARTNER_CONTRACT_TITLE,
  PARTNER_CONTRACT_VERSION,
} from "@/lib/content/partner-contract";

export class PartnerContractError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "PartnerContractError";
  }
}

/** Gate khai báo deal — mặc định bật; tắt soft-launch: AFFILIATE_CONTRACT_GATE_ENABLED=false */
export function isPartnerContractGateEnabled(): boolean {
  const raw = process.env.AFFILIATE_CONTRACT_GATE_ENABLED?.trim().toLowerCase();
  if (raw === "false" || raw === "0" || raw === "off") return false;
  return true;
}

export function computePartnerContractSigHash(input: {
  version: string;
  brokerId: string;
  signedAtIso: string;
  otpProof: string;
  signatureDataUrl?: string | null;
}): string {
  const payload = [
    input.version,
    input.brokerId,
    input.signedAtIso,
    input.otpProof,
    input.signatureDataUrl?.slice(0, 64) ?? "",
  ].join("|");
  return createHash("sha256").update(payload).digest("hex");
}

export async function getPartnerContractState(brokerId: string) {
  const broker = await prisma.broker.findUnique({
    where: { id: brokerId },
    select: {
      id: true,
      fullName: true,
      partnerContractStatus: true,
      partnerContractSignedAt: true,
      partnerContractVersion: true,
      partnerContractSnapshot: true,
    },
  });
  if (!broker) {
    throw new PartnerContractError("NOT_FOUND", "Không tìm thấy hồ sơ môi giới.");
  }

  return {
    status: broker.partnerContractStatus,
    signedAt: broker.partnerContractSignedAt?.toISOString() ?? null,
    version: broker.partnerContractVersion ?? PARTNER_CONTRACT_VERSION,
    currentVersion: PARTNER_CONTRACT_VERSION,
    title: PARTNER_CONTRACT_TITLE,
    termsText: PARTNER_CONTRACT_TERMS_TEXT,
    hasSnapshot: Boolean(broker.partnerContractSnapshot),
    gateEnabled: isPartnerContractGateEnabled(),
    signed: broker.partnerContractStatus === "SIGNED",
  };
}

export async function requestPartnerContractOtp(brokerId: string) {
  const broker = await prisma.broker.findUnique({
    where: { id: brokerId },
    include: {
      userAccount: { select: { id: true, email: true, name: true } },
    },
  });
  if (!broker) {
    throw new PartnerContractError("NOT_FOUND", "Không tìm thấy hồ sơ môi giới.");
  }
  if (broker.partnerContractStatus === "SIGNED") {
    throw new PartnerContractError(
      "ALREADY_SIGNED",
      "E-contract đã ký — không cần OTP mới.",
    );
  }

  const email = broker.userAccount.email?.trim();
  if (!email) {
    throw new PartnerContractError(
      "EMAIL_REQUIRED",
      "Tài khoản cần có email để nhận OTP ký e-contract.",
    );
  }

  const { code, expiresAt } = await issueEmailOtp({
    email,
    purpose: "PARTNER_CONTRACT",
    userAccountId: broker.userAccount.id,
  });

  await sendPartnerContractOtpEmail(
    broker.userAccount.name || broker.fullName,
    email,
    code,
  );

  await prisma.broker.update({
    where: { id: brokerId },
    data: {
      partnerContractStatus: "PENDING",
      partnerContractVersion: PARTNER_CONTRACT_VERSION,
    },
  });

  return {
    expiresAt: expiresAt.toISOString(),
    emailMasked: maskEmail(email),
    status: "PENDING" as const,
  };
}

export async function signPartnerContract(input: {
  brokerId: string;
  otp: string;
  accepted: boolean;
  signatureDataUrl?: string | null;
}) {
  if (!input.accepted) {
    throw new PartnerContractError(
      "ACCEPT_REQUIRED",
      "Cần đồng ý điều khoản trước khi ký.",
    );
  }
  const otp = input.otp.trim();
  if (!/^\d{6}$/.test(otp)) {
    throw new PartnerContractError("OTP_INVALID", "Mã OTP phải gồm 6 số.");
  }

  const sig = input.signatureDataUrl?.trim() || null;
  if (sig && (!sig.startsWith("data:image/") || sig.length > 400_000)) {
    throw new PartnerContractError(
      "SIGNATURE_INVALID",
      "Chữ ký canvas không hợp lệ hoặc quá lớn.",
    );
  }

  const broker = await prisma.broker.findUnique({
    where: { id: input.brokerId },
    include: {
      userAccount: { select: { id: true, email: true, name: true } },
    },
  });
  if (!broker) {
    throw new PartnerContractError("NOT_FOUND", "Không tìm thấy hồ sơ môi giới.");
  }
  if (broker.partnerContractStatus === "SIGNED") {
    return {
      status: "SIGNED" as const,
      alreadySigned: true as const,
      signedAt: broker.partnerContractSignedAt?.toISOString() ?? null,
      version: broker.partnerContractVersion,
    };
  }

  const email = broker.userAccount.email?.trim();
  if (!email) {
    throw new PartnerContractError(
      "EMAIL_REQUIRED",
      "Tài khoản cần có email để ký e-contract.",
    );
  }

  let challengeId: string;
  try {
    const consumed = await consumeEmailOtp({
      email,
      purpose: "PARTNER_CONTRACT",
      code: otp,
      userAccountId: broker.userAccount.id,
    });
    challengeId = consumed.challengeId;
  } catch (err) {
    if (err instanceof EmailOtpError) {
      throw new PartnerContractError(err.code, err.message);
    }
    throw err;
  }

  const signedAt = new Date();
  const signedAtIso = signedAt.toISOString();
  const otpProof = createHash("sha256")
    .update(`pc-otp:${challengeId}:${otp}`)
    .digest("hex");
  const sigHash = computePartnerContractSigHash({
    version: PARTNER_CONTRACT_VERSION,
    brokerId: input.brokerId,
    signedAtIso,
    otpProof,
    signatureDataUrl: sig,
  });
  const snapshot = buildPartnerContractSnapshotHtml({
    brokerName: broker.userAccount.name || broker.fullName,
    brokerId: input.brokerId,
    signedAtIso,
    hasCanvasSignature: Boolean(sig),
  });

  const updated = await prisma.broker.update({
    where: { id: input.brokerId },
    data: {
      partnerContractStatus: "SIGNED",
      partnerContractSignedAt: signedAt,
      partnerContractVersion: PARTNER_CONTRACT_VERSION,
      partnerContractSnapshot: snapshot,
      partnerContractSigHash: sigHash,
      partnerContractOtpProof: otpProof,
    },
  });

  return {
    status: "SIGNED" as const,
    alreadySigned: false as const,
    signedAt: updated.partnerContractSignedAt?.toISOString() ?? null,
    version: updated.partnerContractVersion,
  };
}

export async function assertPartnerContractSigned(brokerId: string) {
  if (!isPartnerContractGateEnabled()) return;
  const row = await prisma.broker.findUnique({
    where: { id: brokerId },
    select: { partnerContractStatus: true },
  });
  if (!row || row.partnerContractStatus !== "SIGNED") {
    throw new PartnerContractError(
      "CONTRACT_REQUIRED",
      "Cần ký e-contract khung hợp tác trước khi khai báo deal.",
    );
  }
}

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "***";
  const head = user.slice(0, Math.min(2, user.length));
  return `${head}***@${domain}`;
}
