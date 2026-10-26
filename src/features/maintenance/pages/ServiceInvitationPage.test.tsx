import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
import { SessionContext } from "../../../lib/auth/SessionContext";
import { participant } from "../../../test/fixtures";
import { ServiceInvitationPage } from "./ServiceInvitationPage";
it("clears the URL fragment and waits for relationship validation", async () => {
  window.history.replaceState(null, "", "/convite-servico#opaque-invitation-token");
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ state: "relationship_required" }))));
  render(<SessionContext.Provider value={{ user: participant, status: "authenticated", error: null, refresh: async () => participant, logout: () => {} }}><MemoryRouter><ServiceInvitationPage /></MemoryRouter></SessionContext.Provider>);
  fireEvent.click(screen.getByRole("button", { name: "Retomar convite" }));
  expect(await screen.findByText(/validar seu vínculo/i)).toBeInTheDocument();
  expect(window.location.hash).toBe("");
  expect(screen.queryByText("Serviço confirmado")).not.toBeInTheDocument();
});
