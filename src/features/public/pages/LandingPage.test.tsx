import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LandingPage } from "./LandingPage";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe("LandingPage", () => {
  it("renders the complete public landing content", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ score_version: "pilot_v1", score_explanation: "Fórmula do piloto", items: [], unranked_items: [] }))));
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Nenhuma oficina com amostra suficiente neste momento.")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: /placa/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ir para consulta por placa/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Cadastro/i })).toBeInTheDocument();
    expect(screen.getByText(/Como funciona/i)).toBeInTheDocument();
    expect(screen.getByText(/Oficinas em destaque/i)).toBeInTheDocument();
    expect(screen.getByText(/Para donos e compradores/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Para oficinas/i)).toHaveLength(2);
    expect(screen.getAllByText(/Nota Técnica/i).length).toBeGreaterThanOrEqual(1);
  });
});
