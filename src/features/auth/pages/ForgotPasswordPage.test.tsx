import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("shows the neutral recovery response", async () => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => new Response(JSON.stringify({ message: "Se houver uma conta elegível, as instruções serão encaminhadas." }), { status: 202 })));
  render(<MemoryRouter><ForgotPasswordPage /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "unknown@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: "Solicitar recuperação" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Se houver uma conta elegível");
});
