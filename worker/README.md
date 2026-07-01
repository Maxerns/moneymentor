# MoneyMentor API (edge aggregation proxy)

A Cloudflare Worker that fans out to several **free** financial APIs, caches each
response in **Workers KV** with a per-domain TTL, normalizes every payload into a
single clean shape, and keeps API keys server-side. The MoneyMentor mobile app
makes one call per screen instead of talking to six upstreams directly.

```
app ──▶ GET /dashboard ──▶ Worker
                            ├─ CoinGecko   (crypto)   ─┐
                            ├─ Frankfurter (FX)        ─┤ Promise.allSettled
                            └─ ONS         (UK CPI)    ─┘ + KV cache (per-TTL)
                            ▼
                   one normalized JSON payload (partial-failure tolerant)
```

## Endpoints

| Route         | Source                    | Cache TTL | Notes                              |
| ------------- | ------------------------- | --------- | ---------------------------------- |
| `/health`     | —                         | —         | Liveness check                     |
| `/crypto`     | CoinGecko (keyless)       | 60s       | `?ids=bitcoin,ethereum&vs=gbp`     |
| `/fx`         | Frankfurter / ECB (keyless) | 12h     | `?base=GBP&symbols=USD,EUR,JPY`    |
| `/macro/uk`   | ONS website JSON (keyless)| 24h       | UK CPI + CPIH annual rate          |
| `/dashboard`  | all of the above          | (reuses each) | Aggregate; degrades to partial |
| `/markets`    | TwelveData (keyed)        | —         | `501` until secret configured      |
| `/macro/us`   | FRED (keyed)              | —         | `501` until secret configured      |
| `/news`       | Finnhub/Marketaux (keyed) | —         | `501` until secret configured      |

Cache state is exposed per response via `X-Cache: HIT | MISS | STALE` and
`X-Data-Timestamp`.

## Design notes

- **Serve-stale-on-error**: every fresh entry is mirrored to a 7-day "stale"
  copy. If an upstream fails, the last good value is served (`X-Cache: STALE`)
  rather than erroring the dashboard. See `src/cache.ts`.
- **Injected dependencies**: each source takes an injectable `fetcher`, and the
  cache depends on a narrow `KvLike` interface — so the whole thing is unit-tested
  on plain Vitest without spinning up `workerd`.
- **ONS reality check**: the official `api.ons.gov.uk` was retired 25/11/2024, so
  UK inflation is read from the ONS website's `/data` JSON instead.

## Develop

```bash
npm install
npm test            # offline, deterministic (fixtures are real captured payloads)
LIVE=1 npm test     # also hit the real upstreams
npm run typecheck
npm run dev         # wrangler dev (local KV)
```

## Deploy

```bash
wrangler login
wrangler kv namespace create CACHE          # paste id + preview_id into wrangler.jsonc
# later, for the keyed sources:
wrangler secret put TWELVEDATA_API_KEY
npm run deploy
```
