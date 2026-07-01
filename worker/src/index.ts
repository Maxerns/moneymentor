import { handleCrypto } from "./handlers/crypto";
import { handleDashboard } from "./handlers/dashboard";
import { handleFx } from "./handlers/fx";
import { handleMacroUk } from "./handlers/macro";
import { handleMarkets } from "./handlers/markets";
import {
  corsPreflight,
  errorResponse,
  HttpError,
  json,
  notFound,
} from "./http";
import type { Env } from "./types";

type Handler = (url: URL, env: Env) => Promise<Response>;

// Keyed sources land here once their secrets are configured (Phase 1 follow-up).
const notImplemented =
  (what: string): Handler =>
  async () => {
    throw new HttpError(501, `${what} not yet implemented`, "not_implemented");
  };

const routes: Record<string, Handler> = {
  "/": async () =>
    json({
      service: "moneymentor-api",
      endpoints: [
        "/health",
        "/crypto",
        "/markets",
        "/fx",
        "/macro/uk",
        "/dashboard",
      ],
    }),
  "/health": async () => json({ ok: true, ts: new Date().toISOString() }),
  "/crypto": handleCrypto,
  "/markets": handleMarkets, // 501 until TWELVEDATA_API_KEY is set
  "/fx": handleFx,
  "/macro/uk": handleMacroUk,
  "/dashboard": handleDashboard,
  // Roadmap — keyed upstreams awaiting `wrangler secret put`:
  "/macro/us": notImplemented("US macro (FRED)"),
  "/news": notImplemented("news"),
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return corsPreflight();

    const url = new URL(request.url);
    try {
      if (request.method !== "GET") {
        throw new HttpError(405, "Method not allowed", "method_not_allowed");
      }
      const handler = routes[url.pathname];
      if (!handler) throw notFound(`No route for ${url.pathname}`);
      return await handler(url, env);
    } catch (err) {
      return errorResponse(err);
    }
  },
} satisfies ExportedHandler<Env>;
