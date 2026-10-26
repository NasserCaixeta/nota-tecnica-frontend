import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";

beforeEach(() => vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ score_version: "pilot_v1", score_explanation: "Fórmula do piloto", items: [], unranked_items: [] })))));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("App", () => {
  it("renders the public product shell", async () => {
    render(<App />);

    expect(await screen.findByText("Nenhuma oficina com amostra suficiente neste momento.")).toBeInTheDocument();
    expect(screen.getAllByText(/Nota Técnica/i).length).toBeGreaterThanOrEqual(1);
  });
});
