import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
import { ServiceDisputesPage } from "./ServiceDisputesPage";
it("shows customer refusal and records a reasoned resolution without confirming service", async () => {
  let sent: unknown;
  const dispute = { id: 1, record_id: 42, revision_id: 8, reason: "Peça incorreta", review_version: 1, status: "open", documents: [], messages: [] };
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (_url: string, options?: RequestInit) => {
    if (options?.method === "PATCH") { sent = JSON.parse(String(options.body)); return new Response(JSON.stringify({ ...dispute, status: "closed" })); }
    return new Response(JSON.stringify([dispute]));
  }));
  render(<MemoryRouter><ServiceDisputesPage /></MemoryRouter>);
  expect(await screen.findByText("Peça incorreta")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Justificativa da decisão 1"), { target: { value: "Encerrada com recusa preservada" } });
  fireEvent.click(screen.getByRole("button", { name: "Encerrar análise" }));
  expect(await screen.findByText("Decisão registrada; reconhecimento do cliente preservado.")).toBeInTheDocument();
  expect(sent).toEqual({ expected_version: 1, resolution: "resolved", reason: "Encerrada com recusa preservada" });
});
