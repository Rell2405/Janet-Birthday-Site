import { describe, expect, it } from "vitest";

import { HttpError } from "../src/http-error";
import { parseRsvpSubmission } from "../src/validation";

const validSubmission = {
  householdName: "Janet Doe",
  attendance: "attending",
  partySize: 2,
  dietaryRestrictions: "",
  message: "Looking forward to it!",
  turnstileToken: "test-token",
};

describe("RSVP validation", () => {
  it("normalizes valid submissions", () => {
    expect(parseRsvpSubmission(validSubmission, 10)).toEqual({
      ...validSubmission,
      dietaryRestrictions: null,
    });
  });

  it("requires a zero party size when declining", () => {
    expect(() =>
      parseRsvpSubmission(
        {
          ...validSubmission,
          attendance: "not-attending",
          partySize: 1,
        },
        10,
      ),
    ).toThrowError(HttpError);
  });

  it("enforces the configured party-size limit", () => {
    expect(() =>
      parseRsvpSubmission(
        { ...validSubmission, partySize: 11 },
        10,
      ),
    ).toThrowError(/between 0 and 10/);
  });

  it("rejects oversized free text", () => {
    expect(() =>
      parseRsvpSubmission(
        { ...validSubmission, message: "x".repeat(1001) },
        10,
      ),
    ).toThrowError(/must not exceed 1000/);
  });
});

