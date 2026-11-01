import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Select } from "./Select";
afterEach(cleanup);
it("associates label, help and validation error without requiring an explicit id", () => {
  render(<Select label="Situação" hint="Escolha uma opção" error="Campo obrigatório" aria-describedby="external"><option value="1">Uma</option></Select>);
  const control = screen.getByRole("combobox", { name: "Situação" });
  expect(control).toHaveAttribute("aria-invalid", "true");
  expect(control).toHaveAccessibleDescription("Escolha uma opção Campo obrigatório");
  expect(control.getAttribute("aria-describedby")).toContain("external");
});
