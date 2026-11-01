# Frontend visual consistency — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans quando o usuário solicitar execução. Método já escolhido: execução direta na main, commits separados. Execução autorizada em01/11/2026 pelo pedido de continuação do usuário; resultados no [relatório de validação](../validation/2026-10-30-frontend-consistency.md).

**Goal:** Corrigir a identidade visual e a usabilidade responsiva do frontend, entregando o painel administrativo primeiro.
**Architecture:** Completar componentes e estilos existentes; layout autenticado compartilhado; migração por fluxo e aceite visual com dados sintéticos. Preservar contratos HTTP/regras do piloto.
**Tech Stack:** React/TypeScript/Vite, CSS/CSS Modules, Vitest/Testing Library e Playwright já instalados. Sem nova biblioteca visual.
**Spec:** ../specs/2026-10-30-frontend-consistency-design.md

## Global Constraints

Identidade escura/vermelha existente; fundo#111, superfícies#151515/#1a1a1a, ação#c0281f. Contraste4,5:1 texto normal/3:1 controles e foco. Espaçamento4/8/12/16/24/32px. Sidebar240px apenas>=960px, menu no fluxo<960px. Viewports320x800/390x844/768x1024/1024x768/1440x1000. Sem scroll horizontal do documento. Não mudar backend, permissões, expected_version, publicação, janela paga ou limites da garagem. Dados reais/segredos não entram em screenshots versionadas. Sem deploy nesta fase de planejamento.

## Review Focus

- Subrota administrativa mantém navegação ativa e teclado/Escape do menu mobile não perde foco: T2.
- Campo com label/erro/helper e controle disabled continuam semânticos e legíveis, inclusive select/textarea: T1.
- HTTP500/403/409 não aparece como fila limpa nem libera ação indevida: T3/T4.
- Nomes, documentos e descrições longos em filas preenchidas não estouram viewport320px: T3/T4/T8.
- Mudança de tokens/layout não quebra landing, rotas diretas da Vercel, formulários e seis jornadas existentes: T5–T8.

## Mapa de entregas

| Etapa | Saída revisável | Prioridade |
|---|---|---|
| T1 | Componentes/estilos de base coerentes | P0 |
| T2 | Estrutura app/admin responsiva e navegação completa | P0 |
| T3 | Participantes, oficinas e validação documental | P1 |
| T4 | Demais filas/análises administrativas | P1 — admin visualmente completo |
| T5 | Garagem e área de oficinas | P2 |
| T6 | Manutenção, reconhecimento e convites | P2 |
| T7 | Conta, pendências, comercial e público | P2/P3 |
| T8 | Aceite visual/funcional e publicação da futura execução | Fechamento |

T1→T2→T3→T4 entregam primeiro o admin solicitado. T5–T7 levam a mesma base ao restante; não começar redesign de landing antes de concluir o admin. Um commit por tarefa; correções de regressão importantes podem ter commit próprio. Sem estimativa artificial em dias.

### Task 1: Completar base visual e controles

**Files:** src/styles/{tokens,globals}.css; src/components/ui/{Button,Input,Select,Panel,StatusPill}.tsx e respectivos estilos; criar src/components/ui/{Textarea,ButtonLink}.tsx, src/components/layout/{PageHeader.tsx,Page.css}; src/components/data-display/{StateBlock.tsx,StateBlock.css}. Testes em src/components/ui/{Input,Select,Textarea,ButtonLink}.test.tsx e src/components/data-display/StateBlock.test.tsx.

**Interfaces:** Reutilizar props HTML nativas. Input/Select preservam label/fieldClassName; Textarea usa TextareaHTMLAttributes + label/hint/error. Acrescentar hint/error opcionais e associação aria-describedby aos três. Exportar ButtonVariant existente para ButtonLink, que recebe LinkProps e variant e renderiza um único Link. PageHeader recebe title:string, description?:string, actions?:ReactNode. StateBlock preserva title/message/description e acrescenta kind?:loading|empty|error|success e onRetry?:()=>void; defaultempty.

