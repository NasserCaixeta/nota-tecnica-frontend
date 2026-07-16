import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  it("renders the complete public landing content", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

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
