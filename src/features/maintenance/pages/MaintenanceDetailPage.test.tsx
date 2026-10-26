import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
import { MaintenanceDetailPage } from "./MaintenanceDetailPage";
import { serviceRecord } from "../../../test/maintenance";
it("confirms the displayed revision and asks to refresh on a conflict", async () => {
  let sent: unknown;
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
    if (options?.method === "POST") { sent = JSON.parse(String(options.body)); return new Response(JSON.stringify({ detail: "Review changed" }), { status: 409 }); }
    return new Response(JSON.stringify(url.endsWith("/maintenance-records/42") ? serviceRecord : []));
  }));
  render(<MemoryRouter initialEntries={["/app/manutencoes/42"]}><Routes><Route path="/app/manutencoes/:recordId" element={<MaintenanceDetailPage />} /></Routes></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", { name: "Confirmar serviço" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(/atualiz/i);
  expect(sent).toEqual({ revision_id: 8 });
});
