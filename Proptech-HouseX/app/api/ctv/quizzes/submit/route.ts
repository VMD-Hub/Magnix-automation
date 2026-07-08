import type { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import {
  isQuizSubmitError,
  submitQuizAttempt,
} from "@/lib/data/agent-services";

const bodySchema = z.object({
  quizId: z.string().uuid(),
  answers: z.record(z.string(), z.string().min(1).max(8)),
});

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** POST /api/ctv/quizzes/submit — chấm bài + mở entitlement nếu đậu. */
export async function POST(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const body = bodySchema.parse(await req.json());
    const result = await submitQuizAttempt({
      brokerId: session.brokerId,
      quizId: body.quizId,
      answers: body.answers,
    });

    return applyApiCors(ok(result), req);
  } catch (err) {
    if (isQuizSubmitError(err)) {
      const status = err.code === "PREREQ_LOCKED" ? 403 : 404;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
