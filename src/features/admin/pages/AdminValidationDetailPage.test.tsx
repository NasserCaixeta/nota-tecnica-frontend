import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { AdminValidationDetailPage } from "./AdminValidationDetailPage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("loads review directly and approves evidence before the current vehicle revision", async () => {
  let evidenceApproved = false; let vehicleApproved = false;
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
    if (url.endsWith("/documents/3/review")) {
      const payload = JSON.parse(String(options?.body));
      if (payload.expected_version !== 1) return new Response("Stale", { status: 409 });
      evidenceApproved = true; return new Response('{"id":3,"review_version":2}');
    }
    if (url.endsWith("/vehicle-links/10/review")) {
      const payload = JSON.parse(String(options?.body));
      if (!evidenceApproved || payload.expected_version !== 2) return new Response("Stale", { status: 409 });
      vehicleApproved = true;
    }
    if (!url.includes("/vehicle-links/10")) return new Response("Missing", { status: 404 });
    return new Response(JSON.stringify({ vehicle_link_id: 10, vehicle_id: 1, user_id: 1, user_full_name: "Maria Driver", plate: "ABC1D23", review_version: evidenceApproved ? 2 : 1, garage_status: vehicleApproved ? "active" : "under_review", required_documents: ["crlv"], uploaded_documents: ["crlv"], missing_documents: [], approved_documents: evidenceApproved ? ["crlv"] : [], documents: [{ id: 3, validation_document_type: "crlv", file_name: "crlv.pdf", review_status: evidenceApproved ? "approved" : "pending", review_version: evidenceApproved ? 2 : 1, storage_verified: true }] }));
  }));
  render(<MemoryRouter initialEntries={["/review/10"]}><Routes><Route path="/review/:vehicleLinkId" element={<AdminValidationDetailPage />} /></Routes></MemoryRouter>);
  expect(await screen.findByText("Maria Driver")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Aprovar" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Aprovar documento CRLV" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Aprovar" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Aprovar" }));
  expect(await screen.findByText("Vínculo aprovado.")).toBeInTheDocument();
  expect(vehicleApproved).toBe(true);
});
