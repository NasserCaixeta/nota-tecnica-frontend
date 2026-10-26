import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { ServiceReviewsPage } from "./ServiceReviewsPage";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("moderates only the comment and preserves the customer's stars", async () => {
  let hidden = false; let sent: unknown;
  const review = { id: 1, record_id: 42, revision_id: 8, stars: 4, comment: "Comentário para analisar", comment_hidden: false, review_version: 1 };
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
    if (url.endsWith("/admin/service-reviews/1") && options?.method === "PATCH") { sent = JSON.parse(String(options.body)); hidden = true; return new Response(JSON.stringify({ ...review, comment_hidden: true, review_version: 2 })); }
    return new Response(JSON.stringify([{ ...review, comment_hidden: hidden, review_version: hidden ? 2 : 1 }]));
  }));
  render(<MemoryRouter><ServiceReviewsPage /></MemoryRouter>);
  expect(await screen.findByText("Comentário para analisar")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Justificativa para o comentário 1"), { target: { value: "Remover informação pessoal" } });
  fireEvent.click(screen.getByRole("button", { name: "Ocultar comentário" }));
  await waitFor(() => expect(screen.getByText(/4 estrelas · Comentário oculto/)).toBeInTheDocument());
  expect(sent).toEqual({ expected_version: 1, comment_hidden: true, reason: "Remover informação pessoal" });
});
