import { Page, Locator } from "@playwright/test";

export class DataDrivenLogin {
    constructor(readonly page: Page) {}

    async navigateToLoginPage(url: string): Promise<void> {
        await this.page.goto(url);
        await this.getLoginButton().waitFor({ state: "visible" });
    }

    // locators
    getEmail(): Locator {
        return this.page.locator("#userEmail");
    }

    getPassword(): Locator {
        return this.page.locator("#userPassword");
    }

    getLoginButton(): Locator {
        return this.page.locator("#login");
    }

    getErrorToast(): Locator {
        return this.page.locator("#toast-container");
    }

    getForgotPasswordLink(): Locator {
        return this.page.locator("a.forgot-password-link");
    }

    // actions
    async fillCredentials(email: string, password: string): Promise<void> {
        await this.getEmail().fill(email);
        await this.getPassword().fill(password);
    }

    async clickLoginButton(): Promise<void> {
        await this.getLoginButton().click();
    }

    async login(email: string, password: string): Promise<void> {
        await this.fillCredentials(email, password);
        await this.clickLoginButton();
    }
}
