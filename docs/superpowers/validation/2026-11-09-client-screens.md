# Validação das telas públicas e da área do usuário

Data: 09/11/2026. Pedido: validar todas as telas além do painel administrativo. Código do produto: a28fcf4, sem mudanças nesta execução. Foram acrescentados testes reproduzíveis e este relatório.

## Resultado e alcance

As 28 entradas abaixo cobrem todas as telas não administrativas do roteador, mais recuperação sem link e página não encontrada. Cada entrada foi renderizada em320×800,390×844,768×1024,1024×768 e1440×1000:140 capturas sintéticas. Título, ausência de overflow horizontal, rótulos dos campos, erros do navegador e requisições HTTP não previstas foram verificados automaticamente. A navegação do app também é verificada nas telas com shell. Capturas mobile foram inspecionadas por tela; desktop foi inspecionado por amostragem dos principais layouts. Não se trata de comparação automática por pixel nem auditoria completa de acessibilidade.

A suíte completa passou com48 testes de navegador:30 da validação nova e18 anteriores, incluindo as seis jornadas com HTTP/backend local reais. Os testes unitários existentes, lint, TypeScript das fixtures, build e auditoria npm também passaram. A execução inicial de infraestrutura não iniciou o navegador porque o cache estava ausente; o Chromium correspondente à versão instalada foi baixado antes de validar as telas. Um texto esperado do estado vazio do ranking foi corrigido no teste para corresponder à interface existente; nenhum defeito funcional foi escondido com alteração de produção.

## Matriz de telas

Todas as entradas: aprovado nos cinco viewports indicados, com dados locais sintéticos quando necessário. Os identificadores11/42/7 e o pedido visual-order existem somente nas fixtures desta validação.

| Tela / cenário | Rota exercitada |
|---|---|
| landing | `/` |
| consulta | `/consultar` |
| ranking | `/oficinas` |
| perfil-oficina | `/oficinas/7` |
| login | `/entrar` |
| cadastro | `/cadastro` |
| recuperacao | `/esqueci-senha` |
| nova-senha | `/redefinir-senha#synthetic-reset-token` |
| nova-senha-sem-link | `/redefinir-senha` |
| convite | `/convite-servico` |
| participacao | `/app/participacao` |
| conta | `/app/conta` |
| notificacoes | `/app/notificacoes` |
| pedido | `/app/compras/visual-order` |
| assinatura | `/app/assinatura` |
| historico | `/app/historico/ABC1D23` |
| servicos-pendentes | `/app/servicos-pendentes` |
| servico | `/app/manutencoes/42` |
| atendimentos-oficina | `/app/oficinas/7/servicos` |
| garagem | `/app/garagem` |
| adicionar-veiculo | `/app/garagem/novo` |
| veiculo | `/app/garagem/11` |
| documentos-veiculo | `/app/garagem/11/documentos` |
| nova-manutencao | `/app/garagem/11/manutencoes/nova` |
| minhas-oficinas | `/app/oficinas` |
| nova-oficina | `/app/oficinas/nova` |
| representacao-oficina | `/app/oficinas/reivindicar` |
| nao-encontrada | `/pagina-inexistente` |

O redirecionamento `/app`→`/app/garagem` também foi exercitado. Rotas administrativas continuam cobertas pela suíte anterior.

## Estados e interações

- Consulta por placa: normalização, resultado, ausência de histórico, erro503 e recuperação.
- Ranking e perfil de oficina: preenchidos, ranking vazio, indisponibilidade e repetição.
- Entrada: credenciais recusadas, botão bloqueado durante envio, tentativa duplicada ignorada e retorno à rota protegida. Cadastro e aprovação continuam cobertos pela jornada real existente.
- Recuperação: solicitação reconhecida, link removido da URL, senhas divergentes sem chamada de gravação, redefinição com sucesso e acesso à solicitação de novo link.
- Participação e acesso: cliente sem acesso administrativo, participante pendente redirecionado e conta ainda acessível; guarda anônima confirmada também em produção.
- Conta: edição e retorno do perfil salvo; pedido de correção de identidade registrado como pendente. Notificações: marcar como lida e navegar à pendência.
- Garagem/documentos: dados preenchidos, garagem vazia, erro/reentrada, veículo apenas para leitura sem ação de nova manutenção. Upload e revisão documental reais locais preservados na suíte existente.
- Serviços: detalhe privado e publicado, edição com dados atuais, avaliação opcional, histórico de versões e ausência de ações privadas no serviço publicado. As jornadas reais locais preservam envio com comprovante, moderação, reconhecimento e contestação.
- Convites: participação pendente, vínculo necessário e atendimento liberado para conferência; fragmento privado removido da URL.
- Comercial: assinatura indisponível para checkout, pedido com benefício expirado, histórico sem permissão sem expor registros e URL Stripe live recusada pela UI de testes. Nenhuma cobrança real foi executada.
- Recuperação após503: ranking, perfil público, garagem, veículo, documentos, minhas oficinas, atendimentos da oficina, notificações, assinatura, histórico, serviço, pedido e pendências. A garagem usa recarga do navegador; as demais telas usam suas ações existentes.
- Estados vazios: garagem, notificações, representações, convites, histórico e ranking. Falha HTTP não foi aceita como resultado vazio nesses cenários.

