import { Page, Locator } from "@playwright/test";

export class DataDrivenRegister {
    constructor(readonly page: Page) {}

    // navigation
    async navigateToLoginPage(url: string): Promise<void> {
        await this.page.goto(url);
        await this.getRegisterLink().waitFor({ state: "visible" });
    }

    async openRegisterPage(): Promise<void> {
        await this.getRegisterLink().click();
        await this.getRegisterHeading().waitFor({ state: "visible" });
    }

    // locators
    getRegisterLink(): Locator {
        return this.page.locator("a.text-reset");
    }

    getRegisterHeading(): Locator {
        return this.page.getByRole("heading", { name: "Register" });
    }

    getFirstName(): Locator {
        return this.page.locator("#firstName");
    }

    getLastName(): Locator {
        return this.page.locator("#lastName");
    }

    getEmail(): Locator {
        return this.page.locator("#userEmail");
    }

    getPhoneNumber(): Locator {
        return this.page.locator("#userMobile");
    }

    getOccupation(): Locator {
        return this.page.locator("select[formcontrolname='occupation']");
    }

    getGender(gender: string): Locator {
        return this.page.locator(`input[type='radio'][value='${gender}']`);
    }

    getPassword(): Locator {
        return this.page.locator("#userPassword");
    }

    getConfirmPassword(): Locator {
        return this.page.locator("#confirmPassword");
    }

    getAgeCheckbox(): Locator {
        return this.page.locator("input[formcontrolname='required']");
    }

    getRegisterButton(): Locator {
        return this.page.locator("input[type='submit'][value='Register']");
    }

    getSuccessMessage(): Locator {
        return this.page.locator("h1.headcolor");
    }

    // actions
    async checkAgeCheckbox(): Promise<void> {
        await this.getAgeCheckbox().check();
    }

    async clickRegisterButton(): Promise<void> {
        await this.getRegisterButton().click();
        await this.getSuccessMessage().waitFor({ state: "visible" });
    }

    async fillRegisterForm(data: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        occupation: string;
        gender: string;
        password: string;
        confirmPassword: string;
    }): Promise<void> {
        await this.getFirstName().fill(data.firstName);
        await this.getLastName().fill(data.lastName);
        await this.getEmail().fill(data.email);
        await this.getPhoneNumber().fill(data.phoneNumber);
        await this.getOccupation().selectOption({ label: data.occupation });
        await this.getGender(data.gender).check();
        await this.getPassword().fill(data.password);
        await this.getConfirmPassword().fill(data.confirmPassword);
    }
}
