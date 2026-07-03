/** Tránh treo SSR khi Postgres offline — fallback catalog go-live. */
export async function withDbTimeout<T>(
  promise: Promise<T>,
  ms = 2500,
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
