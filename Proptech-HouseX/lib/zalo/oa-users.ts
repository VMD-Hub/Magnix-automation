/**
 * Zalo OA — liệt kê user_id (followers / recent chat). Không log token.
 */

type ZaloOaListResult =
  | { ok: true; users: { userId: string; displayName?: string }[] }
  | { ok: false; error: string };

async function getOaAccessToken(): Promise<string> {
  const staticToken = process.env.ZALO_OA_ACCESS_TOKEN?.trim();
  const refresh = process.env.ZALO_OA_REFRESH_TOKEN?.trim();
  const appId = process.env.ZALO_APP_ID?.trim();
  const secret = process.env.ZALO_APP_SECRET?.trim();

  if (!appId || !secret) {
    throw new Error("ZALO_APP_ID / ZALO_APP_SECRET required");
  }

  if (!refresh && staticToken) return staticToken;
  if (!refresh) {
    throw new Error("ZALO_OA_REFRESH_TOKEN or ZALO_OA_ACCESS_TOKEN required");
  }

  const res = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      secret_key: secret,
    },
    body: new URLSearchParams({
      app_id: appId,
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });

  const data = (await res.json()) as {
    access_token?: string;
    error_description?: string;
    error_name?: string;
  };

  if (!data.access_token) {
    throw new Error(
      data.error_description ?? data.error_name ?? `token refresh ${res.status}`,
    );
  }
  return data.access_token;
}

async function oaGetJson<T>(
  path: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const accessToken = await getOaAccessToken();
  const url = new URL(`https://openapi.zalo.me/v2.0/oa/${path}`);
  url.searchParams.set("data", JSON.stringify(payload));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { access_token: accessToken },
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
