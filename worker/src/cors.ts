import { HttpError } from "./http-error";

export function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((value) =>
    value.trim(),
  );
  if (!allowedOrigins.includes(origin)) {
    throw new HttpError(403, "origin_not_allowed", "Origin is not allowed.");
  }
  return origin;
}

export function corsHeaders(origin: string | null): HeadersInit {
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
}

