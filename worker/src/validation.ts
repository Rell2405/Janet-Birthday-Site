import { HttpError } from "./http-error";
import type { AttendanceStatus, RsvpSubmission } from "./types";

const attendanceValues = new Set<AttendanceStatus>([
  "attending",
  "not-attending",
  "undecided",
]);

function isAttendanceStatus(value: unknown): value is AttendanceStatus {
  return (
    typeof value === "string" &&
    attendanceValues.has(value as AttendanceStatus)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  record: Record<string, unknown>,
  key: string,
  maximumLength: number,
): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new HttpError(400, "invalid_request", `${key} must be a string.`);
  }

  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length === 0 || normalized.length > maximumLength) {
    throw new HttpError(
      400,
      "invalid_request",
      `${key} must contain between 1 and ${maximumLength} characters.`,
    );
  }
  return normalized;
}

function optionalString(
  record: Record<string, unknown>,
  key: string,
  maximumLength: number,
): string | null {
  const value = record[key];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new HttpError(400, "invalid_request", `${key} must be a string.`);
  }

  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length > maximumLength) {
    throw new HttpError(
      400,
      "invalid_request",
      `${key} must not exceed ${maximumLength} characters.`,
    );
  }
  return normalized || null;
}

export function parseRsvpSubmission(
  value: unknown,
  maximumPartySize: number,
): RsvpSubmission {
  if (!isRecord(value)) {
    throw new HttpError(400, "invalid_request", "Request body must be an object.");
  }

  const householdName = requiredString(value, "householdName", 100);
  const turnstileToken = requiredString(value, "turnstileToken", 2048);

  const attendance = value.attendance;
  if (!isAttendanceStatus(attendance)) {
    throw new HttpError(
      400,
      "invalid_request",
      "attendance must be attending, not-attending, or undecided.",
    );
  }

  const partySize = value.partySize;
  if (
    typeof partySize !== "number" ||
    !Number.isInteger(partySize) ||
    partySize < 0 ||
    partySize > maximumPartySize
  ) {
    throw new HttpError(
      400,
      "invalid_request",
      `partySize must be an integer between 0 and ${maximumPartySize}.`,
    );
  }

  if (attendance === "attending" && partySize < 1) {
    throw new HttpError(
      400,
      "invalid_request",
      "Attending households must include at least one guest.",
    );
  }
  if (attendance === "not-attending" && partySize !== 0) {
    throw new HttpError(
      400,
      "invalid_request",
      "A non-attending RSVP must have a party size of zero.",
    );
  }

  return {
    householdName,
    attendance,
    partySize,
    dietaryRestrictions: optionalString(value, "dietaryRestrictions", 500),
    message: optionalString(value, "message", 1000),
    turnstileToken,
  };
}
