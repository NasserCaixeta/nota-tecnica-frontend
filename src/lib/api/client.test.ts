import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiRequest } from "./client";
import { getStoredToken, setStoredToken } from "../auth/token-storage";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.localStorage.clear();
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


describe("HTTP failures and session expiry", () => {
  it("handles a non JSON gateway response as an ApiError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Bad gateway", { status: 502 })));
    await expect(apiRequest("/garage")).rejects.toBeInstanceOf(ApiError);
  });
  it("accepts an empty successful response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    await expect(apiRequest("/empty")).resolves.toBeNull();
  });
  it("clears an expired authenticated token", async () => {
    setStoredToken("expired-token");
    expect(getStoredToken()).toBe("expired-token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"detail":"Expired"}', { status: 401 })));
    await expect(apiRequest("/users/me")).rejects.toBeInstanceOf(ApiError);
    expect(getStoredToken()).toBeNull();
  });
});
