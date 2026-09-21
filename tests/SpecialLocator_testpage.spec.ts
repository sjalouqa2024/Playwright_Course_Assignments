import { test, expect } from "@playwright/test";
import { SpecialLocatorProtoCommercePage} from "../pages/SpecialLocator_ProtoCommercePage";
import { SpecialLocator_ShopPage} from "../pages/SpecialLocator_ShopPage";
import { SpecialocatorsCheckoutPage} from "../pages/SpecialLocator_CheckoutPage";

test.use({
  launchOptions: { slowMo: 800 },
});

test("Complete ProtoCommerce purchase flow", async ({ page }) => {

    // -------------------------
    // ProtoCommerce
    // -------------------------

    const protoPage = new SpecialLocatorProtoCommercePage(page);

    await protoPage.openHomePage();
    await protoPage.submitData();

    await expect(protoPage.success_message).toBeVisible();


    // -------------------------
    // Shop
    // -------------------------

    const shopPage = new SpecialLocator_ShopPage(page);

    await shopPage.openShopPage();

    // Get product names before adding
const firstProductName = await shopPage.firstProductCard
  .locator("h4 a")
  .innerText();
const lastProductName = await shopPage.lastProductCard
  .locator("h4 a")
  .innerText();

    // Add first product
    await shopPage.addFirstProduct();

    // Add last product
    await shopPage.addLastProduct();

    // Verify they were added to cart
    await expect(shopPage.Checkout_Button).toContainText("Checkout ( 2 )");

    await shopPage.Checkout_Button.click();


    // -------------------------
    // Checkout
    // -------------------------

    const checkoutPage = new SpecialocatorsCheckoutPage(page);

    // Wait for checkout page to load
    await expect(checkoutPage.checkoutTable).toBeVisible();
    await expect(checkoutPage.total).toBeVisible();

 // Verify first product is in the table
  await expect(checkoutPage.checkoutTable).toContainText(firstProductName);

  // Verify last product is in the table
  await expect(checkoutPage.checkoutTable).toContainText(lastProductName);

  // Verify other checkout elements
  await expect(checkoutPage.continueShoppingButton).toBeVisible();
  await expect(checkoutPage.checkoutButton).toBeVisible();


});