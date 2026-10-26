import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { WorkshopRankingPage } from "./WorkshopRankingPage";
import { rankingResponse, rankingItem } from "../../../test/ranking";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("shows real scores and sends the chosen city, state and category filters", async () => {
  let lastUrl = "";
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => { lastUrl = url; return new Response(JSON.stringify(rankingResponse)); }));
  render(<MemoryRouter><WorkshopRankingPage /></MemoryRouter>);
  expect(await screen.findByText("7,4 / 10")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Cidade"), { target: { value: "São Paulo" } });
  fireEvent.change(screen.getByLabelText("UF"), { target: { value: "SP" } });
  fireEvent.change(screen.getByLabelText("Categoria"), { target: { value: "mechanical" } });
  fireEvent.click(screen.getByRole("button", { name: "Aplicar filtros" }));
  await waitFor(() => { const query = new URL(lastUrl).searchParams; expect(query.get("city")).toBe("São Paulo"); expect(query.get("state")).toBe("SP"); expect(query.get("category")).toBe("mechanical"); });
});
it("keeps a four-service sample outside the main ranking and never invents a score", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ...rankingResponse, items: [], unranked_items: [{ ...rankingItem, completed_services_count: 4, score: null, eligible_for_ranking: false, sample_label: "small_sample" }] }))));
  render(<MemoryRouter><WorkshopRankingPage /></MemoryRouter>);
  expect(await screen.findByText("Amostra pequena")).toBeInTheDocument();
  expect(screen.getByText("Sem nota disponível")).toBeInTheDocument();
  expect(screen.queryByText("7,4 / 10")).not.toBeInTheDocument();
});
