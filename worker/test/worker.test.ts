import { afterEach, describe, expect, it, vi } from "vitest";
import worker from "../src/index";
import type { Env } from "../src/types";
import coingecko from "./fixtures/coingecko_markets.json";
import frankfurter from "./fixtures/frankfurter_latest.json";
import cpi from "./fixtures/ons_cpi.json";
import cpih from "./fixtures/ons_cpih.json";
import { FakeKV, makeFetch, SAMPLE_BOE_CSV, type StubResult } from "./helpers";

// Route a stubbed upstream fetch to the right fixture by URL.
function route(url: string): StubResult | Error {
  if (url.includes("coingecko")) return { body: coingecko };
  if (url.includes("frankfurter")) return { body: frankfurter };
  if (url.includes("bankofengland")) return { body: SAMPLE_BOE_CSV };
  if (url.includes("/l55o/")) return { body: cpih };
  if (url.includes("ons.gov.uk")) return { body: cpi };
  return new Error(`unexpected url ${url}`);
}

function envWithCache(): Env {
  return { CACHE: new FakeKV() } as unknown as Env;
}

function get(path: string, env: Env, method = "GET") {
  return worker.fetch(new Request(`https://api.local${path}`, { method }), env);
}

afterEach(() => vi.unstubAllGlobals());

describe("worker routing", () => {
  it("GET /health returns ok", async () => {
    vi.stubGlobal("fetch", makeFetch(route));
    const res = await get("/health", envWithCache());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
  });

  it("GET /crypto is a MISS then a HIT (cache works end-to-end)", async () => {
    const fetchSpy = vi.fn(makeFetch(route));
    vi.stubGlobal("fetch", fetchSpy);
    const env = envWithCache();

    const first = await get("/crypto", env);
    expect(first.status).toBe(200);
    expect(first.headers.get("X-Cache")).toBe("MISS");

    const second = await get("/crypto", env);
    expect(second.headers.get("X-Cache")).toBe("HIT");
    expect(fetchSpy).toHaveBeenCalledTimes(1); // upstream hit only once
  });

  it("GET /dashboard composes all sources with no errors", async () => {
    vi.stubGlobal("fetch", makeFetch(route));
    const res = await get("/dashboard", envWithCache());
    const body = (await res.json()) as {
      crypto: unknown[];
      fx: unknown;
      macro: unknown[];
      errors: unknown[];
    };
    expect(res.status).toBe(200);
    expect(body.crypto).toHaveLength(2);
    expect(body.fx).toBeTruthy();
    expect(body.macro).toHaveLength(3); // CPI + CPIH + Bank Rate
    expect(body.errors).toHaveLength(0);
  });

  it("GET /dashboard degrades to a partial payload when a source fails", async () => {
    // Both UK macro upstreams (ONS + BoE) throw; crypto + fx still succeed.
    const partial = (url: string): StubResult | Error =>
      url.includes("ons.gov.uk") || url.includes("bankofengland")
        ? new Error("UK macro down")
        : route(url);
    vi.stubGlobal("fetch", makeFetch(partial));

    const res = await get("/dashboard", envWithCache());
    const body = (await res.json()) as {
      crypto?: unknown[];
      macro?: unknown[];
      errors: { source: string }[];
    };
    expect(res.status).toBe(200); // still OK — partial data beats a 500
    expect(body.crypto).toHaveLength(2);
    expect(body.macro).toBeUndefined();
    expect(body.errors.map((e) => e.source)).toContain("macro");
  });

  it("OPTIONS returns 204 with CORS headers", async () => {
    const res = await get("/dashboard", envWithCache(), "OPTIONS");
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("unknown route is 404, non-GET is 405, keyed roadmap route is 501", async () => {
    vi.stubGlobal("fetch", makeFetch(route));
    expect((await get("/nope", envWithCache())).status).toBe(404);
    expect((await get("/crypto", envWithCache(), "POST")).status).toBe(405);
    expect((await get("/markets", envWithCache())).status).toBe(501);
  });
});
