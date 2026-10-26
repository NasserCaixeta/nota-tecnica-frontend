import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { GarageVehicleDocumentsPage } from "./GarageVehicleDocumentsPage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("uploads the required evidence and submits a real vehicle review", async () => {
  let confirmed = false; let submitted = false;
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
    if (url.startsWith("https://upload.test")) return new Response(null, { status: 200 });
    if (url.endsWith("/upload-intents")) return new Response(JSON.stringify({ document: { id: 3 }, upload_url: "https://upload.test/file", required_headers: { "Content-Type": "application/pdf" } }));
    if (url.endsWith("/confirm-upload")) { confirmed = true; return new Response('{"id":3}'); }
    if (url.endsWith("/submit-review") && options?.method === "POST") { submitted = true; return new Response('{"garage_status":"under_review"}'); }
    return new Response(JSON.stringify({ vehicle_id: 1, vehicle_link_id: 10, plate: "ABC1D23", garage_status: submitted ? "under_review" : "pending_documents", permissions: { can_upload_documents: !submitted, can_submit_review: confirmed && !submitted }, documents: { required: ["crlv"], uploaded: confirmed ? ["crlv"] : [], missing: confirmed ? [] : ["crlv"], awaiting_review: confirmed ? ["crlv"] : [], approved: [], rejected: [] } }));
  }));
  render(<MemoryRouter initialEntries={["/vehicles/1/documents"]}><Routes><Route path="/vehicles/:vehicleId/documents" element={<GarageVehicleDocumentsPage />} /></Routes></MemoryRouter>);
  const input = await screen.findByLabelText("Arquivo para CRLV");
  fireEvent.change(input, { target: { files: [new File(["%PDF-1.7"], "crlv.pdf", { type: "application/pdf" })] } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Enviar para análise" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Enviar para análise" }));
  expect(await screen.findByText("Veículo enviado para análise.")).toBeInTheDocument();
  expect(confirmed && submitted).toBe(true);
});
