import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
import { WorkshopServicesPage } from "./WorkshopServicesPage";
import { serviceRecord } from "../../../test/maintenance";
it("loads the selected workshop's actual services and pending states", async () => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => new Response(JSON.stringify(url.endsWith("/workshops/7/maintenance-records") ? [serviceRecord] : []))));
  render(<MemoryRouter initialEntries={["/app/oficinas/7/servicos"]}><Routes><Route path="/app/oficinas/:workshopId/servicos" element={<WorkshopServicesPage />} /></Routes></MemoryRouter>);
  expect(await screen.findByRole("link", { name: /Troca de óleo/ })).toBeInTheDocument();
  expect(screen.getByText(/Aguardando confirmação/)).toBeInTheDocument();
});
