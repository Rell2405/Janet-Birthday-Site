import { describe, expect, it } from "vitest";

import { createUpdateToken, hashUpdateToken } from "../src/crypto";

describe("RSVP update tokens", () => {
  it("creates opaque URL-safe tokens", () => {
    const token = createUpdateToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("hashes tokens deterministically without storing the original", async () => {
    const token = createUpdateToken();
    const firstHash = await hashUpdateToken(token);
    const secondHash = await hashUpdateToken(token);

    expect(firstHash).toBe(secondHash);
    expect(firstHash).toMatch(/^[a-f0-9]{64}$/);
    expect(firstHash).not.toContain(token);
  });
});

