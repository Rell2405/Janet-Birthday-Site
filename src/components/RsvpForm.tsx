import { useState, type FormEvent } from "react";

import type { AttendanceStatus } from "@/config/event";

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
  }
}

interface RsvpFormProps {
  apiBase: string;
  maximumPartySize: number;
  turnstileSiteKey: string;
}

interface CreatedRsvp {
  id: string;
  updateToken: string;
}

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; result: CreatedRsvp };

function isCreatedRsvp(value: unknown): value is CreatedRsvp {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "updateToken" in value &&
    typeof value.updateToken === "string"
  );
}

export default function RsvpForm({
  apiBase,
  maximumPartySize,
  turnstileSiteKey,
}: RsvpFormProps) {
  const [state, setState] = useState<SubmissionState>({ status: "idle" });
  const [attendance, setAttendance] =
    useState<AttendanceStatus>("attending");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const form = new FormData(event.currentTarget);
    const token = form.get("cf-turnstile-response");
    if (typeof token !== "string" || token.length === 0) {
      setState({
        status: "error",
        message: "Please complete the verification and try again.",
      });
      return;
    }

    const partySizeValue =
      attendance === "not-attending" ? 0 : Number(form.get("partySize"));

    try {
      const response = await fetch(`${apiBase}/v1/rsvps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          householdName: form.get("householdName"),
          attendance,
          partySize: partySizeValue,
          dietaryRestrictions: form.get("dietaryRestrictions"),
          message: form.get("message"),
          turnstileToken: token,
        }),
      });

      const body: unknown = await response.json();
      if (!response.ok || !isCreatedRsvp(body)) {
        throw new Error("Your RSVP could not be submitted. Please try again.");
      }

      setState({ status: "success", result: body });
      event.currentTarget.reset();
      setAttendance("attending");
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your RSVP could not be submitted. Please try again.",
      });
      window.turnstile?.reset();
    }
  }

  if (state.status === "success") {
    return (
      <div
        className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-6"
        role="status"
      >
        <h2 className="text-xl font-semibold">RSVP received</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Save this private update code if you need to change your response:
        </p>
        <code className="mt-3 block break-all rounded bg-black/30 p-3 text-sm">
          {state.result.updateToken}
        </code>
      </div>
    );
  }

  return (
    <form
      className="mx-auto grid w-full max-w-xl gap-5 rounded-xl border border-border bg-card p-6 shadow-2xl"
      onSubmit={submit}
    >
      <div>
        <h2 className="text-2xl font-bold">RSVP</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Please submit one response for your household.
        </p>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">Guest or household name</span>
        <input
          className="rounded-md border border-input bg-background px-3 py-2"
          name="householdName"
          maxLength={100}
          required
        />
      </label>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold">Will you attend?</legend>
        {(
          [
            ["attending", "Joyfully accepts"],
            ["not-attending", "Regretfully declines"],
            ["undecided", "Not sure yet"],
          ] satisfies [AttendanceStatus, string][]
        ).map(([value, label]) => (
          <label className="flex items-center gap-2" key={value}>
            <input
              checked={attendance === value}
              name="attendance"
              onChange={() => setAttendance(value)}
              type="radio"
              value={value}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      {attendance !== "not-attending" ? (
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Number attending</span>
          <input
            className="rounded-md border border-input bg-background px-3 py-2"
            defaultValue={1}
            max={maximumPartySize}
            min={attendance === "attending" ? 1 : 0}
            name="partySize"
            required
            type="number"
          />
        </label>
      ) : null}

      <label className="grid gap-2">
        <span className="text-sm font-semibold">
          Dietary restrictions <span className="font-normal">(optional)</span>
        </span>
        <textarea
          className="min-h-20 rounded-md border border-input bg-background px-3 py-2"
          maxLength={500}
          name="dietaryRestrictions"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">
          Message <span className="font-normal">(optional)</span>
        </span>
        <textarea
          className="min-h-24 rounded-md border border-input bg-background px-3 py-2"
          maxLength={1000}
          name="message"
        />
      </label>

      <div
        className="cf-turnstile"
        data-action="turnstile-spin-v1"
        data-sitekey={turnstileSiteKey}
      />

      {state.status === "error" ? (
        <p className="text-sm text-red-300" role="alert">
          {state.message}
        </p>
      ) : null}

      <button
        className="rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60"
        disabled={state.status === "submitting"}
        type="submit"
      >
        {state.status === "submitting" ? "Submitting…" : "Submit RSVP"}
      </button>
    </form>
  );
}

