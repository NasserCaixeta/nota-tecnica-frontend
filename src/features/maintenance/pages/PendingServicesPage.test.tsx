import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
import { PendingServicesPage } from "./PendingServicesPage";
import { serviceRecord } from "../../../test/maintenance";
it("lists customer services awaiting explicit confirmation", async () => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => new Response(JSON.stringify(url.endsWith("/customer-services/pending") ? [serviceRecord] : []))));
  render(<MemoryRouter><PendingServicesPage /></MemoryRouter>);
  expect(await screen.findByRole("link", { name: /Troca de óleo/ })).toHaveAttribute("href", "/app/manutencoes/42");
});
