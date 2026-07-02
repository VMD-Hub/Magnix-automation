import { fail, handleApiError, ok } from "@/lib/api/http";
import { requireCustomerSession } from "@/lib/auth/require-customer";
import { getCustomerAccountSummary } from "@/lib/data/customer-account";

/** Khách đăng nhập — lead + giữ suất của mình (read-only). */
export async function GET() {
  try {
    const auth = await requireCustomerSession();
    if (!auth.ok) {
      return fail(auth.status, auth.code, auth.message);
    }

    const summary = await getCustomerAccountSummary(auth.customerId);
    return ok({ profile: auth.profile, ...summary });
  } catch (err) {
    return handleApiError(err);
  }
}
