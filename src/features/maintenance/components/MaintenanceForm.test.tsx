import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MaintenanceForm } from "./MaintenanceForm";

describe("MaintenanceForm", () => {
  it("renders cost fields separately", () => {
    render(<MaintenanceForm onSubmit={() => undefined} isSubmitting={false} />);

    expect(screen.getByLabelText(/Mão de obra/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Peças/i)).toBeInTheDocument();
  });
});
