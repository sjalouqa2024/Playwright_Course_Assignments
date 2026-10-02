import { Page, Locator } from "@playwright/test";

export class DataDrivenDashboard {
    constructor(readonly page: Page) {}

    // locators
    getProductCards(): Locator {
        return this.page.locator("div.card-body");
    }

    // item name is passed dynamically from the test data
    getItemCard(itemName: string): Locator {
        return this.getProductCards().filter({
            has: this.page.locator("b", { hasText: new RegExp(`^\\s*${itemName}\\s*$`, "i") }),
        });
    }

    getItemName(itemName: string): Locator {
        return this.getItemCard(itemName).locator("b");
    }

    getAddToCartButton(itemName: string): Locator {
        return this.getItemCard(itemName).getByRole("button", { name: /Add To Cart/i });
    }

    getToastMessage(): Locator {
        return this.page.locator("#toast-container");
    }

    getCartButton(): Locator {
        return this.page.locator("button[routerlink='/dashboard/cart']");
    }

    getCartCountBadge(): Locator {
        return this.getCartButton().locator("label");
    }

    // actions
    async waitForProducts(): Promise<void> {
        await this.getProductCards().first().waitFor({ state: "visible" });
    }

    // returns false when the item is not displayed on the dashboard
    async addItemToCart(itemName: string): Promise<boolean> {
        if ((await this.getItemCard(itemName).count()) === 0) {
            return false;
        }
        await this.getAddToCartButton(itemName).click();
        return true;
    }

    async openCart(): Promise<void> {
        await this.getCartButton().click();
        await this.page.waitForLoadState("networkidle");
    }
}
