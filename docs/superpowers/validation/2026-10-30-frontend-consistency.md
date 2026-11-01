# Aceite da consistência visual do frontend

Execução autorizada em 01/11/2026, na main, com commits separados conforme solicitado. Base: db16e9d (planejamento; frontend anterior31cd7f2). Implementação exclusivamente no frontend; contratos HTTP, permissões e regras comerciais preservados.

## Resultado

O admin passou a usar a identidade escura/vermelha do sistema, com navegação selecionada, sidebar no desktop e menu acessível no celular. Oito filas e os detalhes de documentos/serviços receberam cabeçalhos, controles, painéis e estados coerentes. A mesma base foi aplicada à garagem, oficinas, manutenção, conta e páginas públicas/comerciais.

Antes, participantes media506px e garagem459px em viewport390px; a coluna fixa240px comprimia o conteúdo. Agora o layout usa sidebar somente a partir de960px e cartões/controles adaptáveis abaixo desse limite. Também foram corrigidos estados que apresentavam filas vazias depois de falhas HTTP.

## Evidência local

- 88 testes unitários em55 arquivos, lint e build aprovados; fixtures Playwright verificadas separadamente com TypeScript.
- Auditoria npm sem vulnerabilidades após atualização explícita da dependência de desenvolvimento minimatch11.0.1. O override exige acompanhamento nas próximas atualizações de ESLint/typescript-eslint; consumidores instalados utilizam APIs nomeadas compatíveis. [Advisory oficial](https://github.com/advisories/GHSA-g3hv-75wg-m249).
- Matriz com16 rotas preenchidas em320×800,390×844,768×1024,1024×768 e1440×1000: oito filas admin, dois detalhes, garagem, conta, landing, documentos, nova oficina e representação de oficina. Dados exclusivamente sintéticos, autenticação local real; requisições não previstas e erros do navegador reprovam o teste.
- Cenários adicionais: erro503→repetir→vazio; carregamento anunciado; envio bloqueia repetição; conflito409 solicita atualização; pagamentos desabilitados e benefício expirado sem acesso; foco de teclado; reflow720px; página curta sem espaço indevido abaixo da navegação.
- As seis jornadas existentes continuam usando HTTP/backend local reais: cadastro/aprovação, documentos da garagem, envio/moderação de manutenção, reconhecimento/contestação, histórico pago e capacidade/assinatura. Teste adicional cobre navegação e logout.
- Capturas inspecionadas: participantes desktop/mobile, validação documental desktop, serviço mobile, comparação de associação tablet, nova oficina mobile, além das capturas por etapa de garagem, manutenção, conta, landing e comercial. Ausência de overflow é automatizada em todas as rotas da matriz; não equivale a uma comparação pixel a pixel de cada captura.
- Contraste medido sobre superfície#1a1a1a: texto secundário6,31:1; texto vermelho5,61:1; branco na ação vermelha5,89:1; borda de controle3,30:1. Bordas decorativas de painéis são sutis, separadas das bordas de controles.

## Limites

O teste de reflow usa viewport equivalente a200% de ampliação, sem acionar zoom nativo do navegador. Não há baseline automático por pixel nem alegação de auditoria completa de acessibilidade. Evidência autenticada de produção fica privada; screenshots sintéticas locais ficam em /private/tmp/nota-tecnica-frontend-visual-final. Pagamento real, armazenamentoR2, SMTP e rotinas externas não são parte desta entrega.

## Revisão e publicação

Revisão independente única do conjunto db16e9d..b8b34ed por gpt-6-astra/high. Nenhum Critical, um Important e um Minor. O Important foi reproduzido em dois testes que falharam antes da correção: fila de oficinas após503 e recarga após409. A correção remove o erro residual somente quando a recarga tem sucesso; a decisão seguinte usa a versão atualizada. Os dois testes passaram depois da correção.

Minor adiado: clicar na marca Nota Técnica com menu mobile aberto navega mantendo o menu expandido. Escape, os links do menu e o botão de fechar funcionam; o conteúdo continua acessível. Esse ajuste de conveniência ficou registrado, sem bloquear a entrega.

Código publicado na main:3796b1df28f2788043eab91c0d1ef064b16e0c94. [CI aprovado](https://github.com/NasserCaixeta/nota-tecnica-frontend/actions/runs/41363048722): instalação limpa, lint,88 testes, build e auditoria sem vulnerabilidades. Suíte final local de navegador:18/18 em1,2min.

Deploy Vercel7480871175 concluído com sucesso em01/11/2026. [Painel publicado](https://nota-tecnica-frontend.vercel.app/admin/participantes). Verificação autenticada somente leitura:18 acessos — oito filas e conta em390px/1440px; login, rotas diretas, assets, nova navegação, API/CORS aprovados, sem overflow ou exceções do navegador. Capturas de participantes desktop/mobile inspecionadas. Capturas privadas em /private/tmp/nota-tecnica-frontend-production-final; nenhum dado de produção foi usado nas fixtures ou versionado. Backend não foi alterado/republicado nesta entrega.

## Registro de execução

Registro integral de execução, incluindo todas as decisões e seus custos e o único detalhe menor adiado:

```text
# SDD ledger — plan: docs/superpowers/plans/2026-10-30-frontend-consistency.md
Authorization: user said continue on01/11 after reviewing plan; native execution/main/separate commits already explicit. Planning-only language in original documents describes prior turn, superseded by this authorization. Preserve functional/backend contracts; use synthetic local data only.
Pre-flight: T1 produces controls/PageHeader/StateBlock consumed byT2–T7; optional props preserve old callers. T2 WorkspaceShell consumes session/logout and current route lists, no auth changes. T3/T4 share Admin.css and evidence components; T6 reuses evidence without changing moderation contracts. T5–T7 depend only on shared UI, existing API types unchanged. T8 intercepts complete local DTOs and keeps six real journeys independent. No conflicting interfaces.
Ruling: retain main workspace per explicit user instruction, no new worktree — cost: changes share current checkout and require scoped staging.
Task1: RED missing Textarea/ButtonLink and failed field descriptions/StateBlock roles; GREEN75tests+lint/build. Actual component preview inspected desktop/mobile, no overflow390, visible focus. Contrast on darkest raised surface1a: muted6.31, accenttext5.61, white/action5.89. Ruling: separate control-border706b66 (3.30) from subtle panel border4f4c48 (2.04), rather than brighten all panels — cost: an extra semantic color token. Primary border uses accenttext for control boundary contrast.
Task 1: complete (commits db16e9d..589f7c0, tests: bash -c 'npm run lint && npm run test -- --run && npm run build' → ✓ built in 742ms)
Task2: RED missing WorkspaceShell; GREEN parentaria-current, disclosure Escape/focus and link-close. Full78tests/lint/build and actual Playwrightnavigation on320/390/768/1024/1440passed; logout cleared real token and guarded route redirectedlogin. No horizontal overflow. Public shell CSS preserved. T3 failing queue test currently uncommitted and excluded from T2 scoped commit.
Task 2: complete (commits 589f7c0..48c73a1, tests: npm run test -- --run src/components/layout/WorkspaceShell.test.tsx →    Duration  405ms (environment 57%, tests 20%, import 11%, setup 9%, transform 2%, worker 1%))
Task3: queueHTTP503 originally rendered empty RED; now error/retry and eventualempty GREEN. Introduced participant sidebar name exposed a preexisting test waiting on ambiguous text; wait for real card heading instead. Ruling: labels accept ReactNode to preserve dynamic names in proper label-for controls; no payload changes — cost: slightly wider visual prop type. Preserved plain anchor in standalone validation list to avoid unnecessary Router dependency. Actual populated4routes+detail screenshots1440/390/320 nooverflow, visually inspected cards/decision documents.
Task 3: complete (commits 48c73a1..50e255a, tests: npm run test -- --run src/features/admin/pages/AdminValidationQueuePage.test.tsx src/features/admin/pages/ParticipantQueuePage.test.tsx src/features/admin/pages/AdminValidationDetailPage.test.tsx src/features/admin/components/AdminValidationQueue.test.tsx →              at least ~661ms faster with isolate: false — reuses workers across files instead of one per file)
Task4: RED3 queues showed empty after503; now distinguish failure and offer existing reload. GREEN82tests/lint/build and2servicebrowserjourneys. All8queues+2detail types captured populated1440/390/320withlocalcompleteDTOs, no overflow; association comparison and service decision mobile visually inspected. Evidence component reuses globalpanel/stack instead of depending on admin-only styles. Versions/permissions/reasons retained.
Task 4: complete (commits 50e255a..66e9669, tests: npm run test -- --run src/features/admin/pages/AdminQueueFailures.test.tsx src/features/admin/pages/MaintenanceReviewPage.test.tsx src/features/admin/pages/ServiceDisputesPage.test.tsx src/features/admin/pages/ServiceReviewsPage.test.tsx src/features/admin/pages/ServiceAssociationsPage.test.tsx →              at least ~726ms faster with isolate: false — reuses workers across files instead of one per file)
Task5: RED managedoffice503showednoapprovedrepresentation; now failure doesnotclaimempty. GREEN83tests/lint/build;3realgarage+historypayment journeys passed. Local synthetic garage/docs/create/office screens captured1440/390/320 with nooverflow; dashboard inspected, corrected statuspill stretching to fullwidth and renamed vehiclelink. Formgrid avoids nestedmain, Addvehicle uses singleButtonLink. No capacity/payment/backend changes.
Task 5: complete (commits 66e9669..c98c205, tests: npm run test -- --run src/features/workshops/pages/ManagedWorkshopsPage.test.tsx src/features/garage/pages/GarageDashboardPage.test.tsx src/features/garage/pages/GarageVehicleDocumentsPage.test.tsx →              at least ~424ms faster with isolate: false — reuses workers across files instead of one per file)
Task6: RED comment editable before initialGET; now disabled with rating during loading/save, current revision keys reset form on version change. Pending services failure/empty regression observedRED and restoredguardGREEN. Full85tests/lint/build,2realservicesjourneys passed. Maintenance form/detail/invitation screenshots1440/390/320 nooverflow, form visually inspected. Existingcreate/ack/dispute/revision/fragment contracts unchanged; no production fixture data created.
Task 6: complete (commits c98c205..5cc7209, tests: npm run test -- --run src/features/maintenance/components/ServiceReviewForm.test.tsx src/features/maintenance/pages/PendingServicesPage.test.tsx src/features/maintenance/pages/MaintenanceDetailPage.test.tsx →              at least ~442ms faster with isolate: false — reuses workers across files instead of one per file)
Task7: RED profile failure incorrectly rolestatus; separateerrorGREEN. Account/notifications/commercial controls migrated, disabledproviderstill no purchaseCTA. Landing now describes stars/deadline/verifiedvolume withoutprice/rework promise. Actual13client/publicpages1440/390/320 nooverflow, account/disabledsubscription/landing inspected. Ruling: include AuthGuard presentation states using sharedStateBlock, preserving every redirect/check — cost: guard DOM changes but no auth semantics; existingguardtests retained. Removed codemod-only changes in untouched public/auth composition and dead unused profile file.
Task7final:86tests/lint/build and6realjourneys12.6s clean onfinalsource, plus earliernavigation. Local13account/public/commercialroutes1440/390/320 nooverflow. CSScontrast secondary labels/active menu indicator adjusted; PageHeader actions keepflex. Pending T8check: codemod dropped mapped upload label keys in two upload forms; add console-warning regression and restore stablekeys during visualacceptance. No Vercel publication yet, all commits scoped.
Task 7: complete (commits 5cc7209..e835bbb, tests: npm run test -- --run src/features/auth/pages/PilotStatusPage.test.tsx src/features/auth/pages/AccountPage.test.tsx src/features/payments/pages/SubscriptionPage.test.tsx src/features/public/pages/PaidVehicleHistoryPage.test.tsx →              at least ~542ms faster with isolate: false — reuses workers across files instead of one per file)
Task8: actual PlaywrightRED390matrix caught missing Reactkey in mapped garageupload field; restore key=kind. Prediction of a second lost key in officeform was disproved: its surrounding div already retains key, no extra change. Loadingdetail actualREDmissingrolestatus; set StateBlockkindloading. Captures wait networkidle to include filled data, unexpected API requests fail instead of genericfallback.

Task8: matrix extended to new-workshop form; observed missing h1 RED, added shared PageHeader and error rolealert.
Ruling: pin minimatch11.0.1 across dev tooling to address newly published GHSA-g3hv-75wg-m249; installed consumers use compatible named minimatch/Minimatch APIs (no callable v3 default). Lint, full unit/build and zero-vulnerability audit verify override — cost: explicit cross-major override must be revisited when upstream tooling updates. Advisory: https://github.com/advisories/GHSA-g3hv-75wg-m249 .
Task8: visualinspection found 106px blank gap between mobileheader/content on shorttabletpages. Geometryregression observedRED106.67px, fixed mobilegrid align-content:start, preservingdesktopstickybehavior.
Task8final: 86unit/54files, lint/build/audit0 and fixtureTypeScript allpassed. FullPlaywright18/18in1.4m, including80populatedcaptures across16routes/fivewidths, sixrealbusinessjourneys andnavigation. Inspected finaldesktopparticipant/documentdetail, mobileservice/newworkshop/participant andtabletcomparison; noReacterrors/overflow. Geometryregression nowGREEN. Reflow720is equivalentviewport, notnativebrowserzoom; no pixelbaseline claim.
Task 8: complete (commits e835bbb..b8b34ed, tests: npm run lint && npm run test -- --run && npm run build && npm audit --audit-level=moderate && PLAYWRIGHT_BROWSERS_PATH=/private/tmp/nota-tecnica-playwright npm run test:e2e && fixture tsc → 86 unit/18 browser passed, zero vulnerabilities; logs t8-final.log/t8-final-e2e.log)
Final review: independent gpt-6-astra/high read-only whole range db16e9d..b8b34ed; one Important, one Minor, no Critical. Important accepted: WorkshopClaimsPage keeps error after successful reload, hiding cards after503/409/documentfailure; enter one fixpass with both recovery/versionregressions.
Final: minor (deferred): clicking Nota Técnica brand with mobilemenu open navigates but retains expandedmenu; other links and Escape close it. Content remains reachable; optional polish remains.
Final: Ruling: administrative detail stale data/actions after failedreload are preexisting, retained in this presentation scope — server version/permission validation still governs actions and failure remains visible — cost: manual reload may be necessary to get current data.
Final: Ruling: PilotStatusPage existing editable fields during submission retained; no new submission semantics introduced — cost: edits during a pending request may need repeating after refresh.
Final: Ruling: native200% zoom not claimed; equivalent720px reflow is tested, productiondeeplinks/CORS are verified at release and externalservices remain outofscope — cost: native browserzoom/realexternal integrations need separate acceptance.
Final: fixed workshop queue recovery after503/409 — WorkshopClaimsPage.test.tsx bothcases RED2/2→GREEN2/2, fullsuite88/88unit55files +18/18browser1.2m, lint/build/audit0; commit3796b1d. Refreshed decision expected_version verified1→2. One fixpass, no rereview.
Release: main3796b1d pushed; GitHubActions41363048722 success (npmci/lint/88unit/build/audit0); Vercelproductiondeployment7480871175 success. Publicalias authenticatedread-only18checks (eightqueues+account at390/1440): login/deeplinks/assets/newnavigation/CORS/API passed, nooverflow or browserexceptions; private screenshots inspected participantmobile/desktop. No administrativewrites or backenddeployment.
```

## Commits da entrega

```text
db16e9d docs: plan frontend visual consistency with admin priority
589f7c0 feat(ui): standardize workspace controls and page primitives
48c73a1 feat(ui): unify responsive app and admin navigation
50e255a feat(admin): style participation workshop and document reviews
66e9669 feat(admin): unify service moderation and remaining queues
c98c205 feat(ui): align garage and workshop management with workspace design
5cc7209 feat(ui): standardize maintenance evidence and customer actions
e835bbb feat(ui): complete account commerce and public consistency
5d17af2 chore(deps): pin patched minimatch for development tools
b8b34ed test(ui): record visual acceptance across admin and application routes
3796b1d fix(admin): restore workshop queue after failed reviews and reloads
```
