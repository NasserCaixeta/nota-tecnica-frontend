import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusPill } from "./StatusPill";

describe("StatusPill", () => {
  it("renders a status label", () => {
    render(<StatusPill tone="warning">Em análise</StatusPill>);

    expect(screen.getByText("Em análise")).toBeInTheDocument();
  });
});
