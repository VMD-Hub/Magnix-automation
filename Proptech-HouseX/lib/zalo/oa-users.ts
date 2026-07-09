import { fetchOaAccessToken } from "./oa";
import { buildOaOpenApiHeaders } from "./oa-api-headers";

type ZaloOaListResult =
  | { ok: true; users: { userId: string; displayName?: string }[] }
  | { ok: false; error: string };

async function oaGetJson<T>(
  path: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const accessToken = await fetchOaAccessToken();
  const url = new URL(`https://openapi.zalo.me/v2.0/oa/${path}`);
  url.searchParams.set("data", JSON.stringify(payload));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: buildOaOpenApiHeaders(accessToken),
    cache: "no-store",
  });

  return (await res.json()) as T;
}

function pickUsers(
  items: unknown[],
  idKeys: string[],
  nameKeys: string[],
): { userId: string; displayName?: string }[] {
  const out: { userId: string; displayName?: string }[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    let userId = "";
    for (const k of idKeys) {
      const v = row[k];
      if (v != null && String(v).trim()) {
        userId = String(v).trim();
        break;
      }
    }
    if (!userId || seen.has(userId)) continue;
    seen.add(userId);

    let displayName: string | undefined;
    for (const k of nameKeys) {
      const v = row[k];
      if (typeof v === "string" && v.trim()) {
        displayName = v.trim();
        break;
      }
    }
    out.push({ userId, displayName });
  }
  return out;
}

/** Danh sách người quan tâm OA. */
export async function fetchOaFollowers(params: {
  offset?: number;
  count?: number;
}): Promise<ZaloOaListResult> {
  try {
    const data = await oaGetJson<{
      error?: number;
      message?: string;
      data?: { followers?: unknown[]; users?: unknown[] };
    }>("getfollowers", {
      offset: params.offset ?? 0,
      count: params.count ?? 10,
    });

    if (data.error && data.error !== 0) {
      return { ok: false, error: data.message ?? `getfollowers ${data.error}` };
    }

    const items = data.data?.followers ?? data.data?.users ?? [];
    return {
      ok: true,
      users: pickUsers(items, ["user_id", "id"], ["display_name", "name"]),
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Hội thoại gần đây — user đã nhắn OA. */
export async function fetchOaRecentChats(params: {
  offset?: number;
  count?: number;
}): Promise<ZaloOaListResult> {
  try {
    const data = await oaGetJson<{
      error?: number;
      message?: string;
      data?: unknown[];
    }>("listrecentchat", {
      offset: params.offset ?? 0,
      count: params.count ?? 10,
    });

    if (data.error && data.error !== 0) {
      return {
        ok: false,
        error: data.message ?? `listrecentchat ${data.error}`,
      };
    }

    const items = Array.isArray(data.data) ? data.data : [];
    return {
      ok: true,
      users: pickUsers(
        items,
        ["user_id", "from_id", "id"],
        ["display_name", "from_display_name", "name"],
      ),
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
