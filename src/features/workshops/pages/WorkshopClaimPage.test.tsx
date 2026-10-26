import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { WorkshopClaimPage } from "./WorkshopClaimPage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("requests representation of an existing CNPJ and asks for proof", async () => {
  let requested = false;
  const claim = { id: 1, workshop_id: 7, trade_name: "Oficina Central", cnpj: "04252011000110", status: "pending", documents: [], review_version: 1 };
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
    if (url.includes("/lookup?")) return new Response(JSON.stringify({ id: 7, cnpj: claim.cnpj, trade_name: claim.trade_name }));
    if (url.endsWith("/workshops/7/claims") && options?.method === "POST") { requested = true; return new Response(JSON.stringify(claim), { status: 201 }); }
    return new Response(JSON.stringify(requested ? [claim] : []));
  }));
  render(<MemoryRouter><WorkshopClaimPage /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("CNPJ da oficina"), { target: { value: "04252011000110" } });
  fireEvent.click(screen.getByRole("button", { name: "Buscar oficina" }));
  fireEvent.click(await screen.findByRole("button", { name: "Solicitar representação" }));
  expect(await screen.findByLabelText("Arquivo para Contrato social ou procuração")).toBeInTheDocument();
  expect(requested).toBe(true);
});
