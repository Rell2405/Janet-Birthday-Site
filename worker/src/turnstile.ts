import { HttpError } from "./http-error";
import type { TurnstileResult } from "./types";

function isTurnstileResult(value: unknown): value is TurnstileResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof value.success === "boolean"
  );
}

export async function verifyTurnstile(
  token: string,
  env: Env,
  remoteAddress: string | null,
): Promise<void> {
  const formData = new FormData();
  formData.set("secret", env.TURNSTILE_SECRET_KEY);
  formData.set("response", token);
  formData.set("idempotency_key", crypto.randomUUID());
  if (remoteAddress) formData.set("remoteip", remoteAddress);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new HttpError(
      503,
      "verification_unavailable",
      "Verification is temporarily unavailable.",
    );
  }

  const result: unknown = await response.json();
  if (!isTurnstileResult(result)) {
    throw new HttpError(
      502,
      "invalid_verification_response",
      "Verification returned an invalid response.",
    );
  }

  if (!result.success) {
    throw new HttpError(
      400,
      "verification_failed",
      "Verification failed. Please try again.",
    );
  }

  if (
    env.TURNSTILE_EXPECTED_HOSTNAME &&
    result.hostname !== env.TURNSTILE_EXPECTED_HOSTNAME
  ) {
    throw new HttpError(
      400,
      "verification_failed",
      "Verification failed. Please try again.",
    );
  }

  if (
    env.TURNSTILE_EXPECTED_ACTION &&
    result.action !== env.TURNSTILE_EXPECTED_ACTION
  ) {
    throw new HttpError(
      400,
      "verification_failed",
      "Verification failed. Please try again.",
    );
  }
}

