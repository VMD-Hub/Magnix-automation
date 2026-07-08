import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import {
  listBrokerNotifications,
  markNotificationsRead,
} from "@/lib/data/broker-notification";

export async function GET(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }

    const data = await listBrokerNotifications(session.brokerId);
    return ok({
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
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }

    const body = (await req.json().catch(() => ({}))) as { ids?: string[] };
    const count = await markNotificationsRead(
      session.brokerId,
      body.ids,
    );
    return ok({ marked: count });
  } catch (err) {
    return handleApiError(err);
  }
}
