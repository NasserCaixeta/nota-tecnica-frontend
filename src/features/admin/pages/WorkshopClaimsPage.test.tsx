import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { WorkshopClaimsPage } from "./WorkshopClaimsPage";
import type { WorkshopClaimRead } from "../../../lib/api/workshops";

const claim: WorkshopClaimRead = {
  id: 7, workshop_id: 4, user_id: 2, user_full_name: "Responsável de testes",
  trade_name: "Oficina de testes", cnpj: "11222333000181", status: "pending",
  review_version: 1, reason: null, documents: [],
};
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("recovers a populated workshop queue after an initial request fails", async () => {
  const fetch = vi.fn().mockResolvedValueOnce(json({ detail: "Indisponível" }, 503)).mockResolvedValueOnce(json([claim]));
  vi.stubGlobal("fetch", fetch);
  render(<WorkshopClaimsPage />);
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(screen.queryByText("Nenhuma solicitação pendente.")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Atualizar fila" }));
  expect(await screen.findByRole("heading", { name: claim.trade_name })).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(2);
});

it("recovers after a conflict and submits the refreshed claim version", async () => {
  const versions: number[] = [];
  let accepted = false;
  vi.stubGlobal("fetch", vi.fn(async (url: string, options?: RequestInit) => {
    if (url.endsWith("/admin/workshop-claims/7/review") && options?.method === "PATCH") {
      const body = JSON.parse(String(options.body));
      versions.push(body.expected_version);
      if (versions.length === 1) return json({ detail: "Versão alterada. Atualize a fila." }, 409);
      accepted = true;
      return json({ ...claim, review_version: 3, status: "rejected" });
    }
    if (url.endsWith("/admin/workshop-claims")) return json(accepted ? [] : [{ ...claim, review_version: versions.length ? 2 : 1 }]);
    throw new Error("Unexpected test request");
  }));
  render(<WorkshopClaimsPage />);
  await screen.findByRole("heading", { name: claim.trade_name });
  fireEvent.change(screen.getByLabelText(`Justificativa da análise de ${claim.trade_name}`), { target: { value: "Documentos insuficientes" } });
  fireEvent.click(screen.getByRole("button", { name: "Recusar representação" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Versão alterada");
  fireEvent.click(screen.getByRole("button", { name: "Atualizar fila" }));
  await screen.findByRole("heading", { name: claim.trade_name });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Recusar representação" }));
  expect(await screen.findByText("Nenhuma solicitação pendente.")).toBeInTheDocument();
  expect(versions).toEqual([1, 2]);
});
