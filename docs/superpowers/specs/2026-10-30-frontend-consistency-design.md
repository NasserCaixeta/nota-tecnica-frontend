# Consistência visual do frontend Nota Técnica

Data:30/10/2026. Estado: proposta para revisão do usuário, sem autorização de implementação nesta solicitação. Pedido: investigar o frontend e planejar correção da falta de identidade visual, começando pelo painel administrativo. Execução direta/main/commits separados são preferências já registradas, aplicáveis quando a implementação for solicitada.

## Objetivo

Fazer a área administrativa e os fluxos internos parecerem e funcionarem como o mesmo produto da landing: interface escura, vermelho da marca, tipografia legível, painéis e controles coerentes. Prioridade imediata é o admin, incluindo leitura e tomada de decisões em celular. O trabalho cobre apresentação e estados de interface; permissões, versões, decisões administrativas, pagamento e contratos HTTP existentes são preservados.

## Diagnóstico com evidência

Código-base frontend31cd7f2. Inspeção autenticada no deployment Vercel em30/10, somente leitura, com conta de testes. Visitadas oito filas administrativas, garagem e conta, além da landing. Screenshots privadas em /private/tmp/nota-tecnica-ui-audit; não contêm senha/token e não serão usadas como baseline de usuários reais.

- CSS está carregado: uma folha de estilos, fundo rgb17/17/17. Não é falha de publicação de assets.
- Participantes usa select nativo branco/preto, sem classe; conta usa vários inputs nativos. As páginas não consomem consistentemente Button/Input/Select/Panel já existentes.
- page-section, stack, data-row, data-row__meta, checkbox-grid, muted, eyebrow e shell__brand são usadas sem regras CSS correspondentes. Importar um arquivo não resolve essas definições ausentes.
- AdminShell/AppShell compartilham layout mínimo com coluna fixa240px, sem navegação ativa, identificação consistente e adaptação autenticada para celular. Admin não tem saída da sessão na própria navegação.
- Em viewport390px: participantes tem scrollWidth506px e garagem459px. A barra lateral ainda mede240px, comprimindo e cortando o conteúdo.
- Estado vazio ocupa só um parágrafo em várias páginas, sem contexto visual. AdminValidationQueuePage transforma falha HTTP em lista vazia; isso precisa ser distinguido durante a padronização dos estados.
- A landing promete ranking por preço/retrabalho, ausentes da fórmula aprovada. Corrigir a comunicação usando avaliação, prazo e volume de serviços comprovados, sem criar funcionalidades novas.
- Os testes atuais verificam comportamento; não há aceite visual de telas preenchidas e responsivas. Ter69 testes não comprova acabamento visual.

## Direção e alternativas

1. Remendo com seletores globais para todo button/input: rápido, mas mantém inconsistências de estrutura, navegação e estados e pode alterar a landing inadvertidamente.
2. Reaproveitar e completar componentes existentes, aplicar estrutura comum e migrar telas por fluxo: abordagem recomendada e base deste plano. Resolve as causas sem trocar tecnologia/identidade.
3. Trocar tema ou adotar biblioteca visual inteira: aumenta migração e cria outra identidade sem necessidade para o problema relatado.

A identidade atual da landing é a referência, não uma autorização para copiar seu layout editorial para filas administrativas. Preservar React/TypeScript/Vite, CSS/CSS Modules e componentes existentes; sem novo framework CSS, pacote de ícones ou biblioteca de componentes.

## Regras de interface

