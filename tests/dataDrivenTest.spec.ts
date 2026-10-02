import { test, expect, Page } from "@playwright/test";
import testData from "../test data/dataDrivenTestData.json";
import { DataDrivenRegister } from "../pages/dataDrivenRegister";
import { DataDrivenLogin } from "../pages/dataDrivenLogin";
import { DataDrivenDashboard } from "../pages/dataDrivenDashboard";
import { DataDrivenCart } from "../pages/dataDrivencart";
import { DataDrivenOrder } from "../pages/dataDrivenorder";

const { urls, registerPageData, loginPageData, dashboardPageData, orderPageData } = testData;

// a unique email per run so the register test does not fail on "user already exists"
const email = `${registerPageData.emailPrefix}${Date.now()}${registerPageData.emailDomain}`;
const screenshotDir = "screenshots/dataDriven";

// tests depend on the user created in the register test
test.describe.configure({ mode: "serial" });

async function loginAsRegisteredUser(page: Page): Promise<void> {
    const loginPage = new DataDrivenLogin(page);
    await loginPage.navigateToLoginPage(urls.loginPage);
    await loginPage.login(email, loginPageData.positive.password);
    await page.waitForURL(`**${urls.dashboardPath}`);
}

test.describe("Session 5 - data driven purchase flow", () => {

    // A. register a new user
    test("A. register a new user", async ({ page }) => {
        const registerPage = new DataDrivenRegister(page);
        await registerPage.navigateToLoginPage(urls.loginPage);
        await registerPage.openRegisterPage();

        await registerPage.fillRegisterForm({ ...registerPageData, email });
        await registerPage.checkAgeCheckbox();
        await expect(registerPage.getAgeCheckbox()).toBeChecked();
        await registerPage.clickRegisterButton();

        await expect(registerPage.getSuccessMessage()).toHaveText(registerPageData.successMessage);
        await page.screenshot({ path: `${screenshotDir}/0_register_success.png`, fullPage: true });
    });

    // B. negative login cases
    for (const [index, negativeCase] of loginPageData.negative.entries()) {
        test(`B. login negative - ${negativeCase.description}`, async ({ page }) => {
            const loginPage = new DataDrivenLogin(page);
            await loginPage.navigateToLoginPage(urls.loginPage);

            // an empty email in the data means "use the registered email"
            await loginPage.login(negativeCase.email || email, negativeCase.password);

            await expect(loginPage.getErrorToast()).toContainText(negativeCase.expectedError);
            await expect(page).not.toHaveURL(new RegExp(urls.dashboardPath));
            await page.screenshot({ path: `${screenshotDir}/1_login_negative_${index + 1}.png`, fullPage: true });
        });
    }

    // B + C. positive login and dashboard assertion
    test(`B. login positive - ${loginPageData.positive.description}`, async ({ page }) => {
        const loginPage = new DataDrivenLogin(page);
        await loginPage.navigateToLoginPage(urls.loginPage);
        await loginPage.login(email, loginPageData.positive.password);

        // C. assert being on the dashboard page
        await page.waitForURL(`**${urls.dashboardPath}`);
        expect(page.url()).toContain(urls.dashboardPath);
        await new DataDrivenDashboard(page).waitForProducts();
        await page.screenshot({ path: `${screenshotDir}/1_login_positive.png`, fullPage: true });
    });

    // D, E, F. dashboard -> cart -> checkout -> order
    test("D-F. add item to cart, checkout and place the order", async ({ page }) => {
        await loginAsRegisteredUser(page);
        const dashboardPage = new DataDrivenDashboard(page);
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

        // D. positive - existing item is added and shown in the cart
        const addedExisting = await dashboardPage.addItemToCart(dashboardPageData.itemToAdd);
        expect(addedExisting).toBeTruthy();
        await expect(dashboardPage.getToastMessage()).toContainText(dashboardPageData.addedToCartMessage);
        await expect(dashboardPage.getCartCountBadge()).toHaveText("1");
        await page.screenshot({ path: `${screenshotDir}/2_add_to_cart.png`, fullPage: true });

        await dashboardPage.openCart();
        const cartPage = new DataDrivenCart(page);
        await expect(cartPage.getItemInCart(dashboardPageData.itemToAdd)).toBeVisible();
        await page.screenshot({ path: `${screenshotDir}/3_cart_page.png`, fullPage: true });

        // E. checkout page
        await cartPage.clickCheckoutButton();
        await page.waitForURL(`**${urls.orderPath}**`);
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
    });
});
