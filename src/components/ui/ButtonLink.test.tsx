import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it } from "vitest";
import { ButtonLink } from "./ButtonLink";
afterEach(cleanup);
it("keeps navigation as a single link without a nested button", () => {
 render(<MemoryRouter><ButtonLink to="/app/garagem/novo">Adicionar veículo</ButtonLink></MemoryRouter>);
 expect(screen.getByRole("link",{name:"Adicionar veículo"})).toHaveAttribute("href","/app/garagem/novo");
 expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
