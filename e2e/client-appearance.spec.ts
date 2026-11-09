import { expect, test, type Page } from '@playwright/test';
import { login } from './helpers';
import { clientFixtures, clientScreens, customer, customerService, preview, publishedService } from './fixtures/client-ui';

test.use({ locale: 'pt-BR', timezoneId: 'UTC' });
type Overrides = Record<string, unknown>;
async function setup(page: Page, options: { anonymous?: boolean; overrides?: Overrides } = {}) {
  const data = { ...clientFixtures, ...options.overrides };
  const unexpected: string[] = [];
  await page.route('**/api/v1/**', async route => {
    const path = new URL(route.request().url()).pathname.replace('/api/v1', '');
    if (route.request().method() !== 'GET' || !(path in data)) {
      unexpected.push(`${route.request().method()} ${path}`);
      await route.fulfill({ status: 404, json: { detail: 'Fixture não definida' } });
      return;
    }
    await route.fulfill({ json: data[path] });
  });
  const token = options.anonymous ? '' : await login(page.request, 'driver@example.com');
  await page.goto('/entrar');
  await page.evaluate(value => {
    localStorage.clear(); sessionStorage.clear();
    if (value) localStorage.setItem('nota_tecnica_token', value);
  }, token);
  return { data, unexpected };
}
async function fits(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
for (const [width, height] of [[320, 800], [390, 844], [768, 1024], [1024, 768], [1440, 1000]]) {
  test(`all client and public screens at ${width}px`, async ({ page }, info) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height });
    const { data, unexpected } = await setup(page);
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    // One token per context; each navigation deliberately switches the UI persona.
    await page.route('**/api/v1/users/me', route => route.fulfill({ json: data['/users/me'] }));
    for (const screen of clientScreens) {
      await page.goto('/entrar');
      await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
      if (!screen.anonymous) {
        const token = await login(page.request, 'driver@example.com');
        await page.evaluate(value => localStorage.setItem('nota_tecnica_token', value), token);
      }
      // The response fixture selects the participation state independently of the token.
      data['/users/me'] = screen.pending ? { ...customer, participation_status: 'pending' } : customer;
      await page.goto(screen.path, { waitUntil: 'networkidle' });
      await expect.soft(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect.soft(page.getByText('Verificando sua sessão...')).toHaveCount(0);
      if (screen.expectedAlert) await expect.soft(page.getByRole('alert')).toContainText(screen.expectedAlert);
      else await expect.soft(page.getByRole('alert')).toHaveCount(0);
      expect.soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${screen.name}: horizontal overflow`).toBe(true);
      const unnamed = await page.locator('input:not([type=hidden]):not([type=submit]),select,textarea').evaluateAll(nodes => nodes.filter(node => {
        const el = node as HTMLInputElement;
        return !el.labels?.length && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby');
      }).map(el => el.outerHTML));
      expect.soft(unnamed, `${screen.name}: unlabeled controls`).toEqual([]);
      expect.soft(unexpected, `${screen.name}: unconfigured requests`).toEqual([]);
      expect.soft(errors, `${screen.name}: browser errors`).toEqual([]);
      await page.evaluate(() => window.scrollTo(0, 0));
      if (screen.path.startsWith('/app/') && screen.path !== '/app/participacao') {
        if (width < 960) await expect.soft(page.getByRole('button', { name: 'Abrir menu' })).toBeInViewport();
        else await expect.soft(page.getByRole('navigation', { name: 'Navegação do app' })).toBeVisible();
      }
      await page.screenshot({ path: info.outputPath(`${screen.name}-${width}.png`), fullPage: true });
    }
  });
}

test('public search covers result, no result, failure and recovery', async ({ page }) => {
  const { data, unexpected } = await setup(page, { anonymous: true });
  await page.goto('/consultar');
  await page.getByLabel('Placa do veículo').fill('abc-1d23');
  await page.getByRole('button', { name: 'Consultar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Prévia técnica disponível' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Consultar histórico completo' })).toBeVisible();
  data['/public/vehicles/ABC1D23/history-preview'] = { ...preview, vehicle_found: false, maintenance_count: 0 };
  await page.getByRole('button', { name: 'Consultar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ainda não encontramos histórico' })).toBeVisible();
  await page.route('**/api/v1/public/vehicles/ABC1D23/history-preview', route => route.fulfill({ status: 503, json: { detail: 'Consulta indisponível' } }));
  await page.getByRole('button', { name: 'Consultar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Consulta indisponível');
  await page.unroute('**/api/v1/public/vehicles/ABC1D23/history-preview');
  data['/public/vehicles/ABC1D23/history-preview'] = preview;
  await page.getByRole('button', { name: 'Consultar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Prévia técnica disponível' })).toBeVisible();
  expect(unexpected).toEqual([]);
});

test('expired password reset can request another link', async ({ page }) => {
  await setup(page, { anonymous: true });
  await page.goto('/redefinir-senha');
  await page.getByRole('link', { name: 'Solicitar outro link de recuperação' }).click();
  await expect(page.getByRole('heading', { name: 'Recuperar acesso' })).toBeVisible();
});

test('non-admin navigation and authentication boundaries', async ({ page }) => {
  const { data } = await setup(page);
  await page.goto('/app'); await expect(page).toHaveURL(/\/app\/garagem$/);
  await page.goto('/admin/participantes');
  await expect(page.getByRole('heading', { name: 'Acesso restrito' })).toBeVisible();
  data['/users/me'] = { ...customer, participation_status: 'pending' };
  await page.goto('/app/garagem'); await expect(page).toHaveURL(/\/app\/participacao$/);
  await page.goto('/app/conta'); await expect(page.getByRole('heading', { name: 'Minha conta' })).toBeVisible();
});

test('read-only vehicle and published service expose no private write controls', async ({ page }) => {
  await setup(page, { overrides: {
    '/garage/vehicles/11': { ...clientFixtures['/garage/vehicles/11'] as object, commercial_access: 'read_only', permissions: { can_add_maintenance: false, can_upload_documents: false, can_submit_review: false, can_share_history: false, can_generate_sale_report: false } },
    '/maintenance-records/42': publishedService,
  } });
  await page.goto('/app/garagem/11');
  await expect(page.getByText('Este veículo está disponível para leitura.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Registrar manutenção', exact: true })).toHaveCount(0);
  await page.goto('/app/manutencoes/42');
  await expect(page.getByRole('heading', { name: publishedService.public_description })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enviar comprovante' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Confirmar serviço' })).toHaveCount(0);
});

test('invitation supports the three actual eligibility states and hides its fragment', async ({ page }) => {
  const { unexpected } = await setup(page);
  let state = 'participation_pending';
  await page.route('**/api/v1/service-invitations/9/resume', route => route.fulfill({ json: { state, record_id: 42, revision_id: 8 } }));
  await page.goto('/convite-servico?convite=9#synthetic-invitation-token');
  await expect(page).toHaveURL(/convite=9$/);
  await page.getByRole('button', { name: 'Retomar convite' }).click();
  await expect(page.getByRole('link', { name: 'Acompanhar aprovação' })).toBeVisible();
  state = 'relationship_required';
  await page.getByRole('button', { name: 'Retomar convite' }).click();
  await expect(page.getByLabel('Placa', { exact: true })).toBeVisible();
  state = 'awaiting_confirmation';
  await page.getByRole('button', { name: 'Retomar convite' }).click();
  await page.getByRole('link', { name: 'Abrir atendimento' }).click();
  await expect(page.getByRole('heading', { name: 'Detalhe do serviço' })).toBeVisible();
  expect(unexpected).toEqual([]);
});

test('customer review and service correction remain usable with populated data', async ({ page }, info) => {
  const { data } = await setup(page, { overrides: {
    '/maintenance-records/42': { ...customerService, permissions: { ...customerService.permissions, can_review: true } },
  } });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/app/manutencoes/42');
  await expect(page.getByLabel('Comentário (opcional)')).toBeVisible();
  await page.getByRole('button', { name: 'Corrigir serviço' }).click();
  await expect(page.getByLabel('Descrição', { exact: true })).toHaveValue(customerService.description);
  await page.getByText('Histórico de versões', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Versão 1' })).toBeVisible();
  await fits(page);
  await page.screenshot({ path: info.outputPath('service-edit-review-390.png'), fullPage: true });
  data['/notifications'] = [];
  await page.goto('/app/notificacoes');
  await expect(page.getByText('Nenhuma notificação no momento.')).toBeVisible();
});

for (const [path, endpoint, retry] of [
  ['/oficinas', '/public/workshops/ranking', 'Tentar novamente'],
  ['/oficinas/7', '/workshops/7', 'Tentar novamente'],
  ['/app/garagem', '/garage', 'reload'],
  ['/app/garagem/11', '/garage/vehicles/11', 'Tentar novamente'],
  ['/app/garagem/11/documentos', '/garage/vehicles/11', 'Atualizar'],
  ['/app/oficinas', '/workshops/me', 'Tentar novamente'],
  ['/app/oficinas/7/servicos', '/workshops/7/maintenance-records', 'Atualizar'],
  ['/app/notificacoes', '/notifications', 'Atualizar notificações'],
  ['/app/assinatura', '/payments/subscription', 'Tentar novamente'],
  ['/app/historico/ABC1D23', '/history/vehicles/ABC1D23', 'Atualizar acesso e histórico'],
  ['/app/manutencoes/42', '/maintenance-records/42', 'Atualizar dados'],
  ['/app/compras/visual-order', '/payments/orders/visual-order', 'Atualizar pedido'],
  ['/app/servicos-pendentes', '/customer-services/pending', 'Atualizar'],
] as const) {
  test(`HTTP failure is visible and recoverable: ${path}`, async ({ page }) => {
    const { unexpected } = await setup(page);
    const pattern = `**/api/v1${endpoint}`;
    await page.route(pattern, route => route.fulfill({ status: 503, json: { detail: 'Falha sintética de disponibilidade' } }));
    await page.goto(path);
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/Nenhuma notificação|Nenhuma manutenção registrada|Nenhum atendimento pendente|Nenhuma oficina aprovada/)).toHaveCount(0);
    await page.unroute(pattern);
    if (retry === 'reload') await page.reload();
    else await page.getByRole('button', { name: retry, exact: true }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);
    expect(unexpected).toEqual([]);
  });
}

test('login failure, busy state and return to protected page', async ({ page }) => {
  await setup(page, { anonymous: true });
  let finish!: () => void; const gate = new Promise<void>(resolve => { finish = resolve; });
  let calls = 0;
  await page.route('**/api/v1/auth/login', async route => {
    calls++; if (calls === 1) { await gate; await route.fulfill({ status: 401, json: { detail: 'Credenciais inválidas' } }); }
    else await route.fulfill({ json: { access_token: 'synthetic-customer-token', token_type: 'bearer' } });
  });
  await page.goto('/app/historico/ABC1D23'); await expect(page).toHaveURL(/\/entrar$/);
  await page.getByLabel('E-mail', { exact: true }).fill('cliente@example.com');
  await page.getByLabel('Senha', { exact: true }).fill('strong-password');
  const submit = page.getByRole('button', { name: 'Entrar', exact: true });
  await submit.click(); await expect(submit).toBeDisabled();
  await submit.evaluate(el => (el as HTMLButtonElement).click()); finish();
  await expect(page.getByRole('alert')).toContainText('Credenciais inválidas'); expect(calls).toBe(1);
  await submit.click(); await expect(page).toHaveURL(/\/app\/historico\/ABC1D23$/);
  await expect(page.getByRole('heading', { name: 'Histórico de ABC1D23' })).toBeVisible();
});

test('password recovery acknowledges sending and reset validates matching passwords', async ({ page }) => {
  await setup(page, { anonymous: true });
  await page.route('**/api/v1/auth/forgot-password', route => route.fulfill({ json: { message: 'Se a conta existir, enviaremos o link.' } }));
  await page.goto('/esqueci-senha'); await page.getByLabel('E-mail').fill('cliente@example.com');
  await page.getByRole('button', { name: 'Solicitar recuperação' }).click();
  await expect(page.getByRole('status')).toContainText('Se a conta existir');
  let writes = 0;
  await page.route('**/api/v1/auth/reset-password', route => { writes++; return route.fulfill({ json: { message: 'Senha alterada com sucesso.' } }); });
  await page.goto('/redefinir-senha#synthetic-reset-token'); await expect(page).toHaveURL(/\/redefinir-senha$/);
  await page.getByLabel('Nova senha', { exact: true }).fill('strong-password');
  await page.getByLabel('Confirme a nova senha').fill('different-password');
  await page.getByRole('button', { name: 'Alterar senha' }).click();
  await expect(page.getByRole('alert')).toContainText('As senhas precisam ser iguais'); expect(writes).toBe(0);
  await page.getByLabel('Confirme a nova senha').fill('strong-password');
  await page.getByRole('button', { name: 'Alterar senha' }).click();
  await expect(page.getByRole('status')).toContainText('Senha alterada'); expect(writes).toBe(1);
});

test('notifications update after marking read and navigate to the actual pending item', async ({ page }) => {
  await setup(page);
  const notification = (clientFixtures['/notifications'] as { id: number; read_at: string | null }[])[0];
  await page.route(`**/api/v1/notifications/${notification.id}/read`, route => route.fulfill({ json: { ...notification, read_at: '2026-11-09T10:00:00Z' } }));
  await page.goto('/app/notificacoes');
  await page.getByRole('button', { name: 'Marcar como lida' }).click();
  await expect(page.getByText('Lida', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Ver pendência' }).click();
  await expect(page).toHaveURL(/\/app\/garagem\/11\/documentos$/);
});

test('history permission failure does not expose records and checkout is explicit test only', async ({ page }) => {
  await setup(page);
  await page.route('**/api/v1/history/vehicles/ABC1D23', route => route.fulfill({ status: 403, json: { detail: 'Acesso não vigente' } }));
  await page.goto('/app/historico/ABC1D23');
  await expect(page.getByText('Checkout de testes indisponível: configuração pendente.')).toBeVisible();
  await expect(page.getByRole('heading', { name: publishedService.public_description })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Comprar acesso de testes por 30 dias' })).toHaveCount(0);
  await page.route('**/api/v1/payments/orders/visual-order', route => route.fulfill({ json: { ...clientFixtures['/payments/orders/visual-order'] as object, state: 'checkout_pending', checkout_url: 'https://checkout.stripe.com/c/pay/cs_live_not_allowed' } }));
  await page.goto('/app/compras/visual-order');
  await expect(page.getByRole('alert')).toContainText('não é válido para o ambiente de testes');
  await expect(page.getByRole('link', { name: 'Continuar no checkout de testes' })).toHaveCount(0);
});

test('empty lists are genuine empty results across customer and public pages', async ({ page }) => {
  await setup(page, { overrides: {
    '/garage': { summary: { total: 0, active: 0, pending_documents: 0, under_review: 0, rejected: 0, payment_required: 0, has_free_vehicle_slot: true }, vehicles: [] },
    '/notifications': [], '/workshops/me': [], '/workshops/claims/me': [],
    '/customer-services/pending': [], '/service-invitations/pending': [],
    '/history/vehicles/ABC1D23': { plate: 'ABC1D23', access: { source: 'relationship', expires_at: null }, records: [] },
    '/public/workshops/ranking': { score_version: 'pilot_v1', score_explanation: 'Avaliação, prazo e volume.', items: [], unranked_items: [] },
  } });
  for (const [path, text] of [
    ['/app/garagem', 'Garagem vazia'], ['/app/notificacoes', 'Nenhuma notificação no momento.'],
    ['/app/oficinas', 'Nenhuma representação aprovada.'],
    ['/app/servicos-pendentes', 'Nenhum convite aguardando vínculo.'],
    ['/app/historico/ABC1D23', 'Não há serviços elegíveis para exibição neste momento.'],
  ]) {
    await page.goto(path); await expect(page.getByText(text, { exact: true })).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
  }
  await page.goto('/oficinas'); await expect(page.getByText('Nenhuma oficina ranqueada ainda.', { exact: true })).toBeVisible();
});

test('account profile and identity request show the saved state', async ({ page }) => {
  const { data, unexpected } = await setup(page);
  await page.route('**/api/v1/users/me', async route => {
    if (route.request().method() !== 'PATCH') { await route.fallback(); return; }
    data['/users/me'] = { ...customer, ...route.request().postDataJSON() };
    await route.fulfill({ json: data['/users/me'] });
  });
  await page.route('**/api/v1/users/me/identity-requests', async route => {
    if (route.request().method() !== 'POST') { await route.fallback(); return; }
    const body = route.request().postDataJSON();
    expect(body.reason).toBe('Correção de identidade com documentos de testes');
    await route.fulfill({ json: { id: 19, user_id: 2, kind: 'identity_correction', reason: body.reason, status: 'pending', created_at: '2026-11-09T10:00:00Z' } });
  });
  await page.goto('/app/conta');
  await page.getByLabel('Nome completo').fill('Mariana — perfil atualizado de testes');
  await page.getByRole('button', { name: 'Salvar perfil' }).click();
  await expect(page.getByRole('status')).toContainText('Perfil atualizado');
  await expect(page.getByLabel('Nome completo')).toHaveValue('Mariana — perfil atualizado de testes');
  await page.getByLabel('O que precisa ser corrigido').fill('Correção de identidade com documentos de testes');
  await page.getByRole('button', { name: 'Solicitar correção de identidade' }).click();
  await expect(page.getByRole('status')).toContainText('Solicitação registrada para análise administrativa');
  await expect(page.getByText('Aguardando análise', { exact: true })).toBeVisible();
  expect(unexpected).toEqual([]);
});
