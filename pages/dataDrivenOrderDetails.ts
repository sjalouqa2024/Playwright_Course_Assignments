import { Page, Locator } from "@playwright/test";

export class DataDrivenOrderDetails {
    constructor(readonly page: Page) {}

    // navigation
    async navigateToOrderDetails(baseUrl: string, orderId: string): Promise<void> {
        await this.page.goto(`${baseUrl}/${orderId}`);
        await this.getOrderId().waitFor({ state: "visible" });
    }

    // locators
    getThankYouMessage(): Locator {
        return this.page.locator("p.tagline");
    }

    getOrderSummaryTitle(): Locator {
        return this.page.locator("div.email-title");
    }

    getOrderId(): Locator {
        return this.page.locator("small.col-title", { hasText: "Order Id" }).locator("xpath=following-sibling::div");
    }

    // billing / delivery blocks are found by their title
    private getAddressBlock(title: string): Locator {
        return this.page.locator("div.address").filter({ has: this.page.locator("div.content-title", { hasText: title }) });
    }

    getBillingAddressTitle(): Locator {
        return this.page.locator("div.content-title", { hasText: "Billing Address" });
    }

    getBillingEmail(): Locator {
        return this.getAddressBlock("Billing Address").locator("p.text").nth(0);
    }

    getBillingCountry(): Locator {
        return this.getAddressBlock("Billing Address").locator("p.text").nth(1);
    }

    getDeliveryAddressTitle(): Locator {
        return this.page.locator("div.content-title", { hasText: "Delivery Address" });
    }

    getDeliveryEmail(): Locator {
        return this.getAddressBlock("Delivery Address").locator("p.text").nth(0);
    }

    getDeliveryCountry(): Locator {
        return this.getAddressBlock("Delivery Address").locator("p.text").nth(1);
    }

    getProductOrderedTitle(): Locator {
        return this.page.locator("div.content-title", { hasText: "Product Ordered" });
    }

    getProductImage(): Locator {
        return this.page.locator("div.artwork-card-image img");
    }

    // an order with several products shows one card per product
    getProductNames(): Locator {
        return this.page.locator("div.artwork-card-info div.title");
    }

    getProductName(): Locator {
        return this.page.locator("div.artwork-card-info div.title");
    }

    getProductSeller(): Locator {
        return this.page.locator("div.artwork-card-info div.subject");
    }

    getProductPrice(): Locator {
        return this.page.locator("div.artwork-card-info div.price");
    }

    // buttons
    getViewOrdersButton(): Locator {
        return this.page.getByText("View Orders", { exact: true });
    }

    getHomeButton(): Locator {
        return this.page.getByRole("button", { name: "HOME" });
    }

    getOrdersButton(): Locator {
        return this.page.getByRole("button", { name: "ORDERS" });
    }

    getCartButton(): Locator {
        return this.page.locator("button[routerlink='/dashboard/cart']");
    }

    getSignOutButton(): Locator {
        return this.page.getByRole("button", { name: "Sign Out" });
    }

    // actions
    async clickViewOrders(): Promise<void> {
        await this.getViewOrdersButton().click();
    }
}
