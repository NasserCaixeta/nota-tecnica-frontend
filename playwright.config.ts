import { defineConfig } from "@playwright/test";
import path from "node:path";
const backend = process.env.NOTA_TECNICA_BACKEND_DIR ?? path.resolve("../nota-tecnica-backend");
const quote = (value: string) => "'" + value.replaceAll("'", "'\\''") + "'";
export default defineConfig({
  testDir: "./e2e", workers: 1, fullyParallel: false, timeout: 45000,
  expect: { timeout: 10000 }, reporter: "list",
  use: { baseURL: "http://127.0.0.1:5179", trace: "off", screenshot: "only-on-failure" },
  webServer: [
    { command: `${quote(path.join(backend, ".venv/bin/python"))} -m tests.browser_server`, cwd: backend,
      env: { E2E_TEST_RUN: "1", E2E_DATABASE_URL: process.env.E2E_DATABASE_URL ?? "postgresql+asyncpg://nota_tecnica:nota_tecnica@localhost:55439/nota_tecnica_browser_test", E2E_REDIS_URL: process.env.E2E_REDIS_URL ?? "redis://localhost:55440/15" },
      url: "http://127.0.0.1:8009/health", timeout: 90000, reuseExistingServer: false },
    { command: "npm run dev -- --host 127.0.0.1 --port 5179 --strictPort", env: { VITE_API_BASE_URL: "http://127.0.0.1:8009/api/v1" }, url: "http://127.0.0.1:5179", reuseExistingServer: false },
  ],
});
