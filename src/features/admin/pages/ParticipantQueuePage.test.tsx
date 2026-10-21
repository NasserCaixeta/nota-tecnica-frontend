import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { routes } from "../../../app/router";
import { participant } from "../../../test/fixtures";
import { setStoredToken } from "../../../lib/auth/token-storage";

afterEach(() => { cleanup(); window.localStorage.clear(); vi.unstubAllGlobals(); });
it("approves a pending participant with the current version and reason", async () => {
  setStoredToken("admin");
  let approved = false;
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
    if (url.endsWith("/users/me")) return new Response(JSON.stringify({ ...participant, id: 2, is_admin: true, capabilities: ["customer", "admin"] }));
    if (url.endsWith("/participants/1/review") && options?.method === "PATCH") {
      const body = JSON.parse(String(options.body));
      if (body.expected_version !== 1 || body.decision !== "approved" || !body.reason.trim()) return new Response("Invalid review", { status: 422 });
      approved = true;
      return new Response(JSON.stringify({ ...participant, participation_version: 2 }));
    }
    return new Response(JSON.stringify(approved ? [] : [{ ...participant, participation_status: "pending" }]));
  }));
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ["/admin/participantes"] })} />);
  expect(await screen.findByText("Maria Driver")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Justificativa para Maria Driver"), { target: { value: "Participante do piloto" } });
  fireEvent.click(screen.getByRole("button", { name: "Aprovar Maria Driver" }));
  expect(await screen.findByText("Nenhum participante nesta fila.")).toBeInTheDocument();
});
