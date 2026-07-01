// Small HTTP helpers: consistent JSON responses, CORS, and a typed error we can
// throw from anywhere and turn into a clean JSON body at the edge.

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*", // public, read-only proxy
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export interface JsonOptions {
  status?: number;
  headers?: Record<string, string>;
}

export function json(data: unknown, options: JsonOptions = {}): Response {
  return new Response(JSON.stringify(data), {
    status: options.status ?? 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...options.headers,
    },
  });
}

// An error whose status/code we control, so upstream failures and bad requests
// surface as structured JSON instead of an opaque 500.
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code = "error",
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function badRequest(message: string): HttpError {
  return new HttpError(400, message, "bad_request");
}

export function notFound(message = "Not found"): HttpError {
  return new HttpError(404, message, "not_found");
}

export function badGateway(message: string): HttpError {
  return new HttpError(502, message, "upstream_error");
}

export function errorResponse(err: unknown): Response {
  if (err instanceof HttpError) {
    return json({ error: { code: err.code, message: err.message } }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : "Unknown error";
  return json({ error: { code: "internal", message } }, { status: 500 });
}

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
