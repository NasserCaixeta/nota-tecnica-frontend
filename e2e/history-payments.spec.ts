import { test, expect } from "@playwright/test";
import { api, asUser } from "./helpers";
test("A13 A14 A15 A16 — forged return grants nothing and verified event unlocks sanitized history", async ({ page }) => {
  await asUser(page, "buyer@example.com", "/app/historico/ABC1D23");
  await expect(page.getByText("Ambiente de testes — sem cobrança real")).toBeVisible();
  await expect(page.getByText(/19,00/)).toBeVisible();
  await page.getByRole("button", { name: "Comprar acesso de testes por 30 dias" }).click();
  await expect(page).toHaveURL(/\/app\/compras\//);
  const id = page.url().split("/").at(-1)!;
  await page.goto(`/app/compras/${id}?status=paid`);
  await expect(page.getByText("Aguardando confirmação financeira", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver histórico", exact: true })).toHaveCount(0);
  const payload = { id: `evt-${id}`, event: "PAYMENT_CONFIRMED", payment: { id: `pay-${id}` } };
  for (let repeat = 0; repeat < 2; repeat++) expect((await page.request.post(`${api}/payments/webhooks/asaas`, { headers: { "asaas-access-token": "browser-fixture-only-webhook-token-at-least-32-characters" }, data: payload })).status()).toBe(200);
  await page.getByRole("button", { name: "Atualizar pedido" }).click();
  await page.getByRole("link", { name: "Ver histórico", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Troca de óleo revisada", exact: true })).toBeVisible();
  await expect(page.locator("main")).not.toContainText("52998224725");
});

test("A04 A16 A17 — monthly capacity requires confirmation and cancellation preserves paid period", async ({ page }) => {
  const token = await asUser(page, "buyer@example.com", "/app/assinatura");
  await expect(page.getByText(/49,00/)).toBeVisible();
  await page.getByRole("button", { name: "Iniciar assinatura de testes" }).click();
  await expect(page).toHaveURL(/\/app\/compras\//);
  const id = page.url().split("/").at(-1)!;
  const auth = { Authorization: `Bearer ${token}` };
  expect((await (await page.request.get(`${api}/payments/subscription`, { headers: auth })).json()).capacity_limit).toBe(1);
  expect((await page.request.post(`${api}/payments/webhooks/asaas`, { headers: { "asaas-access-token": "browser-fixture-only-webhook-token-at-least-32-characters" }, data: { id: `evt-${id}`, event: "PAYMENT_CONFIRMED", payment: { id: `pay-${id}` } } })).status()).toBe(200);
  await page.getByRole("button", { name: "Atualizar pedido" }).click();
  await page.getByRole("link", { name: "Ver assinatura", exact: true }).click();
  await expect(page.getByText("Capacidade atual: 5 veículos.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cancelar renovação", exact: true }).click();
  await expect(page.getByText(/Renovação cancelada/)).toBeVisible();
  await expect(page.getByText(/Período confirmado até/)).toBeVisible();
  expect((await (await page.request.get(`${api}/payments/subscription`, { headers: auth })).json()).capacity_limit).toBe(5);
});
