import { allowedOrigin, corsHeaders } from "./cors";
import { createUpdateToken, hashUpdateToken } from "./crypto";
import { HttpError } from "./http-error";
import { readJsonBody } from "./request";
import { errorResponse, jsonResponse } from "./response";
import { verifyTurnstile } from "./turnstile";
import type { RsvpSubmission } from "./types";
import { parseRsvpSubmission } from "./validation";

const maximumBodyBytes = 8 * 1024;

function environmentMaximumPartySize(env: Env): number {
  const value = Number(env.RSVP_MAX_PARTY_SIZE);
  if (!Number.isInteger(value) || value < 1 || value > 20) {
    throw new Error("RSVP_MAX_PARTY_SIZE must be an integer from 1 to 20.");
  }
  return value;
}

function bearerToken(request: Request): string {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new HttpError(
      401,
      "update_token_required",
      "A valid RSVP update token is required.",
    );
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!/^[A-Za-z0-9_-]{40,64}$/.test(token)) {
    throw new HttpError(
      401,
      "invalid_update_token",
      "A valid RSVP update token is required.",
    );
  }
  return token;
}

function rateLimitKey(request: Request): string {
  const address = request.headers.get("CF-Connecting-IP") ?? "local";
  return `rsvp:${address}`;
}

async function enforceRateLimit(request: Request, env: Env): Promise<void> {
  const result = await env.RSVP_RATE_LIMITER.limit({
    key: rateLimitKey(request),
  });
  if (!result.success) {
    throw new HttpError(
      429,
      "rate_limited",
      "Too many RSVP attempts. Please wait and try again.",
    );
  }
}

async function validatedSubmission(
  request: Request,
  env: Env,
): Promise<RsvpSubmission> {
  await enforceRateLimit(request, env);
  const body = await readJsonBody(request, maximumBodyBytes);
  const submission = parseRsvpSubmission(
    body,
    environmentMaximumPartySize(env),
  );
  await verifyTurnstile(
    submission.turnstileToken,
    env,
    request.headers.get("CF-Connecting-IP"),
  );
  return submission;
}

async function createRsvp(
  request: Request,
  env: Env,
  origin: string | null,
): Promise<Response> {
  const submission = await validatedSubmission(request, env);
  const id = crypto.randomUUID();
  const updateToken = createUpdateToken();
  const updateTokenHash = await hashUpdateToken(updateToken);
  const timestamp = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO rsvps (
      id,
      update_token_hash,
      household_name,
      attendance,
      party_size,
      dietary_restrictions,
      guest_message,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      updateTokenHash,
      submission.householdName,
      submission.attendance,
      submission.partySize,
      submission.dietaryRestrictions,
      submission.message,
      timestamp,
      timestamp,
    )
    .run();

  return jsonResponse(
    { id, updateToken },
    201,
    corsHeaders(origin),
  );
}

async function updateRsvp(
  request: Request,
  env: Env,
  origin: string | null,
): Promise<Response> {
  const tokenHash = await hashUpdateToken(bearerToken(request));
  const submission = await validatedSubmission(request, env);
  const timestamp = new Date().toISOString();

  const result = await env.DB.prepare(
    `UPDATE rsvps
      SET household_name = ?,
          attendance = ?,
          party_size = ?,
          dietary_restrictions = ?,
          guest_message = ?,
          updated_at = ?
      WHERE update_token_hash = ?`,
  )
    .bind(
      submission.householdName,
      submission.attendance,
      submission.partySize,
      submission.dietaryRestrictions,
      submission.message,
      timestamp,
      tokenHash,
    )
    .run();

  if (result.meta.changes !== 1) {
    throw new HttpError(
      404,
      "rsvp_not_found",
      "The RSVP could not be found.",
    );
  }

  return jsonResponse({ updated: true }, 200, corsHeaders(origin));
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/health" && request.method === "GET") {
    return jsonResponse(
      { status: "ok", environment: env.ENVIRONMENT },
      200,
    );
  }

  const origin = allowedOrigin(request, env);
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  if (url.pathname !== "/v1/rsvps") {
    throw new HttpError(404, "not_found", "Route not found.");
  }

  if (request.method === "POST") {
    return createRsvp(request, env, origin);
  }
  if (request.method === "PATCH") {
    return updateRsvp(request, env, origin);
  }

  throw new HttpError(405, "method_not_allowed", "Method not allowed.");
}

export default {
  async fetch(request, env): Promise<Response> {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      const origin = request.headers.get("origin");
      const headers =
        origin &&
        env.ALLOWED_ORIGINS.split(",")
          .map((value) => value.trim())
          .includes(origin)
          ? corsHeaders(origin)
          : {};

      if (error instanceof HttpError) {
        console.warn(
          JSON.stringify({
            event: "request_rejected",
            code: error.code,
            status: error.status,
          }),
        );
        return errorResponse(error.code, error.message, error.status, headers);
      }

      console.error(
        JSON.stringify({
          event: "request_failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );
      return errorResponse(
        "internal_error",
        "The request could not be completed.",
        500,
        headers,
      );
    }
  },
} satisfies ExportedHandler<Env>;
