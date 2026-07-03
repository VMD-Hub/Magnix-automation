import type { AccountRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { normalizeEmail } from "@/lib/email/normalize";
import { sendVerificationEmail } from "@/lib/email/auth-mailer";
import type { AuthRegisterInput } from "@/lib/validation/auth";
import { enqueueEvent } from "@/lib/events/outbox";
import {
  buildAccountRegisteredPayload,
  forwardOutboxEventBestEffort,
} from "@/lib/events/supply-signup";

export type RegisterInput = AuthRegisterInput & { role: AccountRole };

export type RegisterResult = {
  userAccountId: string;
  role: AccountRole;
  name: string;
  phoneMasked: string;
  email: string;
  emailSent: boolean;
  brokerId?: string;
  customerId?: string;
};

import { maskPhone } from "@/lib/privacy/phone";

export async function registerUserAccount(
  input: RegisterInput,
): Promise<
  | { ok: true; data: RegisterResult }
  | { ok: false; code: string; message: string }
> {
  const normalizedPhone = normalizeVnPhone(input.phone);
  if (!isValidVnPhone(normalizedPhone)) {
    return { ok: false, code: "INVALID_PHONE", message: "Số điện thoại không hợp lệ." };
  }

  const email = normalizeEmail(input.email);
  const passwordHash = hashPassword(input.password);

  const phoneTaken = await prisma.userAccount.findUnique({
    where: { normalizedPhone },
    select: { id: true, role: true },
  });
  if (phoneTaken) {
    const label = phoneTaken.role === "BROKER" ? "môi giới" : "khách hàng";
    return {
      ok: false,
      code: "PHONE_REGISTERED",
      message: `Số điện thoại đã đăng ký tài khoản ${label}. Vui lòng đăng nhập.`,
    };
  }

  const emailTaken = await prisma.userAccount.findUnique({
    where: { email },
    select: { id: true },
  });
  if (emailTaken) {
    return {
      ok: false,
      code: "EMAIL_REGISTERED",
      message: "Email đã được sử dụng. Vui lòng dùng email khác hoặc đăng nhập.",
    };
  }

  const { result, eventPayload } = await prisma.$transaction(async (tx) => {
    const account = await tx.userAccount.create({
      data: {
        role: input.role,
        name: input.name,
        phone: input.phone.trim(),
        normalizedPhone,
        email,
        marketingOptIn: input.marketingOptIn ?? true,
        passwordHash,
      },
    });

    if (input.role === "CUSTOMER") {
      const existingCustomer = await tx.customer.findUnique({
        where: { normalizedPhone },
      });

      const customer = existingCustomer
        ? await tx.customer.update({
            where: { id: existingCustomer.id },
            data: {
              userAccountId: account.id,
              name: input.name,
              phone: input.phone.trim(),
              email,
            },
          })
        : await tx.customer.create({
            data: {
              userAccountId: account.id,
              name: input.name,
              phone: input.phone.trim(),
              normalizedPhone,
              email,
            },
          });

      const eventPayload = buildAccountRegisteredPayload({
        userAccountId: account.id,
        role: "CUSTOMER",
        name: account.name,
        phone: account.phone,
        email,
        marketingOptIn: account.marketingOptIn,
        customerId: customer.id,
        registeredAt: account.createdAt,
      });

      await enqueueEvent(
        tx,
        "account.registered",
        eventPayload,
        `account.registered:${account.id}`,
      );

      return {
        result: { account, customerId: customer.id, brokerId: undefined },
        eventPayload,
      };
    }

    const broker = await tx.broker.create({
      data: {
        userAccountId: account.id,
        fullName: input.name,
        phone: input.phone.trim(),
        brokerType: "FREE",
        licenseVerified: false,
      },
    });

    const eventPayload = buildAccountRegisteredPayload({
      userAccountId: account.id,
      role: "BROKER",
      name: account.name,
      phone: account.phone,
      email,
      marketingOptIn: account.marketingOptIn,
      brokerId: broker.id,
      registeredAt: account.createdAt,
    });

    await enqueueEvent(
      tx,
      "account.registered",
      eventPayload,
      `account.registered:${account.id}`,
    );

    return {
      result: { account, brokerId: broker.id, customerId: undefined },
      eventPayload,
    };
  });

  void forwardOutboxEventBestEffort("account.registered", eventPayload);

  let emailSent = false;
  try {
    const mail = await sendVerificationEmail(
      result.account.id,
      result.account.name,
      result.account.email,
    );
    emailSent = mail.sent;
  } catch {
    emailSent = false;
  }

  return {
    ok: true,
    data: {
      userAccountId: result.account.id,
      role: input.role,
      name: result.account.name,
      phoneMasked: maskPhone(result.account.phone),
      email,
      emailSent,
      brokerId: result.brokerId,
      customerId: result.customerId,
    },
  };
}
