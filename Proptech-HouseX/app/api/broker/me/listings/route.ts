import { fail, handleApiError, ok } from "@/lib/api/http";
import { requireBrokerSession } from "@/lib/auth/require-broker";
import { getBrokerListing, listBrokerListings } from "@/lib/data/broker-listings";

/** Tin đăng của môi giới đang đăng nhập. ?id=uuid — chi tiết một tin. */
export async function GET(req: Request) {
  try {
    const auth = await requireBrokerSession();
    if (!auth.ok) {
      return fail(auth.status, auth.code, auth.message);
    }

    const listingId = new URL(req.url).searchParams.get("id");
    if (listingId) {
      const listing = await getBrokerListing(auth.brokerId, listingId);
      if (!listing) {
        return fail(404, "NOT_FOUND", "Không tìm thấy tin đăng.");
      }
      return ok({ listing });
    }

    const items = await listBrokerListings(auth.brokerId);
    return ok({ items, profile: auth.profile });
  } catch (err) {
    return handleApiError(err);
  }
}
