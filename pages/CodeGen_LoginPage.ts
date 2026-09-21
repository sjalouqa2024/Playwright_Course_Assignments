import { Page, Locator } from "@playwright/test";
import { CodeGenBasePage } from "./CodeGen_basePage";

export class CodeGen_LoginPage extends CodeGenBasePage {
    public registerBlinkingMessage: Locator;
    public readonly loginLabel: Locator;
    public readonly email: Locator;
    public readonly password: Locator;
    public readonly logInButton: Locator;
    public readonly forgotPasswordButton: Locator;
    public readonly registerLink: Locator;

    constructor (page:Page)
    {
        super(page);
        this.registerBlinkingMessage = page.locator("label.blink_me");
        this.loginLabel = page.getByRole("heading", { name: "Log in" });
        this.email = page.getByPlaceholder("email@example.com");
        this.password = page.getByPlaceholder("enter your passsword");
        this.logInButton = page.getByRole("button", { name: "Login" });
        this.forgotPasswordButton = page.getByRole("link", { name: "Forgot password?" });
        this.registerLink = page.locator("a.text-reset:has-text('Register here')");
    }
    override async openHomePage() :Promise<void>
    {
        await super.openHomePage();
        await this.registerBlinkingMessage.waitFor();
        await this.loginLabel.waitFor();
        await this.email.waitFor();
        await this.password.waitFor();
        await this.logInButton.waitFor();
        await this.forgotPasswordButton.waitFor();
        await this.registerLink.waitFor();
    }
     async loginUser(email: string, password: string): Promise<void> {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.logInButton.click(); 
    }
}