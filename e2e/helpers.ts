import { expect, type APIRequestContext, type Page } from "@playwright/test";
export const api = "http://127.0.0.1:8009/api/v1";
export const pdf = { name: "synthetic.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\nsynthetic proof\n%%EOF") };
const tokens = new Map<string, string>();
export async function login(request: APIRequestContext, email: string) {
  if (tokens.has(email)) return tokens.get(email)!;
  const response = await request.post(`${api}/auth/login`, { data: { email, password: "strong-password" } });
  expect(response.status()).toBe(200);
  const token: string = (await response.json()).access_token;
  tokens.set(email, token); return token;
}
export const headers = (token: string) => ({ Authorization: `Bearer ${token}` });
export async function asUser(page: Page, email: string, target: string) {
  const token = await login(page.request, email);
  await page.goto("/entrar");
  await page.evaluate((value) => localStorage.setItem("nota_tecnica_token", value), token);
  await page.goto(target); return token;
}
export async function fillService(page: Page, description: string, plate?: string) {
  if (plate) await page.getByLabel("Placa do veículo", { exact: true }).fill(plate);
  await page.getByLabel("Descrição", { exact: true }).fill(description);
  await page.getByLabel("Data do serviço", { exact: true }).fill("2026-10-01");
  await page.getByLabel("Quilometragem", { exact: true }).fill("51000");
  await page.getByLabel("Mão de obra", { exact: true }).fill("100.50");
  await page.getByLabel("Peças", { exact: true }).fill("200.25");
  await page.getByRole("button", { name: "Salvar manutenção" }).click();
  await expect(page).toHaveURL(/\/app\/manutencoes\/\d+$/);
}
export async function evidenceAndSubmit(page: Page) {
  await page.getByLabel("Arquivo do comprovante").setInputFiles(pdf);
  await page.getByRole("button", { name: "Enviar comprovante" }).click();
  await expect(page.getByRole("button", { name: "Enviar para análise", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Enviar para análise", exact: true }).click();
  await expect(page.getByText(/Enviado para análise · Análise pendente/)).toBeVisible();
}
export async function approveService(request: APIRequestContext, recordId: string, publicDescription: string) {
  const auth = headers(await login(request, "admin@example.com"));
  const documents = await (await request.get(`${api}/maintenance-records/${recordId}/documents`, { headers: auth })).json();
  for (const document of documents) {
    const response = await request.patch(`${api}/admin/documents/${document.id}/review`, { headers: auth, data: { expected_version: document.review_version, review_status: "approved" } });
    expect(response.status()).toBe(200);
  }
  const record = await (await request.get(`${api}/admin/maintenance-reviews/${recordId}`, { headers: auth })).json();
  const reviewed = await request.patch(`${api}/admin/maintenance-reviews/${recordId}`, { headers: auth, data: { expected_version: record.review_version, revision_id: record.current_revision_id, decision: "approved", reason: "Comprovante sintético inspecionado", public_description: publicDescription } });
  expect(reviewed.status()).toBe(200);
}
