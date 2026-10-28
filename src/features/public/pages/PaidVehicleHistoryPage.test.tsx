import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { PaidVehicleHistoryPage } from "./PaidVehicleHistoryPage";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("reads an existing grant without creating another checkout", async () => {
  const fetch = vi.fn().mockImplementation(async (url: string) => new Response(JSON.stringify(url.includes("/history/vehicles/") ? { plate: "ABC1D23", access: { source: "purchase", expires_at: "2099-01-01T12:00:00Z" }, records: [{ id: 1, public_description: "Troca revisada", service_date: "2026-10-01", odometer: 50000, total_cost: "100.00", workshop: null }] } : { enabled: true, history_price_cents: 1900 })));
  vi.stubGlobal("fetch", fetch);
  render(<MemoryRouter initialEntries={["/app/historico/ABC1D23"]}><Routes><Route path="/app/historico/:plate" element={<PaidVehicleHistoryPage />} /></Routes></MemoryRouter>);
  expect(await screen.findByText("Troca revisada")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Comprar/ })).not.toBeInTheDocument();
  expect(fetch.mock.calls.every(([, options]) => !options?.method || options.method === "GET")).toBe(true);
});

it("removes history when the purchase expires while the page is open", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-27T12:00:00Z"));
  const { act } = await import("@testing-library/react");
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => {
    if (!url.includes("/history/vehicles/")) return new Response(JSON.stringify({ enabled: true, history_price_cents: 1900 }));
    // Even a stale response must not keep showing an expired history.
    return new Response(JSON.stringify({ plate: "ABC1D23", access: { source: "purchase", expires_at: "2026-10-27T12:00:01Z" }, records: [{ id: 1, public_description: "Histórico temporário", service_date: "2026-10-01", odometer: 1, total_cost: "100.00", workshop: null }] }));
  }));
  try {
    await act(async () => { render(<MemoryRouter initialEntries={["/app/historico/ABC1D23"]}><Routes><Route path="/app/historico/:plate" element={<PaidVehicleHistoryPage />} /></Routes></MemoryRouter>); });
    expect(screen.getByText("Histórico temporário")).toBeInTheDocument();
    await act(async () => { await vi.advanceTimersByTimeAsync(1001); });
    expect(screen.queryByText("Histórico temporário")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Comprar acesso/ })).toBeInTheDocument();
  } finally { cleanup(); vi.useRealTimers(); }
});