- [x] Caracterizar componentes existentes e escrever testes só para novas semânticas: label identifica controle, hint/erro associado, disabled impede ação, ButtonLink é link único, erro de StateBlock tem rolealert/retry e loading tem rolestatus. Observar RED antes de mudar comportamento.
- [x] Implementar componentes/padrões. Definir page-section, stack, data-row, data-row__meta, checkbox-grid, muted e eyebrow, atualmente ausentes. Separar estrutura em Page.css e componentes em seus módulos; não espalhar estilos de página por arquivos de features não relacionados.
- [x] Unificar foco visível, alturas, bordas, hierarquia de ações e tipografia; eliminar outline:none sem substituição. Medir contraste; propostas muted#a09b94/accent-text#ef675e precisam passar sobre superfícies reais. CSS puro é validado em navegador, sem testes que apenas procuram classes ou texto de CSS.
- [x] Run: npm run lint; npm run test -- --run; npm run build. Expected: suíte toda aprovada, props existentes compatíveis, sem warnings novos de DOM/interatividade. Registrar captura comparativa de controles claros/escuros/desabilitados e foco.
- [x] Commit: feat(ui): standardize workspace controls and page primitives.

### Task 2: Layout autenticado desktop/mobile

**Files:** src/components/layout/{AdminShell,AppShell,Shell.css}.tsx/css; criar WorkspaceShell.tsx e WorkspaceShell.test.tsx; e2e/workspace-navigation.spec.ts. Não alterar PublicShell além de regressões comprovadas.

**Interfaces:** WorkspaceNavigationItem={to:string,label:string,end?:boolean}; WorkspaceShell({context:admin|app,navigation:WorkspaceNavigationItem[],children:ReactNode}). Os shells atuais fornecem rotas existentes e Outlet; shared shell consome sessão/logout existentes. PageHeader/controles vêm de T1.

- [x] RED: contexto administrativo conserva link ativo em /admin/servicos/42; sair remove sessão; mobile abre/fecha menu por botão e Escape, devolve foco no Escape e fecha ao escolher rota. Testar links reais/aria-current, não a existência de um mock de sidebar.
- [x] Implementar branding Nota Técnica/contexto, navegação alinhada com seleção ativa, acesso à conta/garagem e sair em ambos. Sem métricas/counters inventados. Desktop grid240px minmax0/1fr; abaixo960px usar cabeçalho/menu no fluxo; conteúdo min-width0, max1200px.
- [x] Navegador:320/390/768/1024/1440 sem document.scrollWidth>innerWidth; teclado alcança menu/conteúdo/saída, foco visível e ordem legível. Preservar links/guards/rotas de participação pendente.
- [x] Run: npm run lint; npm run test -- --run; npm run build; PLAYWRIGHT_BROWSERS_PATH=/private/tmp/nota-tecnica-playwright npm run test:e2e -- e2e/workspace-navigation.spec.ts. Expected: novas interações e suíte existentes aprovadas.
- [x] Commit: feat(ui): unify responsive app and admin navigation.

### Task 3: Filas de pessoas, oficinas e documentos

**Files:** src/features/admin/pages/{ParticipantQueuePage,WorkshopClaimsPage,AdminValidationQueuePage,AdminValidationDetailPage}.tsx; src/features/admin/components/{AdminValidationQueue,AdminReviewPanel,AdditionalDocumentsForm}.tsx; criar src/features/admin/Admin.css; testes correspondentes (criar os ausentes). Usar src/content/documents.ts e status-labels existentes.

**Interfaces:** T1/T2; payloads reviewParticipant/setAdminAccess/reviewWorkshopClaim/reviewGarageVehicleLink/reviewDocument sem alterações. Componente visual não assume permissão; usa os mesmos predicados/versions atuais.

- [x] RED: falha na fila de validações exibe erro+repetir, não Nenhuma validação pendente; manter aprovação com versão/motivo e bloqueio da autoaprovação. Exercitar documento pendente/rejeitado/aprovado e arquivos indisponíveis sem aprovar por aparência.
- [x] Trocar inputs/selects/buttons crus por T1. Adicionar cabeçalho e contexto, toolbar de filtros existentes, status em português, painéis de pedido/documentos/decisão e hierarquia de ações. Traduzir enums dos documentos adicionais; manter mesma chave no payload.
- [x] Validar preenchido/vazio/loading/erro/salvando/409 com fixtures completas. Nomes/e-mails/arquivos longos quebram linha; cards no celular, organização em colunas somente quando couber. Quantidade é de itens carregados, não total global.
- [x] Run: npm run lint; npm run test -- --run; npm run build; jornadas participation.spec.ts e garage.spec.ts. Expected: decisões e autorização iguais, estados reais distinguidos. Capturar filas/detalhe preenchidos em390/1440 e checar320semoverflow.
- [x] Commit: feat(admin): style participation workshop and document reviews.

