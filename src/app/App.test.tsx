import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("renders the public product shell", () => {
    render(<App />);

    expect(screen.getAllByText(/Nota Técnica/i).length).toBeGreaterThanOrEqual(1);
  });
});
