import { cleanup, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { routes } from "./router";

beforeEach(() => vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ score_version: "pilot_v1", score_explanation: "Fórmula do piloto", items: [], unranked_items: [] })))));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("router", () => {
  it("renders the landing route", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Nenhuma oficina com amostra suficiente neste momento.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Oficinas ranqueadas/i })).toBeInTheDocument();
    expect(screen.getByText(/Oficinas em destaque/i)).toBeInTheDocument();
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
  });

  it("renders public auth links outside the landing route", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/consultar"] });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("link", { name: /Entrar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Cadastro/i })).toBeInTheDocument();
  });
});
