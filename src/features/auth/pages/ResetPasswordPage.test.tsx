import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { ResetPasswordPage } from "./ResetPasswordPage";
import { setStoredToken, getStoredToken } from "../../../lib/auth/token-storage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); window.localStorage.clear(); });
it("uses the fragment token and requires a fresh login after reset", async () => {
  setStoredToken("old-session");
  const fetch = vi.fn().mockImplementation(async () => new Response(JSON.stringify({ message: "Senha alterada. Entre novamente com a nova senha." })));
  vi.stubGlobal("fetch", fetch);
  render(<MemoryRouter initialEntries={["/redefinir-senha#opaque-reset-token"]}><ResetPasswordPage /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Nova senha"), { target: { value: "new-strong-password" } });
  fireEvent.change(screen.getByLabelText("Confirme a nova senha"), { target: { value: "new-strong-password" } });
  fireEvent.click(screen.getByRole("button", { name: "Alterar senha" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Senha alterada");
  expect(getStoredToken()).toBeNull();
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ token: "opaque-reset-token", new_password: "new-strong-password" });
  expect(new Headers(fetch.mock.calls[0][1].headers).has("Authorization")).toBe(false);
});
