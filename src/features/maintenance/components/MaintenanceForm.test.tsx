import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MaintenanceForm } from "./MaintenanceForm";

describe("MaintenanceForm", () => {
  it("renders cost fields separately", () => {
    render(<MaintenanceForm onSubmit={() => undefined} isSubmitting={false} />);

    expect(screen.getByLabelText(/Mão de obra/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Peças/i)).toBeInTheDocument();
  });
});


afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("sends service date, category, system and decimal strings to the real API contract", async () => {
  const { createVehicleMaintenance } = await import("../../../lib/api/maintenance");
  let sent: Record<string, unknown> | null = null;
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
    if (url.endsWith("/vehicles/11/maintenance-records")) {
      sent = JSON.parse(String(options?.body));
      return new Response(JSON.stringify({ id: 42 }), { status: 201 });
    }
    return new Response(JSON.stringify({ detail: "Wrong endpoint" }), { status: 404 });
  }));
  render(<MaintenanceForm isSubmitting={false} onSubmit={async payload => { await createVehicleMaintenance("11", payload); }} />);
  fireEvent.change(screen.getByLabelText("Descrição"), { target: { value: "Troca de óleo" } });
  fireEvent.change(screen.getByLabelText("Data do serviço"), { target: { value: "2026-06-15" } });
  fireEvent.change(screen.getByLabelText("Quilometragem"), { target: { value: "50000" } });
  fireEvent.change(screen.getByLabelText("Categoria"), { target: { value: "mechanical" } });
  fireEvent.change(screen.getByLabelText("Sistema do veículo"), { target: { value: "engine" } });
  fireEvent.change(screen.getByLabelText("Mão de obra"), { target: { value: "120.00" } });
  fireEvent.change(screen.getByLabelText("Peças"), { target: { value: "180.00" } });
  fireEvent.click(screen.getByRole("button", { name: "Salvar manutenção" }));
  await waitFor(() => expect(sent).toMatchObject({ description: "Troca de óleo", service_date: "2026-06-15", category: "mechanical", vehicle_system: "engine", odometer: 50000, labor_cost: "120.00", parts_cost: "180.00" }));
});
