import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../../lib/api/public", () => ({
  getVehicleHistoryPreview: vi.fn().mockResolvedValue({
    plate: "ABC1D23",
    vehicle_found: true,
    maintenance_count: 2,
    first_maintenance_date: "2025-01-01",
    last_maintenance_date: "2026-01-01",
    categories: ["mechanical"],
    distinct_workshop_count: 1,
    completeness_score: "low",
  }),
}));

import { PlateSearchPage } from "./PlateSearchPage";

describe("PlateSearchPage", () => {
  it("renders a structured plate search experience", () => {
    render(<PlateSearchPage />);

    expect(screen.getByRole("heading", { name: /Consultar histórico por placa/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Placa do veículo/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Prévia gratuita/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/O que a consulta mostra/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Volume de registros/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Completude do histórico/i })).toBeInTheDocument();
  });
});
