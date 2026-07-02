import { fail, handleApiError, ok, created } from "@/lib/api/http";
import { getSessionUser } from "@/lib/auth/session";
import { brokerIdForSession } from "@/lib/auth/session-profile";
import { prisma } from "@/lib/prisma";
import { ctvApplicationSchema } from "@/lib/validation/auth";

/** Trạng thái đơn đăng ký CTV của môi giới đang đăng nhập. */
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return fail(401, "AUTH_REQUIRED", "Vui lòng đăng nhập tài khoản môi giới.");
    }

    const brokerId = await brokerIdForSession(session);
    if (!brokerId) {
      return fail(403, "NOT_BROKER", "Chỉ tài khoản môi giới mới đăng ký CTV.");
    }

    const broker = await prisma.broker.findUnique({
      where: { id: brokerId },
      select: {
        id: true,
        fullName: true,
        brokerType: true,
        ctvCode: true,
        ctvApplication: true,
      },
    });

    return ok({ broker });
  } catch (err) {
    return handleApiError(err);
  }
}

/** Nộp đơn đăng ký CTV — yêu cầu đã có tài khoản môi giới đăng tin. */
export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return fail(401, "AUTH_REQUIRED", "Vui lòng đăng nhập tài khoản môi giới.");
    }

    const brokerId = await brokerIdForSession(session);
    if (!brokerId) {
      return fail(403, "NOT_BROKER", "Chỉ tài khoản môi giới mới đăng ký CTV.");
    }

    const broker = await prisma.broker.findUnique({
      where: { id: brokerId },
      include: { ctvApplication: true },
    });

    if (!broker) {
      return fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ môi giới.");
    }

    if (broker.brokerType === "CTV" && broker.ctvCode) {
      return fail(409, "ALREADY_CTV", `Bạn đã là CTV (${broker.ctvCode}).`);
    }

    if (broker.ctvApplication?.status === "PENDING") {
      return fail(409, "APPLICATION_PENDING", "Đơn đăng ký đang chờ duyệt.");
    }

    const body = ctvApplicationSchema.parse(await req.json());

    const app = await prisma.ctvApplication.upsert({
      where: { brokerId },
      create: {
        brokerId,
        idNumber: body.idNumber,
        experience: body.experience,
        region: body.region,
        motivation: body.motivation,
        status: "PENDING",
        rejectReason: null,
        reviewedAt: null,
      },
      update: {
        idNumber: body.idNumber,
        experience: body.experience,
        region: body.region,
        motivation: body.motivation,
        status: "PENDING",
        rejectReason: null,
        reviewedAt: null,
      },
    });

    return created(app);
  } catch (err) {
    return handleApiError(err);
  }
}
