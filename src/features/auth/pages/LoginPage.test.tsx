import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";
import { participant } from "../../../test/fixtures";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); window.sessionStorage.clear(); window.localStorage.clear(); });
it("returns to the captured invitation after login", async () => {
  window.sessionStorage.setItem("nota-tecnica.invitation.pending", "captured-secret");
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => new Response(JSON.stringify(url.endsWith("/auth/login") ? { access_token: "token", token_type: "bearer" } : participant))));
  render(<MemoryRouter initialEntries={["/entrar"]}><Routes><Route path="/entrar" element={<LoginPage />} /><Route path="/convite-servico" element={<p>Convite retomado</p>} /><Route path="/app/garagem" element={<p>Garagem</p>} /></Routes></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "driver@example.com" } });
  fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "strong-password" } });
  fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
  expect(await screen.findByText("Convite retomado")).toBeInTheDocument();
});

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
