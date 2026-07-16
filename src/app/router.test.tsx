import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { routes } from "./router";

describe("router", () => {
  it("renders the landing route", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("heading", { name: /Oficinas ranqueadas/i })).toBeInTheDocument();
    expect(screen.getByText(/Oficinas em destaque/i)).toBeInTheDocument();
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
  });

  it("renders public auth links outside the landing route", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/consultar"] });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("link", { name: /Entrar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Cadastro/i })).toBeInTheDocument();
  });
});
