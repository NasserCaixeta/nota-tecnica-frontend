import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { StateBlock } from "./StateBlock";
afterEach(cleanup);
it("distinguishes a failed request and offers recovery", () => {
 const retry=vi.fn(); render(<StateBlock kind="error" title="Falha ao carregar" onRetry={retry} />);
 expect(screen.getByRole("alert")).toHaveTextContent("Falha ao carregar");
 fireEvent.click(screen.getByRole("button",{name:"Tentar novamente"})); expect(retry).toHaveBeenCalledOnce();
});
it("announces asynchronous loading",()=>{render(<StateBlock kind="loading" title="Carregando" />);expect(screen.getByRole("status")).toHaveTextContent("Carregando");});
