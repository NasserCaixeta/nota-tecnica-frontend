import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
import { MaintenanceReviewPage } from "./MaintenanceReviewPage";
import { serviceRecord } from "../../../test/maintenance";
it("opens a private receipt and sends the exact reviewed version", async () => {
  let sent: unknown;
  const document = { id: 9, file_name: "nota.pdf", storage_verified: true, review_status: "approved", review_version: 2 };
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
    if (url.endsWith("/documents/9/download")) return new Response(JSON.stringify({ url: "https://storage.test/signed", expires_at: "2026-06-15" }));
    if (options?.method === "PATCH") { sent = JSON.parse(String(options.body)); return new Response(JSON.stringify({ ...serviceRecord, admin_status: "approved" })); }
    return new Response(JSON.stringify({ ...serviceRecord, documents: [document] }));
  }));
  render(<MemoryRouter initialEntries={["/admin/servicos/42"]}><Routes><Route path="/admin/servicos/:recordId" element={<MaintenanceReviewPage />} /></Routes></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", { name: "Preparar nota.pdf" }));
  expect(await screen.findByRole("link", { name: /Abrir nota.pdf/ })).toHaveAttribute("href", "https://storage.test/signed");
  fireEvent.change(screen.getByLabelText("Justificativa"), { target: { value: "Comprovante conferido" } });
  fireEvent.change(screen.getByLabelText("Descrição pública revisada"), { target: { value: "Troca de óleo" } });
  fireEvent.click(screen.getByRole("button", { name: "Aprovar serviço" }));
  expect(await screen.findByText("Análise aprovada.")).toBeInTheDocument();
  expect(sent).toEqual({ revision_id: 8, expected_version: 3, decision: "approved", reason: "Comprovante conferido", public_description: "Troca de óleo" });
});
