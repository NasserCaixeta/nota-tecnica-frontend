import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { SubscriptionPage } from "./SubscriptionPage";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("cancels renewal while showing the already confirmed period", async () => {
  let cancelled = false;
  const fetch = vi.fn().mockImplementation(async (url: string) => {
    if (url.endsWith("/cancel")) { cancelled = true; return new Response(JSON.stringify({ status: "confirmed" })); }
    if (url.endsWith("/config")) return new Response(JSON.stringify({ enabled: true, subscription_price_cents: 4900 }));
    if (url.endsWith("/garage")) return new Response(JSON.stringify({ vehicles: [] }));
    return new Response(JSON.stringify({ capacity_limit: 5, can_start_checkout: false, period: { order_id: "order", expires_at: "2026-11-27T12:00:00Z" }, subscription: { order_id: "order", cancellation_status: cancelled ? "confirmed" : null } }));
  });
  vi.stubGlobal("fetch", fetch);
  render(<MemoryRouter><SubscriptionPage /></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", { name: /Cancelar renovação/ }));
  expect(await screen.findByText(/Renovação cancelada/)).toBeInTheDocument();
  expect(screen.getByText(/Período confirmado até/)).toBeInTheDocument();
  expect(screen.getByText(/5 veículos no total/)).toBeInTheDocument();
});
