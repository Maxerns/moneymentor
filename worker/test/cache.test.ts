import { describe, expect, it, vi } from "vitest";
import { getCached } from "../src/cache";
import { FakeKV } from "./helpers";

describe("getCached", () => {
  it("MISS then HIT: loads once, then serves from cache", async () => {
    const kv = new FakeKV();
    const loader = vi.fn(async () => ({ n: 1 }));

    const first = await getCached(kv, "k", 60, loader);
    expect(first.status).toBe("MISS");
    expect(first.data).toEqual({ n: 1 });

    const second = await getCached(kv, "k", 60, loader);
    expect(second.status).toBe("HIT");
    expect(second.data).toEqual({ n: 1 });
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("reloads after the fresh TTL expires", async () => {
    let now = 1_000_000;
    const kv = new FakeKV(() => now);
    const loader = vi.fn(async () => ({ at: now }));

    await getCached(kv, "k", 60, loader); // MISS, fresh for 60s
    now += 61_000; // advance past the TTL
    const again = await getCached(kv, "k", 60, loader);

    expect(again.status).toBe("MISS");
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it("serves STALE data when the loader fails but a stale copy survives", async () => {
    let now = 0;
    const kv = new FakeKV(() => now);
    let calls = 0;
    const loader = vi.fn(async () => {
      calls += 1;
      if (calls === 1) return { ok: true };
      throw new Error("upstream down");
    });

    await getCached(kv, "k", 60, loader); // seeds fresh (60s) + stale (7d)
    now += 61_000; // fresh expired, stale still valid

    const stale = await getCached(kv, "k", 60, loader);
    expect(stale.status).toBe("STALE");
    expect(stale.data).toEqual({ ok: true });
  });

  it("rethrows when the loader fails and no stale copy exists", async () => {
    const kv = new FakeKV();
    const loader = vi.fn(async () => {
      throw new Error("boom");
    });
    await expect(getCached(kv, "k", 60, loader)).rejects.toThrow("boom");
  });
});
