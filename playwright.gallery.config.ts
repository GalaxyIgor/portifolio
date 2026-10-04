import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/gallery-e2e",
  use: { baseURL: "http://127.0.0.1:3100" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command:
      "node node_modules/vite/bin/vite.js --config tests/fixtures/gallery/vite.config.mts --host 127.0.0.1 --port 3100 --strictPort",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
  },
});
