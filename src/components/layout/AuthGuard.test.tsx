import { cleanup, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { routes } from "../../app/router";
import { participant } from "../../test/fixtures";
import { setStoredToken } from "../../lib/auth/token-storage";

afterEach(() => { cleanup(); window.localStorage.clear(); vi.unstubAllGlobals(); });

it("resolves an expired stored token to the login page", async () => {
  setStoredToken("expired");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"detail":"Expired"}', { status: 401 })));
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ["/app/garagem"] })} />);
  expect(await screen.findByRole("heading", { name: "Entrar na conta" })).toBeInTheDocument();
});
it("keeps a pending participant on the participation page", async () => {
  setStoredToken("pending");
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => new Response(JSON.stringify({
    ...participant, participation_status: "pending", capabilities: [],
  }))));
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ["/app/oficinas"] })} />);
  expect(await screen.findByRole("heading", { name: "Participação no piloto" })).toBeInTheDocument();
});
it("does not show administrative queues to a common participant", async () => {
  setStoredToken("customer");
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => new Response(JSON.stringify(participant))));
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ["/admin/validacoes"] })} />);
  expect(await screen.findByRole("heading", { name: "Acesso restrito" })).toBeInTheDocument();
});
