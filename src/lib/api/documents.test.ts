import { afterEach, expect, it, vi } from "vitest";
import { uploadValidationDocument } from "./documents";
afterEach(() => vi.unstubAllGlobals());
it("does not confirm an upload when the storage PUT fails", async () => {
  let confirmed = false;
  vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => {
    if (url.startsWith("https://upload.test")) return new Response("Forbidden", { status: 403 });
    if (url.endsWith("/confirm-upload")) { confirmed = true; return new Response("{}"); }
    return new Response(JSON.stringify({ document: { id: 1 }, upload_url: "https://upload.test/file", required_headers: { "Content-Type": "application/pdf" } }));
  }));
  await expect(uploadValidationDocument({ vehicleLinkId: 1, documentType: "crlv", validationDocumentType: "crlv", file: new File(["%PDF-1.7"], "crlv.pdf", { type: "application/pdf" }) })).rejects.toThrow();
  expect(confirmed).toBe(false);
});
