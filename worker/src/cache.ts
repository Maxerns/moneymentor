import { STALE_TTL } from "./config";

// The subset of Cloudflare's KVNamespace this module needs. Depending on this
// narrow interface (rather than the full KVNamespace) keeps the cache decoupled
// from the runtime and trivially fakeable in tests. A real KVNamespace
// structurally satisfies it.
export interface KvLike {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
}

export type CacheStatus = "HIT" | "MISS" | "STALE";

export interface CacheResult<T> {
  data: T;
  status: CacheStatus;
  storedAt: string; // ISO 8601 of when the *served* data was fetched upstream
}

interface Envelope<T> {
  data: T;
  storedAt: string;
}

const STALE_PREFIX = "stale:";

/**
 * Read-through cache with serve-stale-on-error.
 *
 * - Fresh KV hit  -> return it (HIT).
 * - Miss          -> run `loader`, store a fresh copy (TTL) *and* a long-lived
 *                    stale copy, return it (MISS).
 * - Loader throws -> fall back to the stale copy if we have one (STALE);
 *                    otherwise rethrow so the caller can surface the failure.
 *
 * KV's own `expirationTtl` handles freshness expiry, so a present fresh key is
 * by definition still fresh — no clock logic lives here.
 */
export async function getCached<T>(
  kv: KvLike,
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
  staleTtlSeconds: number = STALE_TTL,
): Promise<CacheResult<T>> {
  const fresh = await kv.get(key);
  if (fresh !== null) {
    const envelope = JSON.parse(fresh) as Envelope<T>;
    return { data: envelope.data, status: "HIT", storedAt: envelope.storedAt };
  }

  try {
    const data = await loader();
    const envelope: Envelope<T> = { data, storedAt: new Date().toISOString() };
    const serialized = JSON.stringify(envelope);
    await kv.put(key, serialized, { expirationTtl: ttlSeconds });
    await kv.put(STALE_PREFIX + key, serialized, {
      expirationTtl: staleTtlSeconds,
    });
    return { data, status: "MISS", storedAt: envelope.storedAt };
  } catch (err) {
    const stale = await kv.get(STALE_PREFIX + key);
    if (stale !== null) {
      const envelope = JSON.parse(stale) as Envelope<T>;
      return {
        data: envelope.data,
        status: "STALE",
        storedAt: envelope.storedAt,
      };
    }
    throw err;
  }
}
