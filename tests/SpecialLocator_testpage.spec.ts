import { test, expect } from "@playwright/test";
import { SpecialLocatorProtoCommercePage} from "../pages/SpecialLocator_ProtoCommercePage";
import { SpecialLocator_ShopPage} from "../pages/SpecialLocator_ShopPage";
import { SpecialocatorsCheckoutPage} from "../pages/SpecialLocator_CheckoutPage";
import {SpecialocatorsDeliveryPage} from "../pages/SpecialLocator_DeliveryPage"

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

    await shopPage.openWebsite();
    // adding the first product
    await shopPage.addProduct("iphone X");
    // adding the last product
   await shopPage.addProduct("Blackberry");
   // open Check out page 
   await shopPage.opeCart();

    // -------------------------
    // Checkout
    // -------------------------

    const checkoutPage = new SpecialocatorsCheckoutPage(page);
   // click check out link
    await checkoutPage.checkOut();
    


// Delievery Page
const delivery = new SpecialocatorsDeliveryPage(page);
// Populate select country 
await delivery.SelectCountry("Ger","Germany");
// Agree to terms and conditions 
await delivery.agreeToTerms();
// Click on Purchase button
await delivery.purchase();

});