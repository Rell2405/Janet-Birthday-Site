import { describe, expect, it } from "vitest";

import { formatCalendarDate, formatClockTime } from "../../src/lib/content";

describe("public content formatting", () => {
  it("formats date-only values without timezone rollover", () => {
    expect(formatCalendarDate("2026-05-23")).toBe("Saturday, May 23, 2026");
  });

  it("formats local itinerary times", () => {
    expect(formatClockTime("00:05")).toBe("12:05 AM");
    expect(formatClockTime("12:30")).toBe("12:30 PM");
    expect(formatClockTime("18:45")).toBe("6:45 PM");
  });
});
