import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiRequest } from "./client";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("apiRequest", () => {
  it("returns parsed JSON for successful responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 })),
    );

    await expect(apiRequest("/health")).resolves.toEqual({ ok: true });
  });

  it("throws ApiError for failed responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: "Invalid credentials" }), { status: 401 }),
      ),
    );

    await expect(apiRequest("/auth/login")).rejects.toBeInstanceOf(ApiError);
  });
});
