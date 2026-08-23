import { describe, expect, it } from "vitest";

import { eventConfig } from "../../src/config/event";
import {
  serializeThemeVariables,
  themeConfig,
} from "../../src/config/theme";

describe("site configuration", () => {
  it("keeps production features disabled until client decisions are complete", () => {
    expect(eventConfig.features.rsvp).toBe(false);
    expect(eventConfig.features.playlist).toBe(false);
    expect(eventConfig.features.invitationOnlyDetails).toBe(false);
  });

  it("defines safe RSVP defaults", () => {
    expect(eventConfig.rsvp.maxPartySize).toBeGreaterThan(0);
    expect(eventConfig.rsvp.maxPartySize).toBeLessThanOrEqual(20);
    expect(eventConfig.rsvp.retentionDaysAfterEvent).toBe(30);
  });

  it("serializes approved theme variables", () => {
    const style = serializeThemeVariables(themeConfig);
    expect(style).toContain("--background:222 47% 6%");
    expect(style).toContain("--radius:0.9rem");
  });
});