### Task 4: Completar o painel administrativo

**Files:** src/features/admin/pages/{MaintenanceReviewPage,ServiceDisputesPage,ServiceReviewsPage,ServiceAssociationsPage,AccountRequestsPage}.tsx e testes; src/features/maintenance/components/PrivateEvidence.tsx se necessário para consistência de documentos; reutilizar Admin.css.

**Interfaces:** mesmos endpoints/expected_version/revision_id e verificações de motivo/evidência. AccountRequests continua fila de tratamento manual; UI não promete encerramento executado nem cria endpoint novo.

- [x] RED apenas para regressões/interações necessárias: conflito409 pede atualizar sem afirmar sucesso; falha não mostra vazio; ação duplicada fica bloqueada durante envio. Preservar testes de disputa/publicação/comentário sem alterar estrelas/associação.
- [x] Organizar fila e detalhe de serviços, evidências e descrição pública revisada; contestação com contexto/mensagens/decisão; avaliação com status visível/oculto; associação com comparação dos dois registros e indicação do principal. Aplicar T1, labels e feedback consistentes.
- [x] Completar solicitações de conta com título, contexto manual, data/status e estados de erro/loading/vazio. Não adicionar resolução automática. Conferir que todas as oito filas admin e os dois tipos de detalhe (validação e serviço) receberam o padrão.
- [x] Run: npm run lint; npm run test -- --run; npm run build; jornadas services.spec.ts. Expected: regras atuais preservadas. Screenshot de cada rota admin e de cada tipo de detalhe com fixtures preenchidas; validação por teclado e390/1440, mais320nas telas densas.
- [x] Commit: feat(admin): unify service moderation and remaining queues.

### Task 5: Garagem e oficinas

