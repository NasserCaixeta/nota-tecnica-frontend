import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Input } from "./Input";
afterEach(cleanup);
it("associates label, help and validation error without requiring an explicit id", () => {
  render(<Input label="Situação" hint="Escolha uma opção" error="Campo obrigatório" aria-describedby="external"></Input>);
  const control = screen.getByRole("textbox", { name: "Situação" });
  expect(control).toHaveAttribute("aria-invalid", "true");
  expect(control).toHaveAccessibleDescription("Escolha uma opção Campo obrigatório");
  expect(control.getAttribute("aria-describedby")).toContain("external");
});
