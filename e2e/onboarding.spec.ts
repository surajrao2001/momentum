import { test, expect } from "@playwright/test";

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("Welcome back")).toBeVisible();
});

test("redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/today");
  await expect(page).toHaveURL(/\/login/);
});
