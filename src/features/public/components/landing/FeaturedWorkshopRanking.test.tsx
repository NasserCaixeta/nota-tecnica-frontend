import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { FeaturedWorkshopRanking } from "./FeaturedWorkshopRanking";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("shows an honest empty ranking instead of demonstration workshops", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ score_version: "pilot_v1", score_explanation: "Fórmula do piloto", items: [], unranked_items: [] }))));
  render(<MemoryRouter><FeaturedWorkshopRanking /></MemoryRouter>);
  expect(await screen.findByText("Nenhuma oficina com amostra suficiente neste momento.")).toBeInTheDocument();
  expect(screen.queryByText("Auto Performance SP")).not.toBeInTheDocument();
  expect(screen.queryByText("Retrabalho")).not.toBeInTheDocument();
});