## Produção

Verificação somente leitura em https://nota-tecnica-frontend.vercel.app:40 acessos,20 rotas em390px/1440px. Login da conta admin de testes, deep links, renderização, API/CORS, ausência de overflow e bloqueio de visitante anônimo aprovados. Nenhum registro real foi criado ou alterado. Telas dependentes de veículo, serviço, oficina ou pedido específicos foram validadas localmente com fixtures, sem inventar registros na VPS.

Rotas reais conferidas: `/`, `/consultar`, `/oficinas`, `/entrar`, `/cadastro`, `/esqueci-senha`, `/redefinir-senha`, `/convite-servico`, página inexistente, `/app`, garagem, adicionar veículo, minhas oficinas, nova oficina, representação, participação, conta, notificações, serviços pendentes e assinatura.

## Melhorias menores identificadas

1. Garagem: indisponibilidade é mostrada corretamente, mas falta ação de tentar novamente dentro da página; a recuperação exige recarga do navegador. Comportamento confirmado e documentado pelo teste.
2. Página404: informa que a página não existe, mas fica sem a estrutura visual e sem link para voltar à navegação. Rota não quebra o aplicativo, porém o acabamento é inferior às demais telas.
3. Alguns detalhes usam datas ISO e códigos de status no histórico de versões. Tradução/formatação pode ser uniformizada; não houve perda de dados ou bloqueio de operação.
4. Mantém-se o detalhe já conhecido da marca: no mobile, clicar Nota Técnica com menu aberto não recolhe o menu. Escape, botão e links internos continuam disponíveis.

Esses itens são preexistentes. Não houve alteração de comportamento do produto em uma solicitação de validação.

## Reprodução e evidências

```sh
npx tsc --noEmit --skipLibCheck --module ESNext --moduleResolution Bundler --target ES2020 --jsx react-jsx --esModuleInterop vite-env.d.ts e2e/client-appearance.spec.ts e2e/fixtures/client-ui.ts
npm run lint
npm run test -- --run
npm run build
npm audit --audit-level=moderate
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/nota-tecnica-playwright npm run test:e2e
```

A suíte Playwright recria somente o banco local com sufixo `_test`, seguindo as proteções já existentes. As novas fixtures interceptam rotas GET explícitas; gravações exigem handler específico do cenário e nunca são encaminhadas à VPS. Autenticação das jornadas reais continua independente das capturas sintéticas.

Evidências locais privadas em `/private/tmp/nota-tecnica-client-validation-20261109/`: `checks.log`, `audit.log`, `full-suite.log`, `matrix-final.log`, capturas sintéticas em `screenshots/` e capturas reais em `production/`. O browser conectado estava indisponível; a inspeção usou o Playwright do próprio projeto. SMTP, R2, cobrança real, todas as combinações de negócio e zoom nativo não foram homologados por esta validação de telas.

## Commits e estado remoto

- `2cdf16d`: matriz de telas, fixtures e cenários funcionais.
- `64b5e93`: relatório da validação, enviado à main.
- Vercel: deployment7664885662 concluído com sucesso para64b5e93; nenhuma mudança de código do produto.
- [GitHub Actions42690534711](https://github.com/NasserCaixeta/nota-tecnica-frontend/actions/runs/42690534711): job sem qualquer etapa executada. A anotação oficial informa: “The job was not started because your account is locked due to a billing issue.” Não é uma falha dos testes: o runner não iniciou. Os resultados locais88/88 unitários,48/48 de navegador, lint, build, TypeScript e auditoria sem vulnerabilidades permanecem como evidência; o CI remoto precisa ser reexecutado depois de regularizar a cobrança da conta GitHub.