**Files:** src/features/garage/pages/*.tsx, src/features/garage/components/*.tsx; src/features/workshops/pages/{ManagedWorkshopsPage,NewWorkshopPage,WorkshopClaimPage,WorkshopServicesPage}.tsx e formulários/estilos associados.

- [x] Reutilizar T1/T2 na garagem vazia/preenchida, seleção de gratuito, checklist/documentos, análise/vínculo, lista/cadastro/reivindicação de oficina e atendimentos. Remover Link envolvendo Button e usar ButtonLink.
- [x] Manter estados de uma/cinco vagas, adicionais em leitura e documentação pendente. Preservar upload real/erros de storage, sem declarar R2 disponível em produção. Remover enum técnico visível onde houver label existente.
- [x] Run: npm run lint; npm run test -- --run; npm run build; jornadas garage.spec.ts e history-payments.spec.ts. Expected: sem mudanças de capacidade/direitos; mobile não depende de sidebar fixa. Revisar390/1440 e textos longos.
- [x] Commit: feat(ui): align garage and workshop management with workspace design.

### Task 6: Manutenção e interação cliente/oficina

**Files:** src/features/maintenance/pages/*.tsx; src/features/maintenance/components/{MaintenanceForm,MaintenanceTimeline,PrivateEvidence,ServiceReviewForm}.tsx; testes existentes. Reutilizar componentes, sem criar outro tema para serviços.

- [x] Aplicar grupos de formulário, custos/datas, timeline, evidências, estado editorial/reconhecimento e blocos de convite/contestação/avaliação. Melhorar leitura mantendo revisão exata e permissões recebidas do servidor.
- [x] Preservar validação de comprovantes, motivo, campos obrigatórios e bloqueio enquanto carrega/salva. Não duplicar controles de submit, não esconder ações necessárias no celular, não mostrar link privado em captura real versionada.
- [x] Run: npm run lint; npm run test -- --run; npm run build; jornadas services.spec.ts. Expected: confirmação/disputa/edição/convite continuam com contratos atuais; forms e detalhe funcionam no teclado/mobile. Revisar screenshots de formulário e detalhes preenchidos.
- [x] Commit: feat(ui): standardize maintenance evidence and customer actions.

### Task 7: Conta, pendências, comercial e público

**Files:** src/features/auth/pages/{AccountPage,PilotStatusPage,LoginPage,RegisterPage,ForgotPasswordPage,ResetPasswordPage}.tsx; src/features/notifications/pages/NotificationsPage.tsx; src/features/payments/pages/*.tsx; src/features/public/pages/*.tsx; src/features/workshops/pages/WorkshopProfilePage.tsx; src/features/public/components/landing/HeroPlateSearch.tsx e src/content/landing.ts.

- [x] Padronizar conta/solicitações/pendências e estados de assinatura, checkout e histórico comprado com T1. Pagamento desabilitado mostra indisponibilidade verdadeira, sem CTA sugerindo compra operacional. Preservar senha/recovery/linkfragment e dados privados.
- [x] Revisar consulta/ranking/perfil/login/cadastro/recuperação após alterações compartilhadas. Manter composição e marca da landing; substituir promessa de preço/retrabalho e texto enganoso sobre estrelas pela fórmula do piloto: avaliação, prazo e volume de serviços comprovados. Não mudar fórmula nem pesos/backend.
- [x] Preservar testes de expiração/pedido, retorno forjado sem concessão, ausência de métricas inventadas e sanitização de histórico. Ajustar testes de comunicação apenas ao novo texto de produto aprovado, sem testes tautológicos de parágrafo.
- [x] Run: npm run lint; npm run test -- --run; npm run build; seis jornadas existentes. Expected: todos aprovados; área pública não recebe estilos de painel acidentalmente. Revisar desktop/mobile e estados desligado/pendente/vencido.
- [x] Commit: feat(ui): complete account commerce and public consistency.

### Task 8: Aceite visual e fechamento

**Files:** criar e2e/admin-appearance.spec.ts, e2e/fixtures/admin-ui.ts; ampliar e2e/workspace-navigation.spec.ts de T2; docs/superpowers/validation/2026-10-30-frontend-consistency.md; playwright.config.ts/.github/workflows/ci.yml apenas se necessário para execução reproduzível.

- [x] Matriz visual: todas as oito filas admin, detalhe documental e detalhe serviço; participantes preenchidos com nomes longos, oficinas/documentos, contestação/comentário/associação/solicitação de conta. Adicionar garagem, conta e landing como sentinelas de regressão. Cobrir vazio, loading, erro, busy e409 nos fluxos críticos.
- [x] Fixtures sintéticas completas via route.fulfill/intercept HTTP somente no contexto de testes local; reutilizar autenticação/servidor locais já existentes. Não sobrescrever todas as respostas com sucesso genérico nem chamar endpoints de fixture na VPS. As seis jornadas reais continuam independentes dessas capturas de apresentação.
- [x] Automatizar ausência de overflow e comportamento de navegação/foco em todos os viewports da spec. Usar screenshots como evidência para revisão humana; se adotar baseline pixel, fixar ambiente/browser, gerar somente com dados sintéticos e revisar cada imagem antes de aceitar. Nenhum teste só de nome de classe/propriedade CSS.
- [x] Run: npm run lint; npm run test -- --run; npm run build; npm audit --audit-level=moderate; PLAYWRIGHT_BROWSERS_PATH=/private/tmp/nota-tecnica-playwright npm run test:e2e. Expected: suíte completa e novas verificações aprovadas, screenshots inspecionadas, sem perda de autorização nem fluxo.
- [x] Revisão independente única do conjunto na futura execução; corrigir Important/Critical com regressões quando houver comportamento afetado. Registrar antes/depois, rotas/viewports/estados cobertos e limitações, sem afirmar cobertura visual só pela contagem de testes.
- [x] Commit: test(ui): record visual acceptance across admin and application routes. Publicar apenas na etapa explícita da execução futura; depois verificar na Vercel reload/deep links, assets, CORS e aparência autenticada. Nenhum redeploy backend é necessário para CSS/UI.

## Critério de conclusão

Admin e área interna têm a mesma identidade do sistema, controles e estados coerentes; navegação mobile funciona e documento não estoura320px. Todas as filas/detalhes foram revisadas preenchidas e vazias, além de falhas, foco e permissões. A matriz visual, testes funcionais, build e release verificado são evidência conjunta. Não encerrar com apenas CSS importado, screenshots vazias ou testes verdes sem revisão visual.

Revisão do plano: T1 cobre controles/semântica/estilos ausentes; T2 cobre navegação/mobile; T3/T4 cobrem todas as rotas admin e estados; T5/T6/T7 cobrem o restante e comunicação; T8 comprova a matriz visual e preserva jornadas. Nenhuma mudança de produto/backend foi introduzida.
