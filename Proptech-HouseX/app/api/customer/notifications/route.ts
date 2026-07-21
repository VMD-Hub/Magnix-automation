import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { requireCustomerSessionFromRequest } from "@/lib/auth/require-customer";
import {
  listCustomerNotifications,
  markCustomerNotificationsRead,
} from "@/lib/data/customer-notification";

/** GET /api/customer/notifications — inbox in-app khách (ADR-016 P2). */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireCustomerSessionFromRequest(req);
    if (!auth.ok) {
      return fail(auth.status, auth.code, auth.message);
    }
    const data = await listCustomerNotifications(auth.customerId);
    return ok({
      items: data.items.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        projectId: n.projectId,
        leadId: n.leadId,
        href: n.href,
        readAt: n.readAt?.toISOString() ?? null,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount: data.unreadCount,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/** PATCH /api/customer/notifications — đánh dấu đã đọc. */
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireCustomerSessionFromRequest(req);
    if (!auth.ok) {
      return fail(auth.status, auth.code, auth.message);
    }
    const body = (await req.json().catch(() => ({}))) as { ids?: string[] };
    const count = await markCustomerNotificationsRead(
      auth.customerId,
      Array.isArray(body.ids) ? body.ids : undefined,
    );
    return ok({ marked: count });
  } catch (err) {
    return handleApiError(err);
  }
}
