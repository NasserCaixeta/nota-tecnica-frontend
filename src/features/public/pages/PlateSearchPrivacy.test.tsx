import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { PlateSearchPage } from "./PlateSearchPage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("removes an earlier preview when the next request fails", async () => {
  let request = 0;
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => {
    request++;
    return request === 1 ? new Response(JSON.stringify({ plate: "ABC1D23", vehicle_found: true, maintenance_count: 1, categories: ["mechanical"], distinct_workshop_count: 1, first_maintenance_date: "2026-06-15", last_maintenance_date: "2026-06-15", completeness_score: "low" })) : new Response(JSON.stringify({ detail: "Temporariamente indisponível" }), { status: 503 });
  }));
  render(<PlateSearchPage />);
  fireEvent.change(screen.getByLabelText("Placa do veículo"), { target: { value: "ABC1D23" } });
  fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
  expect(await screen.findByText("Prévia técnica disponível")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Placa do veículo"), { target: { value: "XYZ9A87" } });
  fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(screen.queryByText("Prévia técnica disponível")).not.toBeInTheDocument();
});
