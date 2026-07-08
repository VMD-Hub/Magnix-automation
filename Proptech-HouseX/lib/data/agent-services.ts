import type { AgentEntitlementStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Tx = Prisma.TransactionClient | typeof prisma;

/** Đảm bảo mọi service active đều có hàng entitlement (LOCKED mặc định) cho broker. */
export async function ensureBrokerEntitlements(brokerId: string, db: Tx = prisma) {
  const services = await db.agentService.findMany({
    where: { active: true },
    select: { id: true },
  });
  for (const s of services) {
    await db.agentEntitlement.upsert({
      where: {
        brokerId_serviceId: { brokerId, serviceId: s.id },
      },
      create: {
        brokerId,
        serviceId: s.id,
        status: "LOCKED",
        source: "locked",
      },
      update: {},
    });
  }
}

/** Kiểm tra broker đã ACTIVE một mã dịch vụ (vd. NOXH_CLAIM). */
export async function isServiceActive(
  brokerId: string,
  serviceCode: string,
): Promise<boolean> {
  await ensureBrokerEntitlements(brokerId);
  const row = await prisma.agentEntitlement.findFirst({
    where: {
      brokerId,
      status: "ACTIVE",
      service: { code: serviceCode, active: true },
    },
    select: { id: true },
  });
  return !!row;
}

export async function listAgentServicesForBroker(brokerId: string) {
  await ensureBrokerEntitlements(brokerId);

  const services = await prisma.agentService.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    include: {
      quiz: { select: { id: true, title: true, passScore: true, active: true } },
      entitlements: {
        where: { brokerId },
        take: 1,
      },
    },
  });

  return services.map((s) => {
    const ent = s.entitlements[0];
    const status: AgentEntitlementStatus = ent?.status ?? "LOCKED";
    return {
      id: s.id,
      code: s.code,
      category: s.category,
      name: s.name,
      description: s.description,
      isRequiredForCtv: s.isRequiredForCtv,
      requiresCode: s.requiresCode,
      status,
      unlocked: status === "ACTIVE",
      activatedAt: ent?.activatedAt?.toISOString() ?? null,
      trainingCompletedAt: ent?.trainingCompletedAt?.toISOString() ?? null,
      hasQuiz: !!s.quiz?.active,
      quizId: s.quiz?.id ?? null,
      quizTitle: s.quiz?.title ?? null,
      passScore: s.quiz?.passScore ?? null,
    };
  });
}

export async function getAgentServiceDetail(brokerId: string, code: string) {
  await ensureBrokerEntitlements(brokerId);
  const s = await prisma.agentService.findFirst({
    where: { code, active: true },
    include: {
      quiz: {
        include: {
          questions: { orderBy: { sortOrder: "asc" } },
        },
      },
      entitlements: { where: { brokerId }, take: 1 },
    },
  });
  if (!s) return null;

  const ent = s.entitlements[0];
  const unlocked = ent?.status === "ACTIVE";

  return {
    id: s.id,
    code: s.code,
    category: s.category,
    name: s.name,
    description: s.description,
    contentMarkdown: s.contentMarkdown,
    isRequiredForCtv: s.isRequiredForCtv,
    requiresCode: s.requiresCode,
    status: ent?.status ?? "LOCKED",
    unlocked,
    activatedAt: ent?.activatedAt?.toISOString() ?? null,
    quiz: s.quiz
      ? {
          id: s.quiz.id,
          title: s.quiz.title,
          passScore: s.quiz.passScore,
          // Không trả correctOption ra client
          questions: s.quiz.questions.map((q) => ({
            id: q.id,
            prompt: q.prompt,
            options: q.optionsJson as Array<{ id: string; label: string }>,
            sortOrder: q.sortOrder,
          })),
        }
      : null,
  };
}

export async function submitQuizAttempt(input: {
  brokerId: string;
  quizId: string;
  answers: Record<string, string>;
}) {
  const quiz = await prisma.agentQuiz.findFirst({
    where: { id: input.quizId, active: true },
    include: {
      questions: true,
      service: true,
    },
  });
  if (!quiz) throw new QuizSubmitError("QUIZ_NOT_FOUND", "Không tìm thấy bài thi.");

  if (quiz.service.requiresCode) {
    const prereq = await prisma.agentService.findUnique({
      where: { code: quiz.service.requiresCode },
      include: {
        entitlements: { where: { brokerId: input.brokerId }, take: 1 },
      },
    });
    if (prereq?.entitlements[0]?.status !== "ACTIVE") {
      throw new QuizSubmitError(
        "PREREQ_LOCKED",
        `Cần hoàn thành «${quiz.service.requiresCode}» trước.`,
      );
    }
  }

  const total = quiz.questions.length || 1;
  let correct = 0;
  for (const q of quiz.questions) {
    if (input.answers[q.id] === q.correctOption) correct += 1;
  }
  const score = Math.round((correct / total) * 100);
  const passed = score >= quiz.passScore;
  const now = new Date();

  const attempt = await prisma.$transaction(async (tx) => {
    const row = await tx.quizAttempt.create({
      data: {
        quizId: quiz.id,
        brokerId: input.brokerId,
        status: passed ? "PASSED" : "FAILED",
        score,
        answersJson: input.answers,
        completedAt: now,
      },
    });

    if (passed) {
      await ensureBrokerEntitlements(input.brokerId, tx);
      await tx.agentEntitlement.upsert({
        where: {
          brokerId_serviceId: {
            brokerId: input.brokerId,
            serviceId: quiz.serviceId,
          },
        },
        create: {
          brokerId: input.brokerId,
          serviceId: quiz.serviceId,
          status: "ACTIVE",
          source: "quiz_pass",
          activatedAt: now,
          trainingCompletedAt: now,
        },
        update: {
          status: "ACTIVE",
          source: "quiz_pass",
          activatedAt: now,
          trainingCompletedAt: now,
        },
      });

      // Auto-unlock product services that chỉ yêu cầu đúng service này
      const dependents = await tx.agentService.findMany({
        where: { requiresCode: quiz.service.code, active: true },
      });
      for (const dep of dependents) {
        await tx.agentEntitlement.upsert({
          where: {
            brokerId_serviceId: {
              brokerId: input.brokerId,
              serviceId: dep.id,
            },
          },
          create: {
            brokerId: input.brokerId,
            serviceId: dep.id,
            status: "ACTIVE",
            source: "quiz_pass",
            activatedAt: now,
          },
          update: {
            status: "ACTIVE",
            source: "quiz_pass",
            activatedAt: now,
          },
        });
      }
    }

    return row;
  });

  return {
    attemptId: attempt.id,
    score,
    passScore: quiz.passScore,
    passed,
    unlockedServiceCodes: passed
      ? [quiz.service.code, ...(await dependentCodes(quiz.service.code))]
      : [],
  };
}

async function dependentCodes(code: string) {
  const deps = await prisma.agentService.findMany({
    where: { requiresCode: code, active: true },
    select: { code: true },
  });
  return deps.map((d) => d.code);
}

export class QuizSubmitError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "QuizSubmitError";
  }
}

export function isQuizSubmitError(err: unknown): err is QuizSubmitError {
  return err instanceof QuizSubmitError;
}
