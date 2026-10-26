import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { serviceRecord } from "../../../test/maintenance";
import { ServiceAssociationsPage } from "./ServiceAssociationsPage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("resolves an explicit association using both displayed revisions", async () => {
  let sent: unknown;
  const second = { ...serviceRecord, id: 43, current_revision_id: 9 };
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (_url: string, options?: RequestInit) => {
    if (options?.method === "POST") { sent = JSON.parse(String(options.body)); return new Response(JSON.stringify(serviceRecord)); }
    return new Response(JSON.stringify([{ id: 1, reason: "Mesma nota", record: serviceRecord, other_record: second }]));
  }));
  render(<MemoryRouter><ServiceAssociationsPage /></MemoryRouter>);
  expect(await screen.findByText("Mesma nota")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Justificativa da associação 1"), { target: { value: "Comprovantes conferidos" } });
  fireEvent.click(screen.getByRole("button", { name: "Consolidar atendimentos" }));
  expect(await screen.findByText(/Associação registrada/)).toBeInTheDocument();
  expect(sent).toEqual({ revision_id: 8, other_record_id: 43, other_revision_id: 9, reason: "Comprovantes conferidos" });
});
