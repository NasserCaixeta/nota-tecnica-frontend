import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { NotificationsPage } from "./NotificationsPage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("shows the recipients pending action and marks it read", async () => {
  const notification = { id: 7, kind: "participation_updated", title: "Participação analisada", body: "Confira a decisão na sua conta.", link: "/app/participacao", created_at: "2026-10-27T12:00:00Z", read_at: null };
  const fetch = vi.fn().mockImplementation(async (url: string) => new Response(JSON.stringify(url.endsWith("/read") ? { ...notification, read_at: "2026-10-27T12:01:00Z" } : [notification])));
  vi.stubGlobal("fetch", fetch);
  render(<MemoryRouter><NotificationsPage /></MemoryRouter>);
  expect(await screen.findByText("Participação analisada")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ver pendência" })).toHaveAttribute("href", "/app/participacao");
  fireEvent.click(screen.getByRole("button", { name: "Marcar como lida" }));
  expect(await screen.findByText("Lida")).toBeInTheDocument();
  expect(fetch.mock.calls.some(([url, options]) => url.endsWith("/notifications/7/read") && options.method === "POST")).toBe(true);
});
