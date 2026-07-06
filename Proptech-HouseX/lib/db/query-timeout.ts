/** Timeout ngắn cho danh sách catalog — fallback nhanh khi Postgres offline. */
export const LIST_QUERY_TIMEOUT_MS = 900;

/** Timeout mặc định cho truy vấn chi tiết (slug, v.v.). */
export const DEFAULT_QUERY_TIMEOUT_MS = 2500;

/** Tránh treo SSR khi Postgres offline — fallback catalog go-live. */
export async function withDbTimeout<T>(
  promise: Promise<T>,
  ms = DEFAULT_QUERY_TIMEOUT_MS,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("DB_QUERY_TIMEOUT")), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
