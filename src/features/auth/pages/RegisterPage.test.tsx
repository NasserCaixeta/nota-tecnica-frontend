import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { RegisterPage } from "./RegisterPage";

describe("RegisterPage", () => {
  it("renders a structured registration experience", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Criar conta/i })).toBeInTheDocument();
    expect(screen.getByText(/Dados pessoais/i)).toBeInTheDocument();
    expect(screen.getByText(/Endereço/i)).toBeInTheDocument();
    expect(screen.getByText(/Garagem validada/i)).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Admin/i })).not.toBeInTheDocument();
  });
});
