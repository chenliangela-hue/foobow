import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45_000,
  workers: process.env.CI ? 2 : 2,
  expect: {
    timeout: 7_500
  },
  use: {
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
        browserName: "chromium"
      }
    },
    {
      name: "desktop-chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 1280, height: 900 }
      }
    }
  ]
});

