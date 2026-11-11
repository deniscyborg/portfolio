import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Test exactly what gets deployed: the built out/ folder
  webServer: {
    command: `npx --yes serve@14.2.4 out -l ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}/en/`,
    reuseExistingServer: !process.env.CI,
  },
});
