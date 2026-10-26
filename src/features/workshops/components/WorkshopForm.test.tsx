import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WorkshopForm } from "./WorkshopForm";

describe("WorkshopForm", () => {
  it("renders CNPJ and trade name fields", () => {
    render(<WorkshopForm onSubmit={() => undefined} isSubmitting={false} />);

    expect(screen.getByLabelText(/CNPJ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome fantasia/i)).toBeInTheDocument();
  });
});


it("asks for the complete address required to validate a workshop", () => {
  render(<WorkshopForm onSubmit={() => undefined} isSubmitting={false} />);
  for (const label of ["CEP", "Rua", "Número", "Bairro"]) expect(screen.getByLabelText(label)).toBeRequired();
});
