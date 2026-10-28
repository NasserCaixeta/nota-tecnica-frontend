import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { GarageDashboardPage } from "./GarageDashboardPage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("does not disguise an access error as an empty garage", async () => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => new Response('{"detail":"Acesso suspenso"}', { status: 403 })));
  render(<MemoryRouter><GarageDashboardPage /></MemoryRouter>);
  expect(await screen.findByRole("alert")).toHaveTextContent("Acesso suspenso");
  expect(screen.queryByText("Garagem vazia")).not.toBeInTheDocument();
});

it("persists the chosen free vehicle through the server", async () => {
  let selected = 1;
  const vehicles = [1, 2].map((id) => ({ vehicle_id: id, vehicle_link_id: id, plate: id === 1 ? "ABC1D23" : "DEF2E34", brand: "Marca", model: "Modelo", model_year: 2020, garage_status: "active", documents: { missing: [] } }));
  const fetch = vi.fn().mockImplementation(async (_url: string, options: RequestInit) => {
    if (options.method === "PATCH") selected = JSON.parse(String(options.body)).vehicle_id;
    return new Response(JSON.stringify({ summary: { total: 2, active: 2, under_review: 0, pending_documents: 0 }, vehicles: vehicles.map((vehicle) => ({ ...vehicle, commercial_access: selected === vehicle.vehicle_id ? "free" : "read_only" })) }));
  });
  vi.stubGlobal("fetch", fetch);
  render(<MemoryRouter><GarageDashboardPage /></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", { name: "Usar DEF2E34 como gratuito" }));
  expect(await screen.findByRole("button", { name: "Usar ABC1D23 como gratuito" })).toBeInTheDocument();
  expect(fetch.mock.calls.some(([url, options]) => url.endsWith("/garage/free-vehicle") && options.method === "PATCH" && options.body === '{"vehicle_id":2}')).toBe(true);
});
