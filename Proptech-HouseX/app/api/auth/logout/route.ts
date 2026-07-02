import { ok } from "@/lib/api/http";
import { clearSessionOnResponse } from "@/lib/auth/cookie-response";

export async function POST() {
  const res = ok({ loggedOut: true });
  return clearSessionOnResponse(res);
}
