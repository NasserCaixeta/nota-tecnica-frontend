import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { AccountPage } from "./AccountPage";
import { participant } from "../../../test/fixtures";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("records a closure request while preserving the account", async () => {
  const fetch = vi.fn().mockImplementation(async (url: string, options: RequestInit) => {
    if (url.endsWith("/users/me")) return new Response(JSON.stringify({ ...participant, phone: "11999990000" }));
    if (options.method === "POST") return new Response(JSON.stringify({ id: 1, user_id: 1, kind: "closure", reason: "Encerrar minha participação", status: "pending", created_at: "2026-10-27T12:00:00Z" }), { status: 201 });
    return new Response("[]");
  });
  vi.stubGlobal("fetch", fetch);
  render(<MemoryRouter><AccountPage /></MemoryRouter>);
  await screen.findByDisplayValue("Maria Driver");
  fireEvent.change(screen.getByLabelText("Motivo do encerramento"), { target: { value: "Encerrar minha participação" } });
  fireEvent.click(screen.getByRole("button", { name: "Solicitar encerramento" }));
  expect(await screen.findByText(/Solicitação registrada para análise administrativa/)).toBeInTheDocument();
  expect(fetch.mock.calls.some(([url, options]) => url.endsWith("/users/me/closure-requests") && options.method === "POST")).toBe(true);
  expect(screen.getByDisplayValue(participant.cpf)).toHaveAttribute("readonly");
});
