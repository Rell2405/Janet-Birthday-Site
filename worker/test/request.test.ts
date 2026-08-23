import { describe, expect, it } from "vitest";

import { readJsonBody } from "../src/request";

describe("request body handling", () => {
  it("parses bounded JSON bodies", async () => {
    const request = new Request("https://api.example.com/v1/rsvps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    });

    await expect(readJsonBody(request, 100)).resolves.toEqual({ ok: true });
  });

  it("rejects unsupported content types", async () => {
    const request = new Request("https://api.example.com/v1/rsvps", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "{}",
    });

    await expect(readJsonBody(request, 100)).rejects.toMatchObject({
      status: 415,
      code: "unsupported_media_type",
    });
  });

  it("stops reading oversized streamed bodies", async () => {
    const request = new Request("https://api.example.com/v1/rsvps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: "x".repeat(200) }),
    });

    await expect(readJsonBody(request, 50)).rejects.toMatchObject({
      status: 413,
      code: "payload_too_large",
    });
  });
});
