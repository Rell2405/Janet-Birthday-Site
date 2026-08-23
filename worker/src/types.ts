export type AttendanceStatus =
  | "attending"
  | "not-attending"
  | "undecided";

export interface RsvpSubmission {
  householdName: string;
  attendance: AttendanceStatus;
  partySize: number;
  dietaryRestrictions: string | null;
  message: string | null;
  turnstileToken: string;
}

export interface TurnstileResult {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

