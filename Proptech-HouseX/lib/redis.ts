import Redis from "ioredis";

/**
 * KV abstraction cho các tác vụ P0: idempotency key, click dedup, rate limit.
 * Dùng Redis khi có REDIS_URL; nếu không, fallback in-memory (chỉ hợp lệ cho dev
 * single-instance — KHÔNG dùng cho production nhiều instance).
 */
export interface Kv {
  /** SET key=value nếu chưa tồn tại, TTL giây. Trả true nếu set thành công. */
  setNx(key: string, value: string, ttlSec: number): Promise<boolean>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSec?: number): Promise<void>;
  /** INCR + set TTL ở lần đầu. Trả về giá trị sau khi tăng. */
  incrWithTtl(key: string, ttlSec: number): Promise<number>;
}

class RedisKv implements Kv {
  constructor(private readonly redis: Redis) {}

  async setNx(key: string, value: string, ttlSec: number): Promise<boolean> {
    const res = await this.redis.set(key, value, "EX", ttlSec, "NX");
    return res === "OK";
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlSec?: number): Promise<void> {
    if (ttlSec) await this.redis.set(key, value, "EX", ttlSec);
    else await this.redis.set(key, value);
  }

  async incrWithTtl(key: string, ttlSec: number): Promise<number> {
    const n = await this.redis.incr(key);
    if (n === 1) await this.redis.expire(key, ttlSec);
    return n;
  }
}

class MemoryKv implements Kv {
  private store = new Map<string, { value: string; expireAt: number }>();

  private alive(key: string) {
    const e = this.store.get(key);
    if (!e) return null;
    if (e.expireAt && e.expireAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return e;
  }

  async setNx(key: string, value: string, ttlSec: number): Promise<boolean> {
    if (this.alive(key)) return false;
    this.store.set(key, { value, expireAt: Date.now() + ttlSec * 1000 });
    return true;
  }

  async get(key: string): Promise<string | null> {
    return this.alive(key)?.value ?? null;
  }

  async set(key: string, value: string, ttlSec?: number): Promise<void> {
    this.store.set(key, {
      value,
      expireAt: ttlSec ? Date.now() + ttlSec * 1000 : 0,
    });
  }

  async incrWithTtl(key: string, ttlSec: number): Promise<number> {
    const cur = Number(this.alive(key)?.value ?? "0") + 1;
    const existing = this.alive(key);
    this.store.set(key, {
      value: String(cur),
      expireAt: existing?.expireAt || Date.now() + ttlSec * 1000,
    });
    return cur;
  }
}

const globalForKv = globalThis as unknown as { kv?: Kv; redis?: Redis };

export const kv: Kv =
  globalForKv.kv ??
  (() => {
    if (process.env.REDIS_URL) {
      const redis =
        globalForKv.redis ??
        new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 2 });
      globalForKv.redis = redis;
      return new RedisKv(redis);
    }
    return new MemoryKv();
  })();

if (process.env.NODE_ENV !== "production") {
  globalForKv.kv = kv;
}

/** Rate limit theo cửa sổ cố định. Trả true nếu vượt ngưỡng. */
export async function isRateLimited(
  key: string,
  max: number,
  windowSec: number,
): Promise<boolean> {
  const count = await kv.incrWithTtl(`rl:${key}`, windowSec);
  return count > max;
}
