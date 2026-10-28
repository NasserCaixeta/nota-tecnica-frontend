# Nota Técnica — frontend

React/TypeScript com Vite. Requer Node26 para reproduzir a CI.

```sh
npm ci
npm run dev
npm run lint
npm run test -- --run
npm run build
```

Em desenvolvimento, `VITE_API_BASE_URL` aponta para `http://localhost:8000/api/v1` por padrão. Nunca colocar credenciais de provedor em variáveis VITE, pois entram no bundle público.

O Dockerfile produz SPA com API relativa `/api/v1`. O Nginx encaminha `/api/` para o serviço interno `api:8000`, preserva rotas da SPA e não registra URLs de acesso. `PILOT_TRUSTED_PROXY` deve ser o IP/CIDR exato do proxy TLS autorizado, conforme o roteiro operacional; o padrão confia apenas no loopback. A API não deve ter porta publicada no host.

```sh
docker build -t nota-tecnica-frontend:pilot .
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/nota-tecnica-playwright npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/nota-tecnica-playwright npm run test:e2e
```

Playwright inicia este frontend e o backend irmão. Exige PostgreSQL/Redis locais e banco descartável `nota_tecnica_browser_test`; `NOTA_TECNICA_BACKEND_DIR`, `E2E_DATABASE_URL` e `E2E_REDIS_URL` permitem configurar o ambiente de testes. A fixture exige banco local `_test` e recria seu schema. Nunca usar um banco com participantes.

Aceite e preparação operacional estão em `../nota-tecnica-backend/docs/superpowers/validation/2026-10-21-piloto-{aceite,operacao}.md`. Os pagamentos locais são simulados; a homologação remota é uma etapa independente. Nenhum deploy é executado por estes comandos de build/teste.
