import { ok } from "@/lib/api/http";
import { getSessionUser } from "@/lib/auth/session";
import { loadSessionProfile } from "@/lib/auth/session-profile";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return ok({ user: null });
  }

  const profile = await loadSessionProfile(session);
  return ok({ user: profile });
}
