import { Page, Locator } from "@playwright/test";

export class DataDrivenCart {
    constructor(readonly page: Page) {}

    // locators
    getItemInCart(itemName: string): Locator {
        return this.page.locator("div.cartSection h3", { hasText: itemName });
    }

    getCheckoutButton(): Locator {
        return this.page.getByRole("button", { name: "Checkout" });
    }

    // actions
    async clickCheckoutButton(): Promise<void> {
        await this.getCheckoutButton().click();
        await this.page.waitForLoadState("networkidle");
    }
}
