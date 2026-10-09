import { Page, Locator } from "@playwright/test";

export class DataDrivenMyOrders {
    constructor(readonly page: Page) {}

    // locators
    getPageHeading(): Locator {
        return this.page.getByRole("heading", { name: "Your Orders" });
    }

    getOrdersTable(): Locator {
        return this.page.locator("table.table");
    }

    getTableHeaders(): Locator {
        return this.getOrdersTable().locator("thead th");
    }

    getOrderRows(): Locator {
        return this.getOrdersTable().locator("tbody tr");
    }

    // order id is passed dynamically (it is rendered as the row header cell)
    getOrderRow(orderId: string): Locator {
        return this.getOrderRows().filter({ has: this.page.getByRole("rowheader", { name: orderId }) });
    }

    getOrderRowByProduct(productName: string): Locator {
        return this.getOrderRows().filter({ hasText: productName });
    }

    getOrderId(row: Locator): Locator {
        return row.locator("th[scope='row']");
    }

    getProductImage(row: Locator): Locator {
        return row.locator("img");
    }

    getProductName(row: Locator): Locator {
        return row.locator("td").nth(1);
    }

    getPrice(row: Locator): Locator {
        return row.locator("td").nth(2);
    }

    getOrderedDate(row: Locator): Locator {
        return row.locator("td").nth(3);
    }

    getViewButton(row: Locator): Locator {
        return row.getByRole("button", { name: "View" });
    }

    // view button of the order whose id is passed from the test data
    getViewButtonByOrderId(orderId: string): Locator {
        return this.getViewButton(this.getOrderRow(orderId));
    }

    getDeleteButton(row: Locator): Locator {
        return row.getByRole("button", { name: "Delete" });
    }

    getOrdersLimitNote(): Locator {
        return this.page.getByText("If orders Will be more than 7");
    }

    getNoOrdersMessage(): Locator {
        return this.page.getByText("You have No Orders to show at this time");
    }

    getGoBackToShopButton(): Locator {
        return this.page.getByRole("button", { name: "Go Back to Shop" });
    }

    getGoBackToCartButton(): Locator {
        return this.page.getByRole("button", { name: "Go Back to Cart" });
    }

    // sidebar navigation
    getHomeButton(): Locator {
        return this.page.getByRole("button", { name: "HOME" });
    }

    getOrdersButton(): Locator {
        return this.page.getByRole("button", { name: "ORDERS" });
    }

    getCartButton(): Locator {
        return this.page.locator("button[routerlink='/dashboard/cart']").first();
    }

    getSignOutButton(): Locator {
        return this.page.getByRole("button", { name: "Sign Out" });
    }

    getToastMessage(): Locator {
        return this.page.locator("#toast-container");
    }

    // actions
    async navigateToMyOrders(url: string): Promise<void> {
        await this.page.goto(url);
        // the heading only exists when there are orders, the back button is always there
        await this.getGoBackToShopButton().waitFor({ state: "visible" });
    }

    async waitForOrders(): Promise<void> {
        await this.getOrderRows().first().waitFor({ state: "visible" });
    }

    async viewOrder(orderId: string): Promise<void> {
        await this.getViewButtonByOrderId(orderId).click();
        await this.page.waitForURL(new RegExp(`order-details/${orderId}`));
    }

    async deleteOrder(orderId: string): Promise<void> {
        await this.getDeleteButton(this.getOrderRow(orderId)).click();
    }
}
