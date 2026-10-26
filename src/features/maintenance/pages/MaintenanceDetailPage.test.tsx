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
it("renders a published-only history view without private fields or actions", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ visibility: "published", id: 42, service_date: "2026-06-15", odometer: 50000, category: "mechanical", vehicle_system: "engine", public_description: "Descrição conferida sem dados pessoais", workshop: null, labor_cost: "120.00", parts_cost: "180.00", total_cost: "300.00" }))));
  render(<MemoryRouter initialEntries={["/app/manutencoes/42"]}><Routes><Route path="/app/manutencoes/:recordId" element={<MaintenanceDetailPage />} /></Routes></MemoryRouter>);
  expect(await screen.findByText("Descrição conferida sem dados pessoais")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Confirmar serviço" })).not.toBeInTheDocument();
  expect(screen.queryByText("Comprovantes privados")).not.toBeInTheDocument();
});
it("uses server submission permission when another representative owns the receipt", async () => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => new Response(JSON.stringify(url.endsWith("/maintenance-records/42") ? { ...serviceRecord, permissions: { ...serviceRecord.permissions, can_edit: true, can_submit: true } } : []))));
  render(<MemoryRouter initialEntries={["/app/manutencoes/42"]}><Routes><Route path="/app/manutencoes/:recordId" element={<MaintenanceDetailPage />} /></Routes></MemoryRouter>);
  expect(await screen.findByRole("button", { name: "Enviar para análise" })).toBeEnabled();
});
it("saves a customer's optional rating for the displayed published revision", async () => {
  let sent: unknown;
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
    if (options?.method === "PUT") { sent = JSON.parse(String(options.body)); return new Response(JSON.stringify({ id: 1, record_id: 42, revision_id: 8, stars: 4, comment: "Bom atendimento", comment_hidden: false, review_version: 1 })); }
    if (url.endsWith("/review")) return new Response("null");
    return new Response(JSON.stringify(url.endsWith("/maintenance-records/42") ? { ...serviceRecord, published: true, permissions: { ...serviceRecord.permissions, can_review: true } } : []));
  }));
  render(<MemoryRouter initialEntries={["/app/manutencoes/42"]}><Routes><Route path="/app/manutencoes/:recordId" element={<MaintenanceDetailPage />} /></Routes></MemoryRouter>);
  fireEvent.change(await screen.findByLabelText("Nota de 1 a 5 estrelas"), { target: { value: "4" } });
  fireEvent.change(screen.getByLabelText("Comentário (opcional)"), { target: { value: "Bom atendimento" } });
  fireEvent.click(screen.getByRole("button", { name: "Salvar avaliação" }));
  expect(await screen.findByText("Avaliação salva.")).toBeInTheDocument();
  expect(sent).toEqual({ revision_id: 8, stars: 4, comment: "Bom atendimento" });
});
