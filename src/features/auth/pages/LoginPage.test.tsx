import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("renders a structured login experience", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Entrar na conta/i })).toBeInTheDocument();
    expect(screen.getByText(/Garagem validada/i)).toBeInTheDocument();
    expect(screen.getByText(/Histórico por placa/i)).toBeInTheDocument();
    expect(screen.getByText(/Ainda não tem conta/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /E-mail/i })).toBeInTheDocument();
  });
});
