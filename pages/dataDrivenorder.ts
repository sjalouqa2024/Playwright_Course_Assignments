import { Page, Locator } from "@playwright/test";

export class DataDrivenOrder {
    constructor(readonly page: Page) {}

    // locators
    private getField(label: string): Locator {
        return this.page.locator("div.field").filter({ hasText: label });
    }

    getCreditCardNumber(): Locator {
        return this.getField("Credit Card Number").locator("input");
    }

    getExpiryMonth(): Locator {
        return this.getField("Expiry Date").locator("select").nth(0);
    }

    getExpiryYear(): Locator {
        return this.getField("Expiry Date").locator("select").nth(1);
    }

    getCvvCode(): Locator {
        return this.getField("CVV Code").locator("input");
    }

    getNameOnCard(): Locator {
        return this.getField("Name on Card").locator("input");
    }

    getCouponInput(): Locator {
        return this.page.locator("input[name='coupon']");
    }

    getApplyCouponButton(): Locator {
        return this.page.getByRole("button", { name: "Apply Coupon" });
    }

    getCouponMessage(): Locator {
        return this.page.locator("p.mt-1.ng-star-inserted");
    }

    getEmail(): Locator {
        return this.page.locator(".user__name input[type='text']");
    }

    getEmailLabel(): Locator {
        return this.page.locator(".user__name label");
    }

    getCountry(): Locator {
        return this.page.locator("input[placeholder='Select Country']");
    }

    getCountryResults(): Locator {
        return this.page.locator("section.ta-results");
    }

    getCountryOption(fullValue: string): Locator {
        return this.getCountryResults().locator("button", {
            hasText: new RegExp(`^\\s*${fullValue}\\s*$`),
        });
    }

    getPlaceOrderButton(): Locator {
        return this.page.locator(".action__submit");
    }

    getOrderConfirmation(): Locator {
        return this.page.locator("h1.hero-primary");
    }

    // actions
    async fillCreditCardNumber(cardNumber: string): Promise<void> {
        await this.getCreditCardNumber().fill(cardNumber);
    }

    async selectExpiryDate(month: string, year: string): Promise<void> {
        await this.getExpiryMonth().selectOption(month);
        await this.getExpiryYear().selectOption(year);
    }

    async fillCvvCode(cvv: string): Promise<void> {
        await this.getCvvCode().fill(cvv);
    }

    async fillNameOnCard(name: string): Promise<void> {
        await this.getNameOnCard().fill(name);
    }

    async applyCoupon(coupon: string): Promise<void> {
        await this.getCouponInput().fill(coupon);
        await this.getApplyCouponButton().click();
        await this.getCouponMessage().waitFor({ state: "visible" });
    }

    // types the partial value, then picks the full value from the suggestions
    async selectCountry(partialValue: string, fullValue: string): Promise<void> {
        await this.getCountry().pressSequentially(partialValue, { delay: 150 });
        await this.getCountryResults().waitFor({ state: "visible" });
        await this.getCountryOption(fullValue).click();
    }

    async fillOrderForm(data: {
        cardNumber: string;
        month: string;
        year: string;
        cvv: string;
        nameOnCard: string;
        coupon: string;
        countryPartial: string;
        countryFull: string;
    }): Promise<void> {
        await this.fillCreditCardNumber(data.cardNumber);
        await this.selectExpiryDate(data.month, data.year);
        await this.fillCvvCode(data.cvv);
        await this.fillNameOnCard(data.nameOnCard);
        await this.applyCoupon(data.coupon);
        await this.selectCountry(data.countryPartial, data.countryFull);
    }

    async placeOrder(): Promise<void> {
        await this.getPlaceOrderButton().click();
    }
}
