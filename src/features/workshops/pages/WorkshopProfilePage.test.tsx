import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { WorkshopProfilePage } from "./WorkshopProfilePage";
import { rankingResponse, rankingItem } from "../../../test/ranking";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("shows no-data performance without a fabricated workshop grade", async () => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => new Response(JSON.stringify(url.endsWith("/performance") ? { score_version: "pilot_v1", score_explanation: rankingResponse.score_explanation, metrics: { ...rankingItem, completed_services_count: 0, score: null, sample_label: "no_data", eligible_for_ranking: false, review_count: 0, measured_deadline_count: 0, on_time_rate: null }, reviews: [] } : { id: 7, trade_name: "Oficina Conferida", legal_name: "Oficina Ltda", city: "São Paulo", state: "SP", cnpj: "04252011000110", verification_status: "verified", specialties: [], phone: "1133334444", email: "contato@office.test" }))));
  render(<MemoryRouter initialEntries={["/oficinas/7"]}><Routes><Route path="/oficinas/:workshopId" element={<WorkshopProfilePage />} /></Routes></MemoryRouter>);
  expect(await screen.findByText("Sem dados publicados")).toBeInTheDocument();
  expect(screen.getByText("Sem nota disponível")).toBeInTheDocument();
});
