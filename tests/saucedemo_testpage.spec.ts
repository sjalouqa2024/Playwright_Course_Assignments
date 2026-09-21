import { test, expect } from "@playwright/test";
import {SauceDemo_LoginPage } from "../pages/saucedemo_LoginPage";

test.use({
  launchOptions: { slowMo: 800 },
});

test("user can login", async ({ page }) => {
  const loginPage  = new SauceDemo_LoginPage (page);
  await loginPage .open();
  await loginPage .login();
  await expect(loginPage.products).toBeVisible();
  await loginPage.logout();
});