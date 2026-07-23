/**
 * IndexNow — notify Bing / Yandex / … khi URL mới hoặc cập nhật.
 * Google không dùng IndexNow; GSC Request indexing vẫn làm tay.
 *
 * Key file (ownership): `public/{key}.txt` → https://timnhaxahoi.com/{key}.txt
 * Env: INDEXNOW_KEY (optional override), INDEXNOW_ENABLED=false để tắt submit.
 * Site submit: INDEXNOW_SITE_URL hoặc production host — không bao giờ POST localhost.
 */
import { listNoxhProvinceHubsEnabled, noxhProvinceHubPath } from "@/lib/content/noxh-province-registry";
import { NOXH_HANDBOOK_PATH } from "@/lib/content/article-routes";
import { NOXH_CATALOG_PATH } from "@/lib/content/project-catalog-paths";
import { getSiteHostname, getSiteUrl } from "@/lib/site-config";

/** Key đã host tại public/{key}.txt — đổi key = đổi file + env. */
export const INDEXNOW_KEY_COMMITTED = "4d0ed13bac455b1df1eb45dc3dcecd25";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** Host public thật — IndexNow từ chối / vô nghĩa với localhost. */
export const INDEXNOW_PRODUCTION_SITE_URL = "https://timnhaxahoi.com";

export function getIndexNowKey(): string {
  return process.env.INDEXNOW_KEY?.trim() || INDEXNOW_KEY_COMMITTED;
}

export function isIndexNowEnabled(): boolean {
  return process.env.INDEXNOW_ENABLED !== "false";
}

export function isLocalSiteUrl(siteUrl: string): boolean {
  try {
    const host = new URL(siteUrl).hostname;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.endsWith(".local")
    );
  } catch {
    return true;
  }
}

/**
 * URL gốc dùng khi submit IndexNow.
 * Ưu tiên: opts.siteUrl → INDEXNOW_SITE_URL → getSiteUrl() (nếu không local) → production.
 */
export function resolveIndexNowSiteUrl(explicit?: string): string {
  const candidates = [
    explicit?.trim(),
    process.env.INDEXNOW_SITE_URL?.trim(),
    getSiteUrl(),
  ].filter(Boolean) as string[];

  for (const raw of candidates) {
    const normalized = raw.replace(/\/$/, "");
    if (!isLocalSiteUrl(normalized)) return normalized;
  }
  return INDEXNOW_PRODUCTION_SITE_URL;
}

export function indexNowKeyLocation(siteUrl = resolveIndexNowSiteUrl()): string {
  const key = getIndexNowKey();
  return `${siteUrl.replace(/\/$/, "")}/${key}.txt`;
}

export type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

/** Chuẩn hóa → absolute URL cùng host; bỏ trùng / lệch host. */
export function normalizeIndexNowUrlList(
  urls: string[],
  siteUrl = resolveIndexNowSiteUrl(),
): string[] {
  const base = siteUrl.replace(/\/$/, "");
  const host = new URL(base).hostname;
  const out: string[] = [];
  const seen = new Set<string>();

  for (const raw of urls) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    let absolute: string;
    try {
      absolute = trimmed.startsWith("http")
        ? new URL(trimmed).href.replace(/\/$/, "") || trimmed
        : `${base}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
      absolute = absolute.replace(/\/$/, "") || absolute;
      const u = new URL(absolute);
      if (u.hostname !== host) continue;
      absolute = u.origin + u.pathname + u.search;
    } catch {
      continue;
    }
    if (seen.has(absolute)) continue;
    seen.add(absolute);
    out.push(absolute);
  }
  return out;
}

export function buildIndexNowPayload(
  urls: string[],
  opts?: { siteUrl?: string },
): IndexNowPayload | null {
  const siteUrl = resolveIndexNowSiteUrl(opts?.siteUrl);
  if (isLocalSiteUrl(siteUrl)) {
    return null;
  }
  const urlList = normalizeIndexNowUrlList(urls, siteUrl);
  if (urlList.length === 0) return null;
  const key = getIndexNowKey();
  let host: string;
  try {
    host = new URL(siteUrl).hostname;
  } catch {
    host = getSiteHostname();
  }
  return {
    host,
    key,
    keyLocation: indexNowKeyLocation(siteUrl),
    urlList,
  };
}

/** Preset discovery ưu tiên — hub tỉnh P0.1 + silo NOXH. */
export function indexNowPriorityUrls(
  siteUrl = resolveIndexNowSiteUrl(),
): string[] {
  const base = siteUrl.replace(/\/$/, "");
  const hubs = listNoxhProvinceHubsEnabled().map(
    (h) => `${base}${noxhProvinceHubPath(h.slug)}`,
  );
  return [
    `${base}/`,
    `${base}${NOXH_CATALOG_PATH}`,
    `${base}${NOXH_HANDBOOK_PATH}`,
    ...hubs,
    `${base}/vay-mua-nha`,
    `${base}/tinh-tra-gop`,
  ];
}

export type IndexNowSubmitResult = {
  ok: boolean;
  skipped?: boolean;
  status?: number;
  submitted: number;
  body?: string;
  error?: string;
};

/**
 * POST IndexNow. Không throw — caller log / ignore.
 * 200 / 202 = chấp nhận; 204 = đã biết URL; 429 = rate limit — đợi rồi thử lại.
 */
export async function submitIndexNowUrls(
  urls: string[],
  opts?: { siteUrl?: string; fetchImpl?: typeof fetch },
): Promise<IndexNowSubmitResult> {
  if (!isIndexNowEnabled()) {
    return { ok: true, skipped: true, submitted: 0 };
  }

  const siteUrl = resolveIndexNowSiteUrl(opts?.siteUrl);
  if (isLocalSiteUrl(siteUrl)) {
    return {
      ok: false,
      submitted: 0,
      error: "localhost_site_url",
    };
  }

  const payload = buildIndexNowPayload(urls, { siteUrl });
  if (!payload) {
    return { ok: false, submitted: 0, error: "empty_url_list" };
  }

  const fetchFn = opts?.fetchImpl ?? fetch;
  try {
    const res = await fetchFn(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const body = await res.text().catch(() => "");
    const ok = res.status === 200 || res.status === 202 || res.status === 204;
    let error: string | undefined;
    if (!ok) {
      if (res.status === 429) {
        error =
          "rate_limited_429 — đợi 10–30 phút rồi --apply lại (host production)";
      } else {
        error = `http_${res.status}`;
      }
    }
    return {
      ok,
      status: res.status,
      submitted: payload.urlList.length,
      body: body.slice(0, 500),
      error,
    };
  } catch (err) {
    return {
      ok: false,
      submitted: payload.urlList.length,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Fire-and-forget — không block publish path. */
export function notifyIndexNowUrls(urls: string[]): void {
  if (!isIndexNowEnabled() || urls.length === 0) return;
  void submitIndexNowUrls(urls).then((r) => {
    if (!r.ok && !r.skipped) {
      console.warn("[indexnow]", r.error ?? r.status, r.submitted);
    }
  });
}
