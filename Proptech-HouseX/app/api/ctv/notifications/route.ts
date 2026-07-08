import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import {
  listBrokerNotifications,
  markNotificationsRead,
} from "@/lib/data/broker-notification";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const data = await listBrokerNotifications(session.brokerId);
    return applyApiCors(
      ok({
        items: data.items.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          caseId: n.caseId,
          read: !!n.readAt,
          createdAt: n.createdAt.toISOString(),
        })),
        unreadCount: data.unreadCount,
      }),
      req,
    );
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const body = (await req.json().catch(() => ({}))) as { ids?: string[] };
    const count = await markNotificationsRead(session.brokerId, body.ids);
    return applyApiCors(ok({ marked: count }), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
