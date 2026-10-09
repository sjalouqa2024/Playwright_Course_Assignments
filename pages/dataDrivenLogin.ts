import { Page, Locator } from "@playwright/test";

export class DataDrivenLogin {
    constructor(readonly page: Page) {}

    async navigateToLoginPage(url: string): Promise<void> {
        await this.page.goto(url);
        await this.getLoginButton().waitFor({ state: "visible" });
    }

    // locators
    getEmail(): Locator {
        return this.page.getByPlaceholder("email@example.com");
    }

    getPassword(): Locator {
        return this.page.getByPlaceholder("enter your passsword");
    }

    getLoginButton(): Locator {
        return this.page.getByRole("button", { name: "Login" });
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
