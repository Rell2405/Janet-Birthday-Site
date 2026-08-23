import type { ApiErrorBody } from "./types";

const baseHeaders: HeadersInit = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

export function jsonResponse(
  body: unknown,
  status: number,
  additionalHeaders: HeadersInit = {},
): Response {
  return Response.json(body, {
    status,
    headers: {
      ...baseHeaders,
      ...additionalHeaders,
    },
  });
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  additionalHeaders: HeadersInit = {},
): Response {
  const body: ApiErrorBody = { error: { code, message } };
  return jsonResponse(body, status, additionalHeaders);
}

