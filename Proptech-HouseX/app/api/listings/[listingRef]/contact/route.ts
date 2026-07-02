import type { NextRequest } from "next/server";
import { fail, handleApiError } from "@/lib/api/http";
import { revealListingContact } from "@/lib/security/listing-contact-reveal";
import { turnstileConfigured } from "@/lib/security/turnstile";

/** GET /api/listings/:listingRef/contact — chỉ khi chưa bật Turnstile (dev). */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ listingRef: string }> },
) {
  try {
    if (turnstileConfigured()) {
      return fail(
        405,
        "CAPTCHA_REQUIRED",
        "Vui lòng xác minh trước khi xem số điện thoại.",
      );
    }
    const { listingRef: code } = await params;
    return revealListingContact(req, { code });
  } catch (err) {
    return handleApiError(err);
  }
}

/** POST /api/listings/:listingRef/contact — production với Turnstile token. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ listingRef: string }> },
) {
  try {
    const { listingRef: code } = await params;
    const body = (await req.json().catch(() => ({}))) as {
      turnstileToken?: string;
    };
    return revealListingContact(req, {
      code,
      turnstileToken: body.turnstileToken,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
