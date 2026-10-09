import { test, expect, Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import testData from "../test data/dataDrivenTestData.json";
import { DataDrivenRegister } from "../pages/dataDrivenRegister";
import { AuthApi } from "../api/AuthApi";
import { TokenHelper } from "../utils/TokenHelper";
import { DataDrivenDashboard } from "../pages/client/dataDrivenDashboard";
import { DataDrivenCart } from "../pages/client/dataDrivencart";
import { DataDrivenOrder } from "../pages/dataDrivenorder";
import { DataDrivenMyOrders } from "../pages/dataDrivenMyOrders";
import { DataDrivenOrderDetails } from "../pages/dataDrivenOrderDetails";

const { urls, registerPageData, loginPageData, dashboardPageData, orderPageData } = testData;

// a unique email per run so the register test does not fail on "user already exists"
const email = `${registerPageData.emailPrefix}${Date.now()}${registerPageData.emailDomain}`;
const screenshotDir = "screenshots/dataDriven";

// tests depend on the user created in the register test
test.describe.configure({ mode: "serial" });

const dataFilePath = path.join(__dirname, "../test data/dataDrivenTestData.json");

// writes the placed order id back into the json data file (only the id value is touched)
function saveOrderId(orderId: string): void {
    const content = fs.readFileSync(dataFilePath, "utf8");
    fs.writeFileSync(dataFilePath, content.replace(/("orderId":\s*")[^"]*(")/, `$1${orderId}$2`));
}

const dashboardUrl = new URL(urls.dashboardPath, urls.basePage).href;

// logs in through the API (the user only exists after the register test), then
// puts the token in the browser's local storage so the UI opens already logged in
async function loginAsRegisteredUser(page: Page): Promise<void> {
    const authApi = await AuthApi.create();
    const token = await authApi.login({ userEmail: email, userPassword: loginPageData.positive.password });
    await TokenHelper.inject(page, token);
    await page.goto(dashboardUrl);
    await expect(page).toHaveURL(new RegExp(urls.dashboardPath));
}

test.describe("Session 7 - Handling tests with APIs", () => {

    // A. register a new user
    test("A. register a new user", async ({ page }) => {
        const registerPage = new DataDrivenRegister(page);
        await registerPage.navigateToLoginPage(urls.uiLoginPage);
        await registerPage.openRegisterPage();

        await registerPage.fillRegisterForm({ ...registerPageData, email });
        await registerPage.checkAgeCheckbox();
        await expect(registerPage.getAgeCheckbox()).toBeChecked();
        await registerPage.clickRegisterButton();

        await expect(registerPage.getSuccessMessage()).toHaveText(registerPageData.successMessage);
        await page.screenshot({ path: `${screenshotDir}/0_register_success.png`, fullPage: true });
    });

    // B. negative login cases
    for (const negativeCase of loginPageData.negative) {
        test(`B. login negative - ${negativeCase.description}`, async () => {
            const authApi = await AuthApi.create();

            // an empty email in the data means "use the registered email"
            const response = await authApi.attemptLogin({
                userEmail: negativeCase.email || email,
                userPassword: negativeCase.password,
            });

            expect(response.status()).toBe(400);
            expect((await response.json()).message).toBe(negativeCase.expectedError);
        });
    }

    // B + C. positive login and dashboard assertion
    test(`B. login positive - ${loginPageData.positive.description}`, async ({ page }) => {
        await loginAsRegisteredUser(page);

        // C. assert being on the dashboard page
        await new DataDrivenDashboard(page).waitForProducts();
        await page.screenshot({ path: `${screenshotDir}/1_dashboard_after_login.png`, fullPage: true });
    });

    // D, E, F. dashboard -> cart -> checkout -> order
    test("D-F. add item to cart, checkout and place the order", async ({ page }) => {
        await loginAsRegisteredUser(page);
        const dashboardPage = new DataDrivenDashboard(page);
        await dashboardPage.waitForProducts();

        // number of orders before this purchase
        const myOrdersPage = new DataDrivenMyOrders(page);
        await myOrdersPage.navigateToMyOrders(new URL(urls.myOrdersPath, urls.basePage).href);
        const ordersBefore = await myOrdersPage.getOrderRows().count();
        await page.goto(dashboardUrl);
        await dashboardPage.waitForProducts();

        // D. the 3 items are displayed
        for (const itemName of dashboardPageData.availableItems) {
            await expect(dashboardPage.getItemName(itemName)).toBeVisible();
        }

        // D. negative - non existing item can't be added
        const addedNonExisting = await dashboardPage.addItemToCart(dashboardPageData.nonExistingItem);
        expect(addedNonExisting).toBeFalsy();
        await expect(dashboardPage.getItemCard(dashboardPageData.nonExistingItem)).toHaveCount(0);
        await expect(dashboardPage.getCartCountBadge()).toBeHidden();

        // D. positive - every item from the data is added and shown in the cart
        const itemsToAdd = dashboardPageData.itemsToAdd;
        for (const [index, itemName] of itemsToAdd.entries()) {
            const added = await dashboardPage.addItemToCart(itemName);
            expect(added).toBeTruthy();
            await expect(dashboardPage.getToastMessage()).toContainText(dashboardPageData.addedToCartMessage);
            await expect(dashboardPage.getCartCountBadge()).toHaveText(String(index + 1));
        }
        await page.screenshot({ path: `${screenshotDir}/2_add_to_cart.png`, fullPage: true });

        await dashboardPage.openCart();
        const cartPage = new DataDrivenCart(page);
        for (const itemName of itemsToAdd) {
            await expect(cartPage.getItemInCart(itemName)).toBeVisible();
        }
        await page.screenshot({ path: `${screenshotDir}/3_cart_page.png`, fullPage: true });

        // E. checkout page
        await cartPage.clickCheckoutButton();
        await expect(page).toHaveURL(new RegExp(urls.orderPath));
        const orderPage = new DataDrivenOrder(page);
        await expect(orderPage.getPlaceOrderButton()).toBeVisible();
        await page.screenshot({ path: `${screenshotDir}/4_checkout_page.png`, fullPage: true });

        // F. original values before filling
        await expect(orderPage.getCreditCardNumber()).toHaveValue(orderPageData.creditCardNumber.originalValue);
        if (orderPageData.email.inheritedFromLogin) {
            await expect(orderPage.getEmailLabel()).toHaveText(email);
        }

        // F. fill every field from the json
        await orderPage.fillOrderForm({
            cardNumber: orderPageData.creditCardNumber.newValue,
            month: orderPageData.expiryDate.month,
            year: orderPageData.expiryDate.year,
            cvv: orderPageData.cvvCode,
            nameOnCard: orderPageData.nameOnCard,
            coupon: orderPageData.applyCoupon.coupon,
            countryPartial: orderPageData.selectCountry.partialValue,
            countryFull: orderPageData.selectCountry.fullValue,
        });

        await expect(orderPage.getCreditCardNumber()).toHaveValue(orderPageData.creditCardNumber.newValue);
        await expect(orderPage.getExpiryMonth()).toHaveValue(orderPageData.expiryDate.month);
        await expect(orderPage.getExpiryYear()).toHaveValue(orderPageData.expiryDate.year);
        await expect(orderPage.getCvvCode()).toHaveValue(orderPageData.cvvCode);
        await expect(orderPage.getNameOnCard()).toHaveValue(orderPageData.nameOnCard);
        await expect(orderPage.getCouponMessage()).toHaveText(orderPageData.applyCoupon.expectedMessage);
        await expect(orderPage.getCountry()).toHaveValue(orderPageData.selectCountry.fullValue);
        await page.screenshot({ path: `${screenshotDir}/5_order_filled.png`, fullPage: true });

        // F. place the order
        await orderPage.placeOrder();
        await expect(orderPage.getOrderConfirmation()).toContainText(orderPageData.orderSuccessMessage, { ignoreCase: true });
        await page.screenshot({ path: `${screenshotDir}/6_order_placed.png`, fullPage: true });

        // G. the site creates one order (one id) per product in the cart
        const placedOrderIds = await orderPage.getPlacedOrderIds();
        expect(placedOrderIds).toHaveLength(itemsToAdd.length);
        const orderId = placedOrderIds[placedOrderIds.length - 1];
        expect(orderId).toMatch(/^[0-9a-f]{24}$/);
        saveOrderId(orderId);

        // G. orders page - the new orders are added to the list
        await myOrdersPage.navigateToMyOrders(new URL(urls.myOrdersPath, urls.basePage).href);
        await expect(myOrdersPage.getOrderRows()).toHaveCount(ordersBefore + placedOrderIds.length);
        for (const placedOrderId of placedOrderIds) {
            await expect(myOrdersPage.getOrderRow(placedOrderId)).toBeVisible();
        }
        await page.screenshot({ path: `${screenshotDir}/7_my_orders.png`, fullPage: true });

        // G. open the latest order (the table lists the newest orders first) and check its order id
        await myOrdersPage.viewOrder(orderId);
        const orderDetailsPage = new DataDrivenOrderDetails(page);
        await expect(orderDetailsPage.getOrderId()).toBeVisible();
        await expect(orderDetailsPage.getOrderId()).toHaveText(orderId);
        await expect(orderDetailsPage.getProductName()).toHaveText(new RegExp(itemsToAdd.join("|")));
        await page.screenshot({ path: `${screenshotDir}/8_order_details.png`, fullPage: true });
    });
});
