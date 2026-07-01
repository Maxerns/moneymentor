import type { KvLike } from "../src/cache";
import type { Fetcher } from "../src/sources/coingecko";

// In-memory KV that honours `expirationTtl` against an injectable clock, so
// cache-expiry behaviour can be tested deterministically.
export class FakeKV implements KvLike {
  private store = new Map<string, { value: string; expiresAt: number | null }>();
  puts = 0;

  constructor(private now: () => number = () => Date.now()) {}

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== null && this.now() >= entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void> {
    this.puts++;
    const ttl = options?.expirationTtl;
    // Only an absent TTL means "never expires"; a TTL of 0 must expire
    // immediately, matching Workers KV rather than treating 0 as falsy.
    this.store.set(key, {
      value,
      expiresAt: ttl !== undefined ? this.now() + ttl * 1000 : null,
    });
  }
}

export interface StubResult {
  status?: number;
  body?: unknown;
}

// Build a fetch stub whose behaviour is decided per-URL. Returning an Error
// makes the "call" reject (simulating a network failure). A string `body` is
// sent verbatim (for CSV/text upstreams like BoE); anything else is JSON.
export function makeFetch(
  resolve: (url: string) => StubResult | Error,
): Fetcher {
  return async (url: string) => {
    const result = resolve(String(url));
    if (result instanceof Error) throw result;
    const body =
      typeof result.body === "string"
        ? result.body
        : JSON.stringify(result.body ?? null);
    return new Response(body, { status: result.status ?? 200 });
  };
}

// A tiny real-shaped BoE Bank Rate CSV (header + a step change) for routing tests.
export const SAMPLE_BOE_CSV = [
  "DATE,IUDBEDR",
  "07 Aug 2025,4",
  "18 Dec 2025,3.75",
  "30 Jun 2026,3.75",
  "",
].join("\n");