- Preservar fundo#111, superfícies#151515/#1a1a1a e vermelho de ação#c0281f; hierarquia tipográfica e bordas discretas. Ajustar cores secundárias para contraste normal mínimo4,5:1 e controles/foco3:1. Propostas: muted#a09b94 e vermelho de texto#ef675e, separados do vermelho de botão. Medir antes de aceitar.
- Base de espaçamento4/8/12/16/24/32px. Conteúdo com largura máxima1200px, min-width0, títulos/actions alinhados, formulários com labels acima dos campos e ajuda junto ao campo. Estados disabled, busy, erro e foco visível coerentes.
- Desktop>=960px: sidebar240px, conteúdo restante em minmax0/1fr; padding32px. Mobile<960px: cabeçalho compacto e menu expansível no fluxo, fechado inicialmente, sem overlay/modal; padding16px (24px em tablet). Menu acessível por teclado, indica aria-expanded/controls, fecha ao navegar ou Escape e devolve foco ao botão ao fechar por Escape.
- Navegação identifica seção ativa por NavLink/aria-current; subrotas de detalhe mantêm a seção da fila ativa. Branding Nota Técnica + contexto Administração; acesso a garagem/conta e sair, sem inventar contador global ou dashboard analítico sem API.
- Controles com área acionável mínima44px nas ações principais; sem Link envolvendo Button. Links de navegação com aparência de botão continuam links semânticos.
- Filas com título, descrição operacional, filtro existente, cards/listas legíveis e status em português. Mostrar quantidade apenas dos itens efetivamente carregados; não apresentar totais globais, busca ou paginação que a API não suporta.
- Análises agrupam contexto do pedido, documentos/evidências, justificativa e ações. Ação primária, secundária e destrutiva distintas; manter justificativas, bloqueios, expected_version e atualização após409. Não acrescentar aprovações automáticas nem remover proteções por CSS.
- Loading, vazio, erro com repetição e sucesso distinguíveis. Falha não pode dizer fila limpa. Status transmitido por texto, não só cor. Upload/download mantém duração/permissão existente; exibir indisponibilidade real sem simular R2, SMTP ou pagamentos.
- Toda página tem um h1, labels acessíveis, ordem de foco e navegação por teclado. Conteúdo/identificadores longos quebram linha sem ampliar documento.

## Escopo por prioridade

P0: base visual/controles e layout autenticado responsivo.
P1: participantes, oficinas, fila/detalhe de validações veiculares; depois serviços/detalhe, contestações, comentários, associações e solicitações de conta. Todas as rotas /admin existentes entram, inclusive estados preenchidos.
P2: garagem/documentos, oficinas/atendimentos, manutenção/convites/confirmação/avaliação, conta/pendências/assinatura/checkout/histórico comprado e participação. Reutilizar a base aprovada no admin.
P3: revisão de landing/consulta/ranking/perfil público/login/cadastro/recuperação para regressões de estilo e comunicação coerente. Manter composição da landing; corrigir promessa não implementada de preço/retrabalho.

## Aceite e limites

Viewports320x800,390x844,768x1024,1024x768 e1440x1000: sem overflow horizontal no documento; menu não ocupa sidebar permanente no celular; filas, detalhes e formulários utilizáveis. Verificar foco, contraste, zoom200%, estados vazios/preenchidos/loading/erro/salvando/409 e nomes/textos longos. Usar dados sintéticos e respostas HTTP controladas só no ambiente local de teste, sem popular ou alterar dados reais na VPS.

Aprovação visual precisa de screenshots revisadas e evidência de fluxo, não apenas snapshots aprovados automaticamente ou testes de classes CSS. A matriz deve cobrir todas as páginas admin; detalhes preenchidos que não existem na VPS são exercitados localmente. As seis jornadas existentes e permissões continuam passando.

Entrega em commits por etapa. Primeiro entregar admin completo e validado visualmente; só então expandir o padrão ao restante. Não implantar redesign, executar decisões administrativas ou alterar backend nesta tarefa de planejamento. R2/SMTP/cobrança real/dados comerciais/novas métricas e mecanismos de negócio continuam fora deste plano. Publicação visual será uma etapa explícita da futura execução, após validação.

## Revisão de planejamento

Builder check independente e somente leitura concluído: nenhuma dúvida importante impede o planejamento; identidade, prioridade, rotas, responsividade, estados e limites estão definidos. Escolhas de componentes/fixtures são decisões técnicas do executor. Autorrevisão do plano confirmou cobertura da spec emT1–T8. Nenhum código de aplicação, dado remoto ou configuração de publicação foi alterado.
