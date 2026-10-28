import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { CheckoutStatusPage } from "./CheckoutStatusPage";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const order = { id: "opaque", product: "history_access", plate: "ABC1D23", amount_cents: 1900, currency: "BRL", environment: "sandbox", state: "checkout_pending", checkout_url: null, benefit_active: false, benefit_expires_at: null };
const mount = () => render(<MemoryRouter initialEntries={["/app/compras/opaque?status=paid"]}><Routes><Route path="/app/compras/:orderId" element={<CheckoutStatusPage />} /></Routes></MemoryRouter>);

it("ignores a forged paid return parameter and waits for server confirmation", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(order))));
  mount();
  expect(await screen.findByText(/Aguardando confirmação financeira/)).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Ver histórico/ })).not.toBeInTheDocument();
  expect(screen.getByText(/Ambiente de testes — sem cobrança real/)).toBeInTheDocument();
});

it("reconciles the same order after an uncertain result", async () => {
  const fetch = vi.fn().mockImplementation(async (url: string) => new Response(JSON.stringify({ ...order, state: url.endsWith("/retry") ? "checkout_pending" : "reconciliation_required" })));
  vi.stubGlobal("fetch", fetch);
  mount();
  fireEvent.click(await screen.findByRole("button", { name: /Reconciliar pedido/ }));
  expect(await screen.findByText(/Aguardando confirmação financeira/)).toBeInTheDocument();
  expect(fetch.mock.calls.some(([url, options]) => url.endsWith("/orders/opaque/retry") && options.method === "POST")).toBe(true);
});

it("shows a refusal and offers server-checked purchase options", async () => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => new Response(JSON.stringify({ ...order, state: "rejected" }))));
  mount();
  expect(await screen.findByText("Pagamento recusado")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Conferir acesso e opções/ })).toHaveAttribute("href", "/app/historico/ABC1D23");
  expect(screen.queryByRole("link", { name: "Ver histórico" })).not.toBeInTheDocument();
});

it("limits automatic polling and allows a deliberate refresh", async () => {
  vi.useFakeTimers();
  const { act } = await import("@testing-library/react");
  const fetch = vi.fn().mockImplementation(async () => new Response(JSON.stringify(order)));
  vi.stubGlobal("fetch", fetch);
  try {
    await act(async () => { mount(); });
    await act(async () => { await vi.advanceTimersByTimeAsync(120000); });
    expect(fetch).toHaveBeenCalledTimes(12);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Atualizar pedido" })); });
    expect(fetch).toHaveBeenCalledTimes(13);
  } finally { cleanup(); vi.useRealTimers(); }
});
