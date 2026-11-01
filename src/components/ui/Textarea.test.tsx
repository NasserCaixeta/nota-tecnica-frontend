import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Textarea } from "./Textarea";
afterEach(cleanup);
it("provides an accessible multiline decision field and honors disabled state", () => {
 render(<Textarea label="Justificativa" hint="Descreva a decisão" error="Informe o motivo" disabled />);
 const field=screen.getByRole("textbox",{name:"Justificativa"});
 expect(field).toBeDisabled();
 expect(field).toHaveAttribute("aria-invalid","true");
 expect(field).toHaveAccessibleDescription("Descreva a decisão Informe o motivo");
});
