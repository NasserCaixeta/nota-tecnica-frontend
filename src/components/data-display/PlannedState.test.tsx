import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PlannedState } from "./PlannedState";

describe("PlannedState", () => {
  it("states that a feature is not available in this version", () => {
    render(<PlannedState title="Relatórios pagos" />);

    expect(screen.getByText(/ainda não está disponível/i)).toBeInTheDocument();
  });
});
